"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addVocabulary, type VocabularyFormState } from "@/actions/vocabulary";

const initialState: VocabularyFormState = { success: false, message: "" };

export function VocabularyForm() {
  const [state, action, isPending] = useActionState(addVocabulary, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="word">Word</Label>
        <Input
          id="word"
          name="word"
          placeholder="e.g. ephemeral"
          autoComplete="off"
          autoFocus
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="meaning">Meaning</Label>
        <Input
          id="meaning"
          name="meaning"
          placeholder="e.g. lasting for a very short time"
          required
        />
      </div>

      <p className="text-xs text-muted-foreground">
        IPA and pronunciation audio will be fetched automatically.
      </p>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Adding…" : "Add Word"}
      </Button>
    </form>
  );
}
