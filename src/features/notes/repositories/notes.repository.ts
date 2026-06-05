import { db } from "@/lib/db";

export async function getAllNotes(userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (db as any).note.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
}

export async function findNoteById(id: string, userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (db as any).note.findUnique({ where: { id, userId } });
}

export async function createNote(data: { userId: string; title: string; content: string; category: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (db as any).note.create({ data });
}

export async function updateNote(id: string, userId: string, data: { title: string; content: string; category: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (db as any).note.update({ where: { id, userId }, data });
}

export async function deleteNote(id: string, userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (db as any).note.delete({ where: { id, userId } });
}
