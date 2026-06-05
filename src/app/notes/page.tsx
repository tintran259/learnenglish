import { Plus } from "lucide-react";
import { getAllNotes } from "@/features/notes/actions/notes.actions";
import { NoteList } from "@/features/notes/components/note-list";
import { NoteDialog } from "@/features/notes/components/note-dialog";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notes" };

export default async function NotesPage() {
  const notes = await getAllNotes();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">My Notes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Grammar structures, phrases, and patterns you want to remember</p>
        </div>
        <NoteDialog
          mode="add"
          trigger={
            <button className="btn-duo flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold text-white" style={{ backgroundColor: "var(--app-primary)", boxShadow: "0 4px 0 var(--app-primary-shadow)" }}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add note</span>
              <span className="sm:hidden">Add</span>
            </button>
          }
        />
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-4xl">📝</div>
          <div>
            <p className="font-extrabold text-xl">No notes yet</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">Save grammar structures, phrases, or any patterns you encounter while learning.</p>
          </div>
          <NoteDialog
            mode="add"
            trigger={
              <button className="btn-duo flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold text-white" style={{ backgroundColor: "var(--app-primary)", boxShadow: "0 4px 0 var(--app-primary-shadow)" }}>
                <Plus className="h-4 w-4" />Add your first note
              </button>
            }
          />
        </div>
      ) : (
        <NoteList notes={notes} />
      )}
    </main>
  );
}
