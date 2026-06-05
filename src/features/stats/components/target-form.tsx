"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { setDailyTarget } from "@/features/stats/actions/stats.actions";

export function TargetForm({ current }: { current: number }) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAction(formData: FormData) {
    await setDailyTarget(formData);
    toast.success("Daily target updated!");
  }

  return (
    <form ref={formRef} action={handleAction} className="flex gap-2">
      <div className="flex flex-1 items-center rounded-lg border-2 bg-background transition-colors focus-within:border-[var(--app-primary)] overflow-hidden">
        <input type="number" name="target" defaultValue={current} min={1} max={500} required className="flex-1 px-3 py-2.5 text-sm font-bold bg-transparent outline-none w-16" />
        <span className="pr-3 text-sm text-muted-foreground font-medium whitespace-nowrap">words / day</span>
      </div>
      <button type="submit" className="btn-duo rounded-lg bg-[var(--app-primary)] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_var(--app-primary-shadow)] hover:bg-[var(--app-primary-shadow)] transition-colors">
        Save
      </button>
    </form>
  );
}
