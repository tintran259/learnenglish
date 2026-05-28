import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ReviewSession } from "@/components/review-session";
import { getRandomVocabulary, getStats } from "@/actions/vocabulary";

interface ReviewPageProps {
  searchParams: Promise<{ count?: string }>;
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const { count: countParam } = await searchParams;
  const count = Math.min(Math.max(parseInt(countParam ?? "0", 10), 1), 200);

  /* ── Setup screen ─────────────────────────────────────────────────── */
  if (!countParam) {
    const stats = await getStats();

    return (
      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Flashcard Review</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {stats.total} words · {stats.reviewed} reviewed · {stats.accuracy}% accuracy
          </p>
        </div>

        {/* XP bar */}
        {stats.total > 0 && (
          <div className="rounded-xl bg-[#58cc02] p-5 text-white shadow-[0_5px_0_#46a302] space-y-2">
            <p className="text-sm font-extrabold">Overall progress</p>
            <div className="h-3 w-full rounded-full bg-white/30">
              <div
                className="h-3 rounded-full bg-white transition-all"
                style={{ width: `${Math.min((stats.reviewed / stats.total) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs opacity-80">
              {stats.reviewed} / {stats.total} words reviewed
            </p>
          </div>
        )}

        {/* Quick-pick buttons */}
        <div className="card-duo rounded-xl border-2 bg-card p-6 space-y-5">
          <p className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground">
            How many words?
          </p>

          <form method="GET" className="space-y-4">
            {/* Quick picks */}
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 30].map((n) => (
                <button
                  key={n}
                  type="submit"
                  name="count"
                  value={n}
                  disabled={stats.total === 0}
                  className="btn-duo rounded-lg border-2 py-3 text-base font-black hover:border-[#58cc02] hover:bg-[#58cc02]/10 hover:text-[#58cc02] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Custom input + Go */}
            <div className="flex gap-2">
              <input
                name="count"
                type="number"
                min={1}
                max={200}
                defaultValue={10}
                disabled={stats.total === 0}
                placeholder="Custom"
                className="flex h-11 flex-1 rounded-lg border-2 bg-transparent px-3 text-sm font-semibold transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-[#58cc02] disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={stats.total === 0}
                className="btn-duo shrink-0 rounded-lg bg-[#58cc02] px-6 py-2 text-sm font-extrabold text-white shadow-[0_4px_0_#46a302] hover:bg-[#4db801] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Start →
              </button>
            </div>
          </form>

          {stats.total === 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>
                No words yet.{" "}
                <Link href="/vocabulary" className="font-bold text-[#58cc02] underline underline-offset-4">
                  Add some first
                </Link>
              </span>
            </div>
          )}
        </div>
      </main>
    );
  }

  /* ── Active session ───────────────────────────────────────────────── */
  const words = await getRandomVocabulary(count);

  if (words.length === 0) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-5xl">📚</span>
        <p className="font-extrabold text-lg">No words in your collection</p>
        <Link href="/vocabulary" className="text-sm font-bold text-[#58cc02] underline underline-offset-4">
          Add your first word
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <ReviewSession words={words} />
      </div>
    </main>
  );
}
