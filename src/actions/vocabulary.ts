"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { fetchDictionaryData } from "@/lib/dictionary";

// ── Auth guard ────────────────────────────────────────────────────────────────
async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

// ── Dictionary fetch with multi-word fallback ─────────────────────────────────
// Fetches full phrase first. For multi-word with no result, fetches each word
// in parallel and combines IPAs (e.g. "tuition cost" → /ˈtuːɪʃən/ /kɒst/).
async function fetchDict(word: string) {
  const data = await fetchDictionaryData(word);
  if (data.ipa || data.audioUrl) return data;

  if (word.includes(" ")) {
    const parts = word.trim().split(/\s+/);
    const results = await Promise.all(parts.map((w) => fetchDictionaryData(w)));
    const combinedIpa = results.map((r) => r.ipa).filter(Boolean).join(" ");
    const firstWithAudio = results.find((r) => r.audioUrl);
    return {
      ipa: combinedIpa,
      audioUrl: firstWithAudio?.audioUrl ?? "",
      audioUrlUk: firstWithAudio?.audioUrlUk ?? "",
      examples: [] as string[],
    };
  }

  return data;
}

// ── Get or create global Word, lazy-fetching dictionary data ──────────────────
async function resolveWord(wordStr: string) {
  const existing = await db.word.findUnique({ where: { word: wordStr } });

  if (existing && (existing.ipa || existing.audioUrl)) {
    return existing; // already has data — reuse without API call
  }

  const { ipa, audioUrl, audioUrlUk, examples } = await fetchDict(wordStr);

  if (existing) {
    // Word exists but missing dictionary data — update it
    return db.word.update({
      where: { id: existing.id },
      data: { ipa, audioUrl, audioUrlUk, ...(examples.length > 0 ? { examples: JSON.stringify(examples) } : {}) },
    });
  }

  // Brand new word — create with dictionary data
  return db.word.create({
    data: { word: wordStr, ipa, audioUrl, audioUrlUk, examples: JSON.stringify(examples) },
  });
}

// ── Flatten UserVocabulary + Word into a flat shape for components ─────────────
function flatten(uw: {
  id: string; userId: string; wordId: string; meaning: string;
  userExamples: string; reviewCount: number; correctCount: number;
  lastReviewedAt: Date | null; createdAt: Date; updatedAt: Date;
  word: { id: string; word: string; ipa: string; audioUrl: string; audioUrlUk: string; examples: string };
}) {
  return {
    id: uw.id,
    wordId: uw.wordId,
    word: uw.word.word,
    meaning: uw.meaning,
    ipa: uw.word.ipa,
    audioUrl: uw.word.audioUrl,
    audioUrlUk: uw.word.audioUrlUk,
    // Per-user examples take priority over shared API examples
    examples: uw.userExamples
      ? JSON.stringify(uw.userExamples.split("\n").map((s) => s.trim()).filter(Boolean))
      : uw.word.examples,
    userExamples: uw.userExamples, // raw text for edit form pre-fill
    reviewCount: uw.reviewCount,
    correctCount: uw.correctCount,
    lastReviewedAt: uw.lastReviewedAt,
    createdAt: uw.createdAt,
    updatedAt: uw.updatedAt,
  };
}

export interface VocabularyFormState {
  success: boolean;
  message: string;
}

// ── Add ───────────────────────────────────────────────────────────────────────
export async function addVocabulary(
  _prev: VocabularyFormState,
  formData: FormData
): Promise<VocabularyFormState> {
  const userId = await requireUserId();
  const word = (formData.get("word") as string | null)?.trim();
  const meaning = (formData.get("meaning") as string | null)?.trim();
  if (!word || !meaning) return { success: false, message: "Word and meaning are required." };

  // Duplicate check for this user
  const existing = await db.userVocabulary.findFirst({
    where: { userId, word: { word } },
  });
  if (existing) return { success: false, message: `"${word}" already exists.` };

  // Get or create global Word (API called only once per unique word across all users)
  const wordRecord = await resolveWord(word);

  const userExamples = (formData.get("examples") as string | null)?.trim() ?? "";

  await db.userVocabulary.create({
    data: { userId, wordId: wordRecord.id, meaning, userExamples },
  });

  revalidatePath("/");
  revalidatePath("/vocabulary");
  return { success: true, message: `"${word}" added!` };
}

// ── Update ────────────────────────────────────────────────────────────────────
export async function updateVocabulary(
  _prev: VocabularyFormState,
  formData: FormData
): Promise<VocabularyFormState> {
  const userId = await requireUserId();
  const id = (formData.get("id") as string | null)?.trim();
  const newWord = (formData.get("word") as string | null)?.trim();
  const meaning = (formData.get("meaning") as string | null)?.trim();
  if (!id || !newWord || !meaning) return { success: false, message: "All fields are required." };

  const current = await db.userVocabulary.findUnique({
    where: { id, userId },
    include: { word: true },
  });
  if (!current) return { success: false, message: "Word not found." };

  // Conflict check: another entry for this user with the new word string
  if (current.word.word !== newWord) {
    const conflict = await db.userVocabulary.findFirst({
      where: { userId, word: { word: newWord }, NOT: { id } },
    });
    if (conflict) return { success: false, message: `"${newWord}" already exists.` };
  }

  // Resolve Word (get or create for the new word string)
  const wordRecord = current.word.word === newWord
    ? current.word
    : await resolveWord(newWord);

  const userExamples = (formData.get("examples") as string | null)?.trim() ?? "";

  await db.userVocabulary.update({
    where: { id, userId },
    data: { meaning, wordId: wordRecord.id, userExamples },
  });

  revalidatePath("/");
  revalidatePath("/vocabulary");
  return { success: true, message: `"${newWord}" updated!` };
}

// ── Delete ────────────────────────────────────────────────────────────────────
// Only removes user's entry. The global Word stays for other users.
export async function deleteVocabulary(id: string) {
  const userId = await requireUserId();
  await db.userVocabulary.delete({ where: { id, userId } });
  revalidatePath("/");
  revalidatePath("/vocabulary");
}

// ── Read ──────────────────────────────────────────────────────────────────────
export async function getAllVocabulary() {
  const userId = await requireUserId();
  const rows = await db.userVocabulary.findMany({
    where: { userId },
    include: { word: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(flatten);
}

export async function getStats() {
  const userId = await requireUserId();
  const [total, reviewed, agg] = await Promise.all([
    db.userVocabulary.count({ where: { userId } }),
    db.userVocabulary.count({ where: { userId, reviewCount: { gt: 0 } } }),
    db.userVocabulary.aggregate({
      where: { userId },
      _sum: { reviewCount: true, correctCount: true },
    }),
  ]);

  const totalReviews = agg._sum.reviewCount ?? 0;
  const totalCorrect = agg._sum.correctCount ?? 0;
  const accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;
  return { total, reviewed, accuracy, totalReviews };
}

// ── Review ────────────────────────────────────────────────────────────────────
export async function getRandomVocabulary(count: number) {
  const userId = await requireUserId();
  const total = await db.userVocabulary.count({ where: { userId } });
  if (total === 0) return [];

  const take = Math.min(count, total);
  const skip = Math.max(0, Math.floor(Math.random() * (total - take + 1)));

  const rows = await db.userVocabulary.findMany({
    where: { userId },
    take,
    skip,
    orderBy: { createdAt: "asc" },
    include: { word: true },
  });

  // Fisher-Yates shuffle
  for (let i = rows.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rows[i], rows[j]] = [rows[j], rows[i]];
  }

  return rows.map(flatten);
}

export async function refetchWordAudio(id: string) {
  const userId = await requireUserId();
  const userWord = await db.userVocabulary.findUnique({
    where: { id, userId },
    include: { word: true },
  });
  if (!userWord) return { audioUrl: "", audioUrlUk: "", ipa: "" };

  const { ipa, audioUrl, audioUrlUk, examples } = await fetchDict(userWord.word.word);
  await db.word.update({
    where: { id: userWord.wordId },
    data: {
      ipa,
      audioUrl,
      audioUrlUk,
      // Only update shared examples if API returned something new
      ...(examples.length > 0 ? { examples: JSON.stringify(examples) } : {}),
    },
  });
  revalidatePath("/vocabulary");
  return { audioUrl, audioUrlUk, ipa };
}

export async function markReview(id: string, correct: boolean) {
  const userId = await requireUserId();
  const today = new Date().toISOString().split("T")[0];

  await Promise.all([
    db.userVocabulary.update({
      where: { id, userId },
      data: {
        reviewCount: { increment: 1 },
        correctCount: correct ? { increment: 1 } : undefined,
        lastReviewedAt: new Date(),
      },
    }),
    db.dailyReview.upsert({
      where: { userId_date: { userId, date: today } },
      create: { userId, date: today, reviewed: 1, correct: correct ? 1 : 0 },
      update: {
        reviewed: { increment: 1 },
        ...(correct ? { correct: { increment: 1 } } : {}),
      },
    }),
  ]);

  // Streak — only update once per day
  const settings = await db.userSettings.findUnique({ where: { userId } });
  if (settings?.lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const currentStreak =
      settings?.lastActiveDate === yesterdayStr ? (settings.currentStreak ?? 0) + 1 : 1;
    const bestStreak = Math.max(currentStreak, settings?.bestStreak ?? 0);
    await db.userSettings.upsert({
      where: { userId },
      create: { userId, currentStreak, bestStreak, lastActiveDate: today },
      update: { currentStreak, bestStreak, lastActiveDate: today },
    });
  }
}
