"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { fetchDictionaryData } from "@/lib/dictionary";

// ── Helper: get userId or throw ───────────────────────────────────────────────
async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

// Tries the full phrase first. For multi-word phrases with no result, fetches
// each word in parallel and combines their IPAs (e.g. "tuition cost" →
// /ˈtuːɪʃən/ /kɒst/). Audio comes from the first word that has it.
async function fetchDict(word: string) {
  const data = await fetchDictionaryData(word);
  if (data.ipa || data.audioUrl) return data;

  if (word.includes(" ")) {
    const parts = word.trim().split(/\s+/);
    const results = await Promise.all(parts.map((w) => fetchDictionaryData(w)));

    const combinedIpa = results
      .map((r) => r.ipa)
      .filter(Boolean)
      .join(" ");

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

  if (!word || !meaning) {
    return { success: false, message: "Word and meaning are required." };
  }

  const existing = await db.vocabulary.findUnique({
    where: { userId_word: { userId, word } },
  });
  if (existing) {
    return { success: false, message: `"${word}" already exists.` };
  }

  const manualExamplesRaw = (formData.get("examples") as string | null)?.trim() ?? "";
  const { ipa, audioUrl, audioUrlUk, examples: autoExamples } = await fetchDict(word);
  const examples = manualExamplesRaw
    ? manualExamplesRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : autoExamples;

  await db.vocabulary.create({
    data: { userId, word, meaning, ipa, audioUrl, audioUrlUk, examples: JSON.stringify(examples) },
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
  const word = (formData.get("word") as string | null)?.trim();
  const meaning = (formData.get("meaning") as string | null)?.trim();

  if (!id || !word || !meaning) {
    return { success: false, message: "All fields are required." };
  }

  const conflict = await db.vocabulary.findFirst({
    where: { userId, word, NOT: { id } },
  });
  if (conflict) {
    return { success: false, message: `"${word}" already exists.` };
  }

  const manualExamplesRaw = (formData.get("examples") as string | null)?.trim() ?? "";
  const { ipa, audioUrl, audioUrlUk, examples: autoExamples } = await fetchDict(word);
  const examples = manualExamplesRaw
    ? manualExamplesRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : autoExamples;

  await db.vocabulary.update({
    where: { id, userId },
    data: { word, meaning, ipa, audioUrl, audioUrlUk, examples: JSON.stringify(examples) },
  });

  revalidatePath("/");
  revalidatePath("/vocabulary");
  return { success: true, message: `"${word}" updated!` };
}

// ── Delete ────────────────────────────────────────────────────────────────────
export async function deleteVocabulary(id: string) {
  const userId = await requireUserId();
  await db.vocabulary.delete({ where: { id, userId } });
  revalidatePath("/");
  revalidatePath("/vocabulary");
}

// ── Read ──────────────────────────────────────────────────────────────────────
export async function getAllVocabulary() {
  const userId = await requireUserId();
  return db.vocabulary.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStats() {
  const userId = await requireUserId();

  const [total, reviewed, agg] = await Promise.all([
    db.vocabulary.count({ where: { userId } }),
    db.vocabulary.count({ where: { userId, reviewCount: { gt: 0 } } }),
    db.vocabulary.aggregate({
      where: { userId },
      _sum: { reviewCount: true, correctCount: true },
    }),
  ]);

  const totalReviews = agg._sum.reviewCount ?? 0;
  const totalCorrect = agg._sum.correctCount ?? 0;
  const accuracy = totalReviews > 0
    ? Math.round((totalCorrect / totalReviews) * 100)
    : 0;

  return { total, reviewed, accuracy, totalReviews };
}

// ── Review ────────────────────────────────────────────────────────────────────
export async function getRandomVocabulary(count: number) {
  const userId = await requireUserId();
  const total = await db.vocabulary.count({ where: { userId } });
  if (total === 0) return [];

  const take = Math.min(count, total);
  const skip = Math.max(0, Math.floor(Math.random() * (total - take + 1)));

  const words = await db.vocabulary.findMany({
    where: { userId },
    take,
    skip,
    orderBy: { createdAt: "asc" },
  });

  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }

  return words;
}

export async function refetchWordAudio(id: string) {
  const userId = await requireUserId();
  const vocab = await db.vocabulary.findUnique({ where: { id, userId } });
  if (!vocab) return { audioUrl: "", audioUrlUk: "", ipa: "" };

  const { ipa, audioUrl, audioUrlUk, examples } = await fetchDict(vocab.word);
  await db.vocabulary.update({
    where: { id, userId },
    data: {
      ipa,
      audioUrl,
      audioUrlUk,
      // Preserve manually-entered examples when the fetch returns nothing
      ...(examples.length > 0 ? { examples: JSON.stringify(examples) } : {}),
    },
  });
  revalidatePath("/vocabulary");
  return { audioUrl, audioUrlUk, ipa };
}

export async function markReview(id: string, correct: boolean) {
  const userId = await requireUserId();
  await db.vocabulary.update({
    where: { id, userId },
    data: {
      reviewCount: { increment: 1 },
      correctCount: correct ? { increment: 1 } : undefined,
      lastReviewedAt: new Date(),
    },
  });
}
