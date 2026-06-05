"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  addVocabularyService, updateVocabularyService, deleteVocabularyService,
  getVocabularyPage as getVocabularyPageService,
  getAllVocabulary as getAllVocabularyService,
  getVocabularyStats,
} from "@/features/vocabulary/services/vocabulary.service";
import { refetchWordAudioService } from "@/features/vocabulary/services/review.service";
import type { VocabularyFormState } from "@/features/vocabulary/types/vocabulary.types";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function addVocabulary(
  _prev: VocabularyFormState,
  formData: FormData
): Promise<VocabularyFormState> {
  const userId = await requireUserId();
  const word = (formData.get("word") as string | null)?.trim();
  const meaning = (formData.get("meaning") as string | null)?.trim();
  if (!word || !meaning) return { success: false, message: "Word and meaning are required." };
  const userExamples = (formData.get("examples") as string | null)?.trim() ?? "";
  const result = await addVocabularyService(userId, word, meaning, userExamples);
  if (result.success) { revalidatePath("/"); revalidatePath("/vocabulary"); }
  return result;
}

export async function updateVocabulary(
  _prev: VocabularyFormState,
  formData: FormData
): Promise<VocabularyFormState> {
  const userId = await requireUserId();
  const id = (formData.get("id") as string | null)?.trim();
  const newWord = (formData.get("word") as string | null)?.trim();
  const meaning = (formData.get("meaning") as string | null)?.trim();
  if (!id || !newWord || !meaning) return { success: false, message: "All fields are required." };
  const userExamples = (formData.get("examples") as string | null)?.trim() ?? "";
  const result = await updateVocabularyService(userId, id, newWord, meaning, userExamples);
  if (result.success) { revalidatePath("/"); revalidatePath("/vocabulary"); }
  return result;
}

export async function deleteVocabulary(id: string) {
  const userId = await requireUserId();
  await deleteVocabularyService(userId, id);
  revalidatePath("/");
  revalidatePath("/vocabulary");
}

export async function getVocabularyPage(page: number, q: string) {
  const userId = await requireUserId();
  return getVocabularyPageService(userId, page, q);
}

export async function getAllVocabulary() {
  const userId = await requireUserId();
  return getAllVocabularyService(userId);
}

export async function getStats() {
  const userId = await requireUserId();
  return getVocabularyStats(userId);
}

export async function refetchWordAudio(id: string) {
  const userId = await requireUserId();
  const result = await refetchWordAudioService(userId, id);
  revalidatePath("/vocabulary");
  return result;
}
