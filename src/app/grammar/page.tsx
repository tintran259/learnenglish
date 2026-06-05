import { TenseTabs } from "@/features/grammar/components/tense-tabs";
import { tenses } from "@/features/grammar/constants/tenses.constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grammar",
  description: "12 English tenses — structure, signal words, and examples.",
};

export default function GrammarPage() {
  const presentCount = tenses.filter((t) => t.group === "present").length;
  const pastCount    = tenses.filter((t) => t.group === "past").length;
  const futureCount  = tenses.filter((t) => t.group === "future").length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="rounded-2xl bg-[var(--app-primary)] p-6 text-white shadow-[0_6px_0_var(--app-primary-shadow)]">
        <p className="text-xs font-extrabold uppercase tracking-widest opacity-75">Reference</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">English Tenses</h1>
        <p className="mt-1 opacity-80 text-sm">Structure · Signal words · Examples with notes</p>
        <div className="mt-4 flex gap-5 text-sm font-bold">
          <span>🟢 {presentCount} Present</span>
          <span>🔴 {pastCount} Past</span>
          <span>🟡 {futureCount} Future</span>
        </div>
      </div>
      <TenseTabs />
    </main>
  );
}
