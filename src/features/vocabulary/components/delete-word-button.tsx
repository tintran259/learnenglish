"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteVocabulary } from "@/features/vocabulary/actions/vocabulary.actions";

interface DeleteWordButtonProps {
  id: string;
  word: string;
}

export function DeleteWordButton({ id, word }: DeleteWordButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      await deleteVocabulary(id);
      toast.success(`"${word}" deleted.`);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<button className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-[#ff4b4b]/10 hover:text-[#ff4b4b] transition-colors" aria-label={`Delete ${word}`}><Trash2 className="h-3.5 w-3.5" /></button>} />
      <AlertDialogContent className="rounded-xl border-2 p-6 sm:max-w-sm">
        <AlertDialogHeader className="space-y-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#ff4b4b]/10 text-2xl mx-auto">🗑️</div>
          <AlertDialogTitle className="text-center text-xl font-black">Delete &ldquo;{word}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm">This word will be permanently removed. This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 mt-2 sm:flex-row">
          <AlertDialogCancel render={<button className="flex-1 rounded-lg border-2 py-2.5 text-sm font-bold hover:border-foreground transition-colors">Keep it</button>} />
          <AlertDialogAction render={<button onClick={handleDelete} disabled={isPending} className="btn-duo flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#ff4b4b] py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_#cc3333] hover:bg-[#e04040] disabled:opacity-60 transition-colors">{isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Delete</button>} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
