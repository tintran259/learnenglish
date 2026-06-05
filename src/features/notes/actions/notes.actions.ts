"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  getAllNotesService, addNoteService, updateNoteService, deleteNoteService,
} from "@/features/notes/services/notes.service";
import type { NoteFormState } from "@/features/notes/types/notes.types";

export type { NoteFormState };

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getAllNotes() {
  const userId = await requireUserId();
  return getAllNotesService(userId);
}

export async function addNote(
  _prev: NoteFormState,
  formData: FormData
): Promise<NoteFormState> {
  const userId = await requireUserId();
  const title    = (formData.get("title")    as string | null)?.trim() ?? "";
  const content  = (formData.get("content")  as string | null)?.trim() ?? "";
  const category = (formData.get("category") as string | null)?.trim() ?? "general";
  const result = await addNoteService(userId, title, content, category);
  if (result.success) { revalidatePath("/notes"); revalidatePath("/"); }
  return result;
}

export async function updateNote(
  _prev: NoteFormState,
  formData: FormData
): Promise<NoteFormState> {
  const userId   = await requireUserId();
  const id       = (formData.get("id")       as string | null)?.trim();
  const title    = (formData.get("title")    as string | null)?.trim() ?? "";
  const content  = (formData.get("content")  as string | null)?.trim() ?? "";
  const category = (formData.get("category") as string | null)?.trim() ?? "general";
  if (!id) return { success: false, message: "Content is required." };
  const result = await updateNoteService(userId, id, title, content, category);
  if (result.success) { revalidatePath("/notes"); revalidatePath("/"); }
  return result;
}

export async function deleteNote(id: string) {
  const userId = await requireUserId();
  await deleteNoteService(userId, id);
  revalidatePath("/notes");
  revalidatePath("/");
}
