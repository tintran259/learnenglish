import {
  getAllNotes, findNoteById, createNote, updateNote, deleteNote,
} from "@/features/notes/repositories/notes.repository";
import type { NoteFormState } from "@/features/notes/types/notes.types";

export async function getAllNotesService(userId: string) {
  return getAllNotes(userId);
}

export async function addNoteService(
  userId: string, title: string, content: string, category: string
): Promise<NoteFormState> {
  if (!content) return { success: false, message: "Content is required." };
  await createNote({ userId, title, content, category });
  return { success: true, message: "Note saved!" };
}

export async function updateNoteService(
  userId: string, id: string, title: string, content: string, category: string
): Promise<NoteFormState> {
  if (!content) return { success: false, message: "Content is required." };
  const existing = await findNoteById(id, userId);
  if (!existing) return { success: false, message: "Note not found." };
  await updateNote(id, userId, { title, content, category });
  return { success: true, message: "Note updated!" };
}

export async function deleteNoteService(userId: string, id: string) {
  await deleteNote(id, userId);
}
