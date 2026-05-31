import { TenseTabs } from "@/components/tense-tabs";
import { tenses } from "@/lib/tenses";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grammar",
  description: "Tổng hợp 12 thì tiếng Anh với cấu trúc, dấu hiệu nhận biết và ví dụ song ngữ.",
};

export default function GrammarPage() {
  const presentCount = tenses.filter((t) => t.group === "present").length;
  const pastCount    = tenses.filter((t) => t.group === "past").length;
  const futureCount  = tenses.filter((t) => t.group === "future").length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-[var(--app-primary)] p-6 text-white shadow-[0_6px_0_var(--app-primary-shadow)]">
        <p className="text-sm font-bold uppercase tracking-widest opacity-80">Reference</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Các thì tiếng Anh</h1>
        <p className="mt-1 opacity-80 text-sm">
          Cấu trúc · Dấu hiệu nhận biết · Ví dụ song ngữ
        </p>
        <div className="mt-4 flex gap-4 text-sm font-bold">
          <span>🟢 {presentCount} Hiện tại</span>
          <span>🔴 {pastCount} Quá khứ</span>
          <span>🟡 {futureCount} Tương lai</span>
        </div>
      </div>

      <TenseTabs />
    </main>
  );
}
