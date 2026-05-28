import Link from "next/link";
import { BookOpen, Zap, Target, RotateCcw } from "lucide-react";
import { getStreakInfo, getWeeklyStats } from "@/actions/stats";
import { getStats } from "@/actions/vocabulary";
import { WeeklyChart } from "@/components/weekly-chart";
import { TargetForm } from "@/components/target-form";

export default async function StatsPage() {
  const [streak, weekly, lifetime] = await Promise.all([
    getStreakInfo(),
    getWeeklyStats(),
    getStats(),
  ]);

  const { currentStreak, bestStreak, dailyTarget, todayReviewed } = streak;
  const todayPct = Math.min(Math.round((todayReviewed / dailyTarget) * 100), 100);
  const goalMet = todayReviewed >= dailyTarget;
  const remaining = Math.max(dailyTarget - todayReviewed, 0);

  // Circular progress ring
  const R = 52;
  const STROKE = 10;
  const circ = +(2 * Math.PI * R).toFixed(4);
  const offset = +(circ * (1 - todayPct / 100)).toFixed(4);
  const ringColor = goalMet ? "#58cc02" : todayReviewed > 0 ? "#ffc800" : "#58cc02";

  return (
    <main className="mx-auto max-w-4xl px-4 md:px-8 py-8 space-y-5">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Progress</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your learning journey</p>
        </div>
        <Link
          href="/review"
          className="btn-duo flex items-center gap-2 rounded-xl bg-[#58cc02] px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_#46a302] hover:bg-[#4db801] transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Review now</span>
          <span className="sm:hidden">Review</span>
        </Link>
      </div>

      {/* ── Streak + Today ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        {/* Streak card */}
        <div className="md:col-span-2 card-duo rounded-2xl border-2 bg-card p-6 flex flex-col gap-5">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#ff9600]/15 text-4xl select-none">
              🔥
            </div>
            <div>
              <p
                className="text-6xl font-black leading-none"
                style={{ color: currentStreak > 0 ? "#ff9600" : undefined }}
              >
                {currentStreak}
              </p>
              <p className="text-sm font-bold text-muted-foreground mt-1.5">day streak</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-muted/50 px-4 py-3.5">
            <span className="text-2xl select-none">🏆</span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                Best streak
              </p>
              <p className="text-2xl font-black" style={{ color: "#ffc800" }}>
                {bestStreak} days
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
            {currentStreak === 0
              ? "Review at least one word today to start your streak!"
              : goalMet
                ? "🎉 Goal met! Come back tomorrow to keep going."
                : `${remaining} more word${remaining !== 1 ? "s" : ""} left to secure today's streak.`}
          </p>
        </div>

        {/* Today's goal card */}
        <div className="md:col-span-3 card-duo rounded-2xl border-2 bg-card p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-extrabold text-base">Today&rsquo;s Goal</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {goalMet ? "Completed for today!" : `${todayReviewed} of ${dailyTarget} words`}
              </p>
            </div>
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                goalMet
                  ? "bg-[#58cc02]/15 text-[#58cc02]"
                  : todayReviewed > 0
                    ? "bg-[#ffc800]/15 text-[#ffc800]"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {goalMet ? "✓ Done" : `${todayPct}%`}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* SVG circular ring */}
            <div className="relative shrink-0">
              <svg
                width={128} height={128}
                style={{ transform: "rotate(-90deg)" }}
                aria-hidden
              >
                <circle
                  cx={64} cy={64} r={R}
                  fill="none"
                  style={{ stroke: "var(--muted)" }}
                  strokeWidth={STROKE}
                />
                <circle
                  cx={64} cy={64} r={R}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 0.7s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-black leading-none">{todayReviewed}</p>
                <p className="text-[10px] font-extrabold text-muted-foreground mt-0.5">
                  of {dailyTarget}
                </p>
              </div>
            </div>

            {/* Mini stat grid */}
            <div className="flex-1 grid grid-cols-1 gap-3">
              <div className="rounded-xl bg-muted/50 px-4 py-3 flex items-center justify-between">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Reviewed
                </p>
                <p className="text-2xl font-black">{todayReviewed}</p>
              </div>
              <div className="rounded-xl bg-muted/50 px-4 py-3 flex items-center justify-between">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Target
                </p>
                <p className="text-2xl font-black" style={{ color: "#58cc02" }}>
                  {dailyTarget}
                </p>
              </div>
            </div>
          </div>

          {/* Status message */}
          <div
            className={`mt-auto rounded-xl px-4 py-3 text-sm font-semibold ${
              goalMet
                ? "bg-[#58cc02]/10 text-[#58cc02]"
                : "bg-muted/60 text-muted-foreground"
            }`}
          >
            {goalMet
              ? `🎉 Amazing! You reviewed ${todayReviewed} words today.`
              : todayReviewed === 0
                ? "Start reviewing to keep your streak alive!"
                : `Keep going — ${remaining} more word${remaining !== 1 ? "s" : ""} to reach your goal!`}
          </div>
        </div>
      </div>

      {/* ── Weekly chart ──────────────────────────────────────────────── */}
      <div className="card-duo rounded-2xl border-2 bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-extrabold text-base">Last 7 Days</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Words reviewed per day
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-4 rounded-sm bg-[#58cc02]" />
              <span className="text-[10px] font-semibold text-muted-foreground">Correct</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-4 rounded-sm bg-muted" />
              <span className="text-[10px] font-semibold text-muted-foreground">Reviewed</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="w-4 border-t-2 border-dashed border-[#58cc02]/50" />
              <span className="text-[10px] font-semibold text-muted-foreground">Target</span>
            </div>
          </div>
        </div>
        <WeeklyChart data={weekly} target={dailyTarget} />
      </div>

      {/* ── Lifetime stats + Target ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Lifetime stats */}
        <div className="card-duo rounded-2xl border-2 bg-card p-6 space-y-4">
          <p className="font-extrabold text-base">Lifetime Stats</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: BookOpen, label: "Words",    value: lifetime.total,         color: "#58cc02" },
              { icon: Zap,      label: "Reviews",  value: lifetime.totalReviews,  color: "#1cb0f6" },
              { icon: Target,   label: "Accuracy", value: `${lifetime.accuracy}%`,color: "#ffc800" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl bg-muted/50 p-3 text-center"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <p className="text-xl font-black" style={{ color }}>{value}</p>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily target form */}
        <div className="card-duo rounded-2xl border-2 bg-card p-6 flex flex-col gap-4">
          <div>
            <p className="font-extrabold text-base">Daily Target</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Set how many words to review per day. Completing your target keeps your streak alive and builds long-term habits.
            </p>
          </div>

          <div className="mt-auto">
            <TargetForm current={dailyTarget} />
          </div>
        </div>
      </div>
    </main>
  );
}
