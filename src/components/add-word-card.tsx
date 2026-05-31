"use client";

import { Plus } from "lucide-react";
import { WordDialog } from "@/components/word-dialog";

export function AddWordCard({ hero = false }: { hero?: boolean }) {
  return (
    <WordDialog
      mode="add"
      trigger={
        hero ? (
          <button className="w-full flex items-center gap-2.5 rounded-2xl bg-white/20 px-3.5 py-2.5 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer text-white">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Plus className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-extrabold leading-none">Add Word</p>
              <p className="text-[10px] opacity-70 mt-0.5">Quick add</p>
            </div>
          </button>
        ) : (
          <button className="col-span-1 btn-duo card-duo group w-full rounded-3xl border-2 bg-card p-4 flex flex-col items-center justify-center gap-2 text-center min-h-[110px] transition-all hover:shadow-md cursor-pointer">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: "color-mix(in srgb, var(--app-primary) 15%, transparent)" }}
            >
              <Plus className="h-5 w-5" style={{ color: "var(--app-primary)" }} />
            </div>
            <p className="text-sm font-extrabold">Add Word</p>
            <p className="text-[10px] text-muted-foreground font-medium">Quick add</p>
          </button>
        )
      }
    />
  );
}
