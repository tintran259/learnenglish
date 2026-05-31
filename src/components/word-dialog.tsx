"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addVocabulary,
  updateVocabulary,
  type VocabularyFormState,
} from "@/actions/vocabulary";

interface Word {
  id: string;
  word: string;
  meaning: string;
  examples?: string; // JSON-stringified string[]
}

interface WordDialogProps {
  mode: "add" | "edit";
  word?: Word;
  trigger: React.ReactNode;
}

const initial: VocabularyFormState = { success: false, message: "" };

function parseExamplesForTextarea(raw?: string): string {
  if (!raw) return "";
  // userExamples is stored as plain newline-separated text
  try {
    const arr = JSON.parse(raw) as string[];
    if (Array.isArray(arr)) return arr.join("\n");
  } catch {}
  return raw;
}

export function WordDialog({ mode, word, trigger }: WordDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const action = mode === "add" ? addVocabulary : updateVocabulary;
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
    if (open) formRef.current?.reset();
  }, [open]);

  const defaultExamples = mode === "edit" ? parseExamplesForTextarea(word?.examples) : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />

      <DialogContent className="sm:max-w-sm rounded-xl border-2 p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-black">
            {mode === "add" ? "✏️ Add new word" : "✏️ Edit word"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            IPA & audio auto-fetched.{" "}
            <span className="font-medium">Examples optional</span> — one per line.
            Leave blank to use shared auto-fetched examples.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4 pt-2">
          {mode === "edit" && word && (
            <input type="hidden" name="id" value={word.id} />
          )}

          <div className="space-y-1.5">
            <Label htmlFor={`word-${mode}`} className="font-bold text-sm">
              Word / Phrase
            </Label>
            <Input
              id={`word-${mode}`}
              name="word"
              placeholder="e.g. tuition cost"
              defaultValue={mode === "edit" ? word?.word : ""}
              autoComplete="off"
              required
              className="h-11 rounded-xl border-2 focus-visible:ring-0 focus-visible:border-[var(--app-primary)] text-base font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`meaning-${mode}`} className="font-bold text-sm">
              Meaning
            </Label>
            <Input
              id={`meaning-${mode}`}
              name="meaning"
              placeholder="e.g. học phí"
              defaultValue={mode === "edit" ? word?.meaning : ""}
              required
              className="h-11 rounded-xl border-2 focus-visible:ring-0 focus-visible:border-[var(--app-primary)]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`examples-${mode}`} className="font-bold text-sm">
              Examples{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <textarea
              id={`examples-${mode}`}
              name="examples"
              placeholder={
                "The tuition cost has increased every year.\nShe struggled to pay for tuition cost."
              }
              defaultValue={defaultExamples}
              rows={3}
              className="w-full resize-none rounded-xl border-2 border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[var(--app-primary)] transition-colors"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <DialogClose
              render={
                <button
                  type="button"
                  className="flex-1 rounded-lg border-2 py-2.5 text-sm font-bold text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              }
            />
            <button
              type="submit"
              disabled={isPending}
              className="btn-duo flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--app-primary)] py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_var(--app-primary-shadow)] hover:bg-[var(--app-primary-shadow)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
