"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog, DialogClose, DialogContent,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { addNote, updateNote, type NoteFormState } from "@/actions/notes";
import { CATEGORIES } from "@/lib/notes";

interface NoteData {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface NoteDialogProps {
  mode: "add" | "edit";
  note?: NoteData;
  trigger: React.ReactNode;
}

const initial: NoteFormState = { success: false, message: "" };

export function NoteDialog({ mode, note, trigger }: NoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(note?.category ?? "general");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const action = mode === "add" ? addNote : updateNote;
  const [state, formAction, isPending] = useActionState(action, initial);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  useEffect(() => {
    if (open) {
      formRef.current?.reset();
      setCategory(note?.category ?? "general");
    }
  }, [open, note?.category]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />

      <DialogContent className="sm:max-w-md rounded-2xl border-2 p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-black">
            {mode === "add" ? "📝 New note" : "📝 Edit note"}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4 pt-1">
          {mode === "edit" && note && (
            <input type="hidden" name="id" value={note.id} />
          )}
          {/* Hidden category field — driven by state */}
          <input type="hidden" name="category" value={category} />

          {/* Category picker */}
          <div className="space-y-2">
            <Label className="text-sm font-bold">Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className="rounded-full px-3 py-1 text-xs font-extrabold border-2 transition-all"
                  style={
                    category === cat.id
                      ? { backgroundColor: cat.color, borderColor: cat.color, color: "#fff" }
                      : { borderColor: `${cat.color}40`, color: cat.color }
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor={`note-title-${mode}`} className="text-sm font-bold">
              Title <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <input
              id={`note-title-${mode}`}
              name="title"
              type="text"
              placeholder="e.g. Type 2 Conditional"
              defaultValue={mode === "edit" ? note?.title : ""}
              autoComplete="off"
              className="h-11 w-full rounded-xl border-2 bg-background px-3 text-sm font-semibold placeholder:text-muted-foreground focus:outline-none focus:border-[color:var(--app-primary)] transition-colors"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label htmlFor={`note-content-${mode}`} className="text-sm font-bold">
              Structure / Content
            </Label>
            <textarea
              id={`note-content-${mode}`}
              name="content"
              required
              rows={5}
              placeholder={"If + S + V2/ed, S + would + V\ne.g. If I had more time, I would study harder.\n\nUse: hypothetical present/future situations."}
              defaultValue={mode === "edit" ? note?.content : ""}
              className="w-full resize-none rounded-xl border-2 border-input bg-background px-3 py-2.5 text-sm font-mono placeholder:text-muted-foreground placeholder:font-sans focus:outline-none focus:border-[color:var(--app-primary)] transition-colors leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <DialogClose
              render={
                <button
                  type="button"
                  className="flex-1 rounded-xl border-2 py-2.5 text-sm font-bold text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              }
            />
            <button
              type="submit"
              disabled={isPending}
              className="btn-duo flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-extrabold text-white disabled:opacity-60 transition-colors"
              style={{ backgroundColor: "var(--app-primary)", boxShadow: "0 4px 0 var(--app-primary-shadow)" }}
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isPending ? "Saving…" : "Save note"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
