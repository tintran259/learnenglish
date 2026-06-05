import {
  countAllVocabulary, getRandomVocabularyRows, updateReviewStats,
  findUserVocabularyById, updateWord,
} from "@/features/vocabulary/repositories/vocabulary.repository";
import { fetchDict } from "@/features/vocabulary/services/dictionary.service";
import {
  getDailyReview, upsertDailyReview, getUserSettings, upsertUserSettings,
} from "@/features/stats/repositories/stats.repository";
import type { VocabularyWord } from "@/features/vocabulary/types/vocabulary.types";

export async function getRandomVocabularyService(userId: string, count: number): Promise<VocabularyWord[]> {
  const total = await countAllVocabulary(userId);
  if (total === 0) return [];

  const take = Math.min(count, total);
  const skip = Math.max(0, Math.floor(Math.random() * (total - take + 1)));
  const rows = await getRandomVocabularyRows(userId, take, skip);

  for (let i = rows.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rows[i], rows[j]] = [rows[j], rows[i]];
  }
  return rows;
}

export async function markReviewService(userId: string, id: string, correct: boolean) {
  const today = new Date().toISOString().split("T")[0];

  await Promise.all([
    updateReviewStats(id, userId, correct),
    upsertDailyReview(userId, today, 1, correct ? 1 : 0),
  ]);

  const settings = await getUserSettings(userId);
  if (settings?.lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const currentStreak =
      settings?.lastActiveDate === yesterdayStr ? (settings.currentStreak ?? 0) + 1 : 1;
    const bestStreak = Math.max(currentStreak, settings?.bestStreak ?? 0);
    await upsertUserSettings(userId, { currentStreak, bestStreak, lastActiveDate: today });
  }
}

export async function refetchWordAudioService(userId: string, id: string) {
  const userWord = await findUserVocabularyById(id, userId);
  if (!userWord) return { audioUrl: "", audioUrlUk: "", ipa: "" };

  const { ipa, audioUrl, audioUrlUk, examples } = await fetchDict(userWord.word.word);
  await updateWord(userWord.wordId, {
    ipa, audioUrl, audioUrlUk,
    ...(examples.length > 0 ? { examples: JSON.stringify(examples) } : {}),
  });
  return { audioUrl, audioUrlUk, ipa };
}
