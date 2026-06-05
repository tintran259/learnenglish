import { db } from "@/lib/db";
import type { VocabularyWord } from "@/features/vocabulary/types/vocabulary.types";
import { VOCABULARY_PAGE_SIZE } from "@/features/vocabulary/constants/vocabulary.constants";

type RawUserVocabulary = {
  id: string; userId: string; wordId: string; meaning: string;
  userExamples: string; reviewCount: number; correctCount: number;
  lastReviewedAt: Date | null; createdAt: Date; updatedAt: Date;
  word: { id: string; word: string; ipa: string; audioUrl: string; audioUrlUk: string; examples: string };
};

export function flattenVocabulary(uw: RawUserVocabulary): VocabularyWord {
  return {
    id: uw.id,
    wordId: uw.wordId,
    word: uw.word.word,
    meaning: uw.meaning,
    ipa: uw.word.ipa,
    audioUrl: uw.word.audioUrl,
    audioUrlUk: uw.word.audioUrlUk,
    examples: uw.userExamples
      ? JSON.stringify(uw.userExamples.split("\n").map((s) => s.trim()).filter(Boolean))
      : uw.word.examples,
    userExamples: uw.userExamples,
    reviewCount: uw.reviewCount,
    correctCount: uw.correctCount,
    lastReviewedAt: uw.lastReviewedAt,
    createdAt: uw.createdAt,
    updatedAt: uw.updatedAt,
  };
}

const wordInclude = { word: true } as const;

export async function findWordByString(word: string) {
  return db.word.findUnique({ where: { word } });
}

export async function createWord(data: { word: string; ipa: string; audioUrl: string; audioUrlUk: string; examples: string }) {
  return db.word.create({ data });
}

export async function updateWord(id: string, data: { ipa?: string; audioUrl?: string; audioUrlUk?: string; examples?: string }) {
  return db.word.update({ where: { id }, data });
}

export async function findUserVocabularyByWord(userId: string, wordString: string) {
  return db.userVocabulary.findFirst({ where: { userId, word: { word: wordString } } });
}

export async function findUserVocabularyById(id: string, userId: string) {
  return db.userVocabulary.findUnique({ where: { id, userId }, include: wordInclude });
}

export async function createUserVocabulary(data: { userId: string; wordId: string; meaning: string; userExamples: string }) {
  return db.userVocabulary.create({ data });
}

export async function updateUserVocabulary(id: string, userId: string, data: { meaning: string; wordId: string; userExamples: string }) {
  return db.userVocabulary.update({ where: { id, userId }, data });
}

export async function deleteUserVocabulary(id: string, userId: string) {
  return db.userVocabulary.delete({ where: { id, userId } });
}

export async function getVocabularyPage(userId: string, page: number, q: string) {
  const search = q.trim();
  const where = {
    userId,
    ...(search ? { OR: [{ word: { word: { contains: search } } }, { meaning: { contains: search } }] } : {}),
  };
  const [rows, total] = await Promise.all([
    db.userVocabulary.findMany({
      where, include: wordInclude, orderBy: { createdAt: "desc" },
      skip: (page - 1) * VOCABULARY_PAGE_SIZE,
      take: VOCABULARY_PAGE_SIZE,
    }),
    db.userVocabulary.count({ where }),
  ]);
  return { words: rows.map(flattenVocabulary), total, totalPages: Math.max(1, Math.ceil(total / VOCABULARY_PAGE_SIZE)) };
}

export async function getAllVocabulary(userId: string) {
  const rows = await db.userVocabulary.findMany({
    where: { userId }, include: wordInclude, orderBy: { createdAt: "desc" },
  });
  return rows.map(flattenVocabulary);
}

export async function getVocabularyStats(userId: string) {
  const [total, reviewed, agg] = await Promise.all([
    db.userVocabulary.count({ where: { userId } }),
    db.userVocabulary.count({ where: { userId, reviewCount: { gt: 0 } } }),
    db.userVocabulary.aggregate({ where: { userId }, _sum: { reviewCount: true, correctCount: true } }),
  ]);
  const totalReviews = agg._sum.reviewCount ?? 0;
  const totalCorrect = agg._sum.correctCount ?? 0;
  return { total, reviewed, accuracy: totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0, totalReviews };
}

export async function countAllVocabulary(userId: string) {
  return db.userVocabulary.count({ where: { userId } });
}

export async function getRandomVocabularyRows(userId: string, take: number, skip: number) {
  const rows = await db.userVocabulary.findMany({
    where: { userId }, take, skip, orderBy: { createdAt: "asc" }, include: wordInclude,
  });
  return rows.map(flattenVocabulary);
}

export async function updateReviewStats(id: string, userId: string, correct: boolean) {
  return db.userVocabulary.update({
    where: { id, userId },
    data: {
      reviewCount: { increment: 1 },
      correctCount: correct ? { increment: 1 } : undefined,
      lastReviewedAt: new Date(),
    },
  });
}
