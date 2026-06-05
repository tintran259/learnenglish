import {
  findWordByString, createWord, updateWord,
  findUserVocabularyByWord, findUserVocabularyById,
  createUserVocabulary, updateUserVocabulary, deleteUserVocabulary,
  getVocabularyPage, getAllVocabulary, getVocabularyStats,
} from "@/features/vocabulary/repositories/vocabulary.repository";
import { fetchDict } from "@/features/vocabulary/services/dictionary.service";
import type { VocabularyFormState } from "@/features/vocabulary/types/vocabulary.types";

async function resolveWord(wordStr: string) {
  const existing = await findWordByString(wordStr);

  if (existing && (existing.ipa || existing.audioUrl)) return existing;

  const { ipa, audioUrl, audioUrlUk, examples } = await fetchDict(wordStr);

  if (existing) {
    return updateWord(existing.id, {
      ipa, audioUrl, audioUrlUk,
      ...(examples.length > 0 ? { examples: JSON.stringify(examples) } : {}),
    });
  }

  return createWord({ word: wordStr, ipa, audioUrl, audioUrlUk, examples: JSON.stringify(examples) });
}

export async function addVocabularyService(
  userId: string, word: string, meaning: string, userExamples: string
): Promise<VocabularyFormState> {
  const existing = await findUserVocabularyByWord(userId, word);
  if (existing) return { success: false, message: `"${word}" already exists.` };

  const wordRecord = await resolveWord(word);
  await createUserVocabulary({ userId, wordId: wordRecord.id, meaning, userExamples });
  return { success: true, message: `"${word}" added!` };
}

export async function updateVocabularyService(
  userId: string, id: string, newWord: string, meaning: string, userExamples: string
): Promise<VocabularyFormState> {
  const current = await findUserVocabularyById(id, userId);
  if (!current) return { success: false, message: "Word not found." };

  if (current.word.word !== newWord) {
    const conflict = await findUserVocabularyByWord(userId, newWord);
    if (conflict && conflict.id !== id) return { success: false, message: `"${newWord}" already exists.` };
  }

  const wordRecord = current.word.word === newWord ? current.word : await resolveWord(newWord);
  await updateUserVocabulary(id, userId, { meaning, wordId: wordRecord.id, userExamples });
  return { success: true, message: `"${newWord}" updated!` };
}

export async function deleteVocabularyService(userId: string, id: string) {
  await deleteUserVocabulary(id, userId);
}

export { getVocabularyPage, getAllVocabulary, getVocabularyStats };
