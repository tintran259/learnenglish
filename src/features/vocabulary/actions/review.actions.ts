"use server";

import { auth } from "@/auth";
import { getRandomVocabularyService, markReviewService } from "@/features/vocabulary/services/review.service";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getRandomVocabulary(count: number) {
  const userId = await requireUserId();
  return getRandomVocabularyService(userId, count);
}

export async function markReview(id: string, correct: boolean) {
  const userId = await requireUserId();
  await markReviewService(userId, id, correct);
}
