import Link from "next/link";
import { BookOpen, RotateCcw, Target, Zap } from "lucide-react";
import { ReviewSession } from "@/features/vocabulary/components/review-session";
import { getStats } from "@/features/vocabulary/actions/vocabulary.actions";
import { getRandomVocabulary } from "@/features/vocabulary/actions/review.actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Review" };

interface ReviewPageProps {
  searchParams: Promise<{ count?: string; mode?: string }>;
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const { count: countParam, mode: modeParam } = await searchParams;
  const count = Math.min(Math.max(parseInt(countParam ?? "0", 10), 1), 200);
  const mode = modeParam === "typing" ? "typing" : "flashcard";

  if (!countParam) {
    const stats = await getStats();
    const progressPct = stats.total > 0 ? Math.min((stats.reviewed / stats.total) * 100, 100) : 0;

    return (
      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Flashcard Review</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Practice and strengthen your vocabulary</p>
        </div>

        {stats.total > 0 && (
          <div className="rounded-2xl p-5 text-white space-y-3 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-shadow) 100%)", boxShadow: "0 5px 0 var(--app-primary-shadow)" }}>
            <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-sm font-extrabold">Overall Progress</p>
                <p className="text-xs opacity-75 mt-0.5">{stats.reviewed} of {stats.total} words reviewed</p>
              </div>
              <div className="flex gap-4 text-center">
                {[
                  { icon: BookOpen, label: "Words", value: stats.total },
                  { icon: Zap, label: "Reviewed", value: stats.reviewed },
                  { icon: Target, label: "Accuracy", value: `${stats.accuracy}%` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label}><p className="text-xl font-black">{value}</p><p className="text-[10px] opacity-70 uppercase tracking-wide">{label}</p></div>
                ))}
              </div>
            </div>
            <div className="relative h-2.5 w-full rounded-full bg-white/25">
              <div className="h-2.5 rounded-full bg-white transition-all duration-700" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        <div className="card-duo rounded-2xl border-2 bg-card p-6 space-y-5">
          <div>
            <p className="font-extrabold text-base">How many words?</p>
            <p className="text-sm text-muted-foreground mt-0.5">Choose a session size to begin</p>
          </div>
          <form method="GET" className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">Mode</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input type="radio" name="mode" value="flashcard" defaultChecked className="sr-only peer" />
                  <div className="flex flex-col items-center gap-1.5 rounded-xl border-2 bg-background px-4 py-3 transition-all peer-checked:border-[color:var(--app-primary)] peer-checked:bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)]">
                    <span className="text-lg">📖</span>
                    <span className="text-xs font-extrabold">Flashcard</span>
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">Xem từ → đoán nghĩa</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="mode" value="typing" className="sr-only peer" />
                  <div className="flex flex-col items-center gap-1.5 rounded-xl border-2 bg-background px-4 py-3 transition-all peer-checked:border-[color:var(--app-primary)] peer-checked:bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)]">
                    <span className="text-lg">⌨️</span>
                    <span className="text-xs font-extrabold">Typing</span>
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">Xem nghĩa → gõ từ</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[5, 10, 20, 30].map((n) => (
                <button key={n} type="submit" name="count" value={n} disabled={stats.total === 0} className="btn-duo group flex flex-col items-center gap-1 rounded-2xl border-2 bg-background py-4 font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-[color:var(--app-primary)] hover:bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)]">
                  <span className="text-2xl" style={{ color: "var(--app-primary)" }}>{n}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{n === 5 ? "Quick" : n === 10 ? "Standard" : n === 20 ? "Long" : "Marathon"}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input name="count" type="number" min={1} max={200} defaultValue={10} disabled={stats.total === 0} placeholder="Custom amount" className="h-12 w-full rounded-xl border-2 bg-background px-4 text-sm font-semibold placeholder:text-muted-foreground focus:outline-none focus:border-[color:var(--app-primary)] disabled:opacity-40 transition-colors" />
              </div>
              <button type="submit" disabled={stats.total === 0} className="btn-duo shrink-0 rounded-xl px-6 text-sm font-extrabold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors" style={{ backgroundColor: "var(--app-primary)", boxShadow: "0 4px 0 var(--app-primary-shadow)" }}>Start →</button>
            </div>
          </form>
          {stats.total === 0 && (
            <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3 text-sm">
              <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">No words yet. <Link href="/vocabulary" className="font-bold underline underline-offset-4" style={{ color: "var(--app-primary)" }}>Add some first</Link></span>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
          <RotateCcw className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-bold">Tip (Flashcard):</span> <kbd className="rounded border border-border bg-muted px-1 text-[10px]">Space</kbd> flip · <kbd className="rounded border border-border bg-muted px-1 text-[10px]">←</kbd> wrong · <kbd className="rounded border border-border bg-muted px-1 text-[10px]">→</kbd> correct.{" "}
            <span className="font-bold">Typing:</span> <kbd className="rounded border border-border bg-muted px-1 text-[10px]">Enter</kbd> check / next.
          </p>
        </div>
      </main>
    );
  }

  const words = await getRandomVocabulary(count);

  if (words.length === 0) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-5xl">📚</span>
        <p className="font-extrabold text-lg">No words in your collection</p>
        <Link href="/vocabulary" className="text-sm font-bold underline underline-offset-4" style={{ color: "var(--app-primary)" }}>Add your first word</Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <ReviewSession words={words} mode={mode} />
      </div>
    </main>
  );
}
