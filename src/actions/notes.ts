"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export interface NoteFormState {
  success: boolean;
  message: string;
}


// ── Read ──────────────────────────────────────────────────────────────────────

export async function getAllNotes() {
  const userId = await requireUserId();
  return db.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function addNote(
  _prev: NoteFormState,
  formData: FormData
): Promise<NoteFormState> {
  const userId = await requireUserId();
  const title    = (formData.get("title")    as string | null)?.trim() ?? "";
  const content  = (formData.get("content")  as string | null)?.trim() ?? "";
  const category = (formData.get("category") as string | null)?.trim() ?? "general";

  if (!content) return { success: false, message: "Content is required." };

  await db.note.create({ data: { userId, title, content, category } });
  revalidatePath("/notes");
  revalidatePath("/");
  return { success: true, message: "Note saved!" };
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateNote(
  _prev: NoteFormState,
  formData: FormData
): Promise<NoteFormState> {
  const userId   = await requireUserId();
  const id       = (formData.get("id")       as string | null)?.trim();
  const title    = (formData.get("title")    as string | null)?.trim() ?? "";
  const content  = (formData.get("content")  as string | null)?.trim() ?? "";
  const category = (formData.get("category") as string | null)?.trim() ?? "general";

  if (!id || !content) return { success: false, message: "Content is required." };

  const existing = await db.note.findUnique({ where: { id, userId } });
  if (!existing) return { success: false, message: "Note not found." };

  await db.note.update({ where: { id, userId }, data: { title, content, category } });
  revalidatePath("/notes");
  revalidatePath("/");
  return { success: true, message: "Note updated!" };
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteNote(id: string) {
  const userId = await requireUserId();
  await db.note.delete({ where: { id, userId } });
  revalidatePath("/notes");
  revalidatePath("/");
}
