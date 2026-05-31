"use client";

import { useState, useMemo, useTransition } from "react";
import { Search, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { NoteDialog } from "@/components/note-dialog";
import { deleteNote } from "@/actions/notes";
import { getCategoryMeta, CATEGORIES } from "@/lib/notes";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function DeleteNoteButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteNote(id);
        toast.success("Note deleted");
        setOpen(false);
      } catch {
        toast.error("Failed to delete");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <button
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-[#ff4b4b]/10 hover:text-[#ff4b4b] transition-colors"
            title="Delete note"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        }
      />
      <AlertDialogContent className="rounded-2xl border-2 p-6 sm:max-w-sm">
        <AlertDialogHeader className="space-y-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#ff4b4b]/10 text-2xl mx-auto">
            🗑️
          </div>
          <AlertDialogTitle className="text-center text-xl font-black">
            Delete this note?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm">
            {title ? (
              <><span className="font-semibold text-foreground">&ldquo;{title}&rdquo;</span> will be permanently deleted.</>
            ) : (
              "This note will be permanently deleted."
            )}
            {" "}This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 mt-2 sm:flex-row">
          <AlertDialogCancel
            render={
              <button className="flex-1 rounded-xl border-2 py-2.5 text-sm font-bold hover:border-foreground transition-colors">
                Keep it
              </button>
            }
          />
          <AlertDialogAction
            render={
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="btn-duo flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#ff4b4b] py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_#cc3333] hover:bg-[#e04040] disabled:opacity-60 transition-colors"
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Delete
              </button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function NoteList({ notes }: { notes: Note[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = notes;
    if (activeCategory) list = list.filter((n) => n.category === activeCategory);
    const q = query.toLowerCase().trim();
    if (q) list = list.filter((n) =>
      n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
    return list;
  }, [notes, query, activeCategory]);

  return (
    <div className="space-y-4">
      {/* Search + filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-xl border-2 bg-card pl-10 pr-4 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:border-[color:var(--app-primary)] transition-colors"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground">✕</button>
          )}
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "rounded-full border-2 px-3 py-1 text-xs font-extrabold transition-all",
              !activeCategory
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:border-foreground/40"
            )}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className="rounded-full border-2 px-3 py-1 text-xs font-extrabold transition-all"
              style={
                activeCategory === cat.id
                  ? { backgroundColor: cat.color, borderColor: cat.color, color: "#fff" }
                  : { borderColor: `${cat.color}40`, color: cat.color }
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-1">
        {filtered.length === notes.length ? `${notes.length} notes` : `${filtered.length} of ${notes.length} notes`}
      </p>

      {/* Empty search state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-3xl">🔍</div>
          <div>
            <p className="font-extrabold">No notes found</p>
            <p className="text-sm text-muted-foreground mt-0.5">Try a different search or category</p>
          </div>
        </div>
      )}

      {/* Note cards grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((note) => {
            const cat = getCategoryMeta(note.category);
            return (
              <div
                key={note.id}
                className="group flex flex-col rounded-2xl border-2 bg-card overflow-hidden transition-all hover:shadow-md"
                style={{ borderTopColor: cat.color, borderTopWidth: "3px" }}
              >
                {/* Top: category badge */}
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-extrabold"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    {cat.label}
                  </span>
                  {/* Actions — always visible on mobile, hover-reveal on desktop */}
                  <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <NoteDialog
                      mode="edit"
                      note={{ id: note.id, title: note.title, content: note.content, category: note.category }}
                      trigger={
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      }
                    />
                    <DeleteNoteButton id={note.id} title={note.title} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-4 pb-4 space-y-1.5">
                  {note.title && (
                    <p className="font-extrabold text-[15px] leading-tight">{note.title}</p>
                  )}
                  <p className="text-sm font-mono text-foreground/80 leading-relaxed whitespace-pre-wrap line-clamp-6">
                    {note.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="border-t border-border px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {formatDate(note.updatedAt)}
                  </span>
                  {note.updatedAt > note.createdAt && (
                    <span className="text-[10px] text-muted-foreground italic">edited</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
