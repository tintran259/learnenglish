import Link from "next/link";
import { BookOpen, Zap, Target, Award } from "lucide-react";
import { getStats, getAllVocabulary } from "@/actions/vocabulary";
import { getStreakInfo } from "@/actions/stats";

export default async function HomePage() {
  const [stats, recent, streakInfo] = await Promise.all([
    getStats(),
    getAllVocabulary(),
    getStreakInfo(),
  ]);
  const recents = recent.slice(0, 5);
  const { currentStreak, dailyTarget, todayReviewed } = streakInfo;
  const todayPct = Math.min(Math.round((todayReviewed / dailyTarget) * 100), 100);
  const goalMet = todayReviewed >= dailyTarget;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div className="rounded-xl bg-[#58cc02] p-6 text-white shadow-[0_6px_0_#46a302]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-widest opacity-80">
            Daily Streak
          </p>
          <Link
            href="/stats"
            className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1 text-xs font-extrabold hover:bg-white/30 transition-colors"
          >
            {currentStreak > 0 ? `🔥 ${currentStreak} days` : "Start streak"}
          </Link>
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          {goalMet ? "Goal reached! 🎉" : "Keep it up!"}
        </h1>
        <p className="mt-1 opacity-80 text-sm">
          {goalMet
            ? `You reviewed ${todayReviewed} words today.`
            : `Today: ${todayReviewed} / ${dailyTarget} words reviewed.`}
        </p>
        <div className="mt-4 h-2.5 w-full rounded-full bg-white/30">
          <div
            className="h-2.5 rounded-full bg-white transition-all duration-700"
            style={{ width: `${todayPct}%` }}
          />
        </div>
        <p className="mt-1 text-xs opacity-70">
          {stats.reviewed} / {stats.total} words ever reviewed
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
