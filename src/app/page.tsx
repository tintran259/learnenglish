import Link from "next/link";
import { BookOpen, Zap, Target, Award } from "lucide-react";
import { getStats, getAllVocabulary } from "@/actions/vocabulary";

export default async function HomePage() {
  const [stats, recent] = await Promise.all([getStats(), getAllVocabulary()]);
  const recents = recent.slice(0, 5);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div className="rounded-xl bg-[#58cc02] p-6 text-white shadow-[0_6px_0_#46a302]">
        <p className="text-sm font-bold uppercase tracking-widest opacity-80">
          Daily Streak 🔥
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">
          Keep it up!
        </h1>
        <p className="mt-1 opacity-80 text-sm">
          You have <strong>{stats.total}</strong> words ready to practice.
        </p>
        <div className="mt-4 h-2 w-full rounded-full bg-white/30">
          <div
            className="h-2 rounded-full bg-white transition-all duration-700"
            style={{
              width: stats.total > 0 ? `${Math.min((stats.reviewed / stats.total) * 100, 100)}%` : "0%",
            }}
          />
        </div>
        <p className="mt-1 text-xs opacity-70">
          {stats.reviewed} / {stats.total} reviewed
        </p>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: BookOpen, label: "Words", value: stats.total, color: "#58cc02", bg: "#58cc02" },
          { icon: Zap, label: "Reviewed", value: stats.reviewed, color: "#1cb0f6", bg: "#1cb0f6" },
          { icon: Target, label: "Accuracy", value: `${stats.accuracy}%`, color: "#ffc800", bg: "#ffc800" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="card-duo flex flex-col items-center gap-1 rounded-lg border-2 bg-card p-4 text-center"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${bg}20` }}
            >
              <Icon className="h-4.5 w-4.5" style={{ color }} />
            </div>
            <p className="text-2xl font-black" style={{ color }}>{value}</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Action cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/vocabulary"
          className="btn-duo group flex items-center gap-4 rounded-lg border-2 bg-card px-5 py-4 hover:border-[#58cc02]/50 transition-colors"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#58cc02]/15 text-2xl group-hover:bg-[#58cc02]/25 transition-colors">
            📚
          </span>
          <div>
            <p className="font-extrabold">Manage Words</p>
            <p className="text-xs text-muted-foreground">Add · Edit · Delete vocabulary</p>
          </div>
        </Link>

        <Link
          href="/review"
          className="btn-duo group flex items-center gap-4 rounded-lg border-2 bg-card px-5 py-4 hover:border-[#1cb0f6]/50 transition-colors"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1cb0f6]/15 text-2xl group-hover:bg-[#1cb0f6]/25 transition-colors">
            🎯
          </span>
          <div>
            <p className="font-extrabold">Flashcard Review</p>
            <p className="text-xs text-muted-foreground">Practice with pronunciation audio</p>
          </div>
        </Link>
      </div>

      {/* ── Recent words ────────────────────────────────────────────── */}
      {recents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-[#ffc800]" />
              <span className="text-sm font-extrabold">Recently added</span>
            </div>
            <Link
              href="/vocabulary"
              className="text-xs font-bold text-[#58cc02] hover:underline underline-offset-4 transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-2">
            {recents.map((w) => (
              <div
                key={w.id}
                className="card-duo flex items-center gap-3 rounded-lg border-2 bg-card px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-sm">{w.word}</span>
                    {w.ipa && (
                      <span className="font-mono text-xs text-muted-foreground">{w.ipa}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{w.meaning}</p>
                </div>
                {w.reviewCount > 0 && (
                  <span className="shrink-0 rounded-full bg-[#58cc02]/15 px-2 py-0.5 text-[11px] font-bold text-[#58cc02]">
                    {w.correctCount}/{w.reviewCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────────────── */}
      {stats.total === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="text-6xl">📖</span>
          <div>
            <p className="font-extrabold text-lg">No words yet</p>
            <p className="text-sm text-muted-foreground">
              Start building your vocabulary collection!
            </p>
          </div>
          <Link
            href="/vocabulary"
            className="btn-duo rounded-lg bg-[#58cc02] px-6 py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_#46a302] hover:bg-[#4db801] transition-colors"
          >
            Add your first word →
          </Link>
        </div>
      )}
    </main>
  );
}
