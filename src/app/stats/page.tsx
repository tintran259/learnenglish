import Link from "next/link";
import { BookOpen, Zap, Target, RotateCcw, Flame, Trophy } from "lucide-react";
import { getStreakInfo, getWeeklyStats } from "@/features/stats/actions/stats.actions";
import { getStats } from "@/features/vocabulary/actions/vocabulary.actions";
import { WeeklyChart } from "@/features/stats/components/weekly-chart";
import { TargetForm } from "@/features/stats/components/target-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Stats" };

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

  const R = 44;
  const STROKE = 9;
  const circ = +(2 * Math.PI * R).toFixed(4);
  const offset = +(circ * (1 - todayPct / 100)).toFixed(4);
  const ringColor = goalMet ? "var(--app-primary)" : todayReviewed > 0 ? "#ffc800" : "var(--app-primary)";

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Progress</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your learning journey</p>
        </div>
        <Link href="/review" className="btn-duo flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold text-white" style={{ backgroundColor: "var(--app-primary)", boxShadow: "0 4px 0 var(--app-primary-shadow)" }}>
          <RotateCcw className="h-4 w-4" />Review now
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Streak */}
        <div className="card-duo rounded-2xl border-2 bg-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ff9600]/15 text-3xl select-none">🔥</div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">Current Streak</p>
              <p className="text-5xl font-black leading-none mt-0.5" style={{ color: currentStreak > 0 ? "#ff9600" : undefined }}>
                {currentStreak}<span className="text-lg font-bold text-muted-foreground ml-1">days</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
            <Trophy className="h-5 w-5 text-[#ffc800] shrink-0" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Best streak</p>
              <p className="text-xl font-black text-[#ffc800]">{bestStreak} days</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {currentStreak === 0 ? "Review at least one word today to start your streak!" : goalMet ? "🎉 Goal met! Come back tomorrow to keep going." : `${remaining} more word${remaining !== 1 ? "s" : ""} left to secure today's streak.`}
          </p>
        </div>

        {/* Today's goal */}
        <div className="card-duo rounded-2xl border-2 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-extrabold text-base">Today&rsquo;s Goal</p>
              <p className="text-xs text-muted-foreground mt-0.5">{goalMet ? "Completed!" : `${todayReviewed} of ${dailyTarget} words`}</p>
            </div>
            <span className="rounded-full px-3 py-1 text-xs font-extrabold" style={{ backgroundColor: goalMet ? "color-mix(in srgb, var(--app-primary) 15%, transparent)" : todayReviewed > 0 ? "#ffc80020" : "var(--muted)", color: goalMet ? "var(--app-primary)" : todayReviewed > 0 ? "#ffc800" : "var(--muted-foreground)" }}>
              {goalMet ? "✓ Done" : `${todayPct}%`}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <svg width={108} height={108} style={{ transform: "rotate(-90deg)" }} aria-hidden>
                <circle cx={54} cy={54} r={R} fill="none" style={{ stroke: "var(--muted)" }} strokeWidth={STROKE} />
                <circle cx={54} cy={54} r={R} fill="none" stroke={ringColor} strokeWidth={STROKE} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 0.7s ease" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-black leading-none">{todayReviewed}</p>
                <p className="text-[9px] font-extrabold text-muted-foreground mt-0.5">of {dailyTarget}</p>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5">
                <div className="flex items-center gap-2"><Flame className="h-3.5 w-3.5 text-[#ff9600]" /><span className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">Today</span></div>
                <span className="text-lg font-black">{todayReviewed}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5">
                <div className="flex items-center gap-2"><Target className="h-3.5 w-3.5" style={{ color: "var(--app-primary)" }} /><span className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">Target</span></div>
                <span className="text-lg font-black" style={{ color: "var(--app-primary)" }}>{dailyTarget}</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ backgroundColor: goalMet ? "color-mix(in srgb, var(--app-primary) 10%, transparent)" : "var(--muted)", color: goalMet ? "var(--app-primary)" : "var(--muted-foreground)" }}>
            {goalMet ? `🎉 Amazing! You reviewed ${todayReviewed} words today.` : todayReviewed === 0 ? "Start reviewing to keep your streak alive!" : `Keep going — ${remaining} more word${remaining !== 1 ? "s" : ""} to reach your goal!`}
          </div>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="card-duo rounded-2xl border-2 bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-extrabold text-base">Last 7 Days</p>
            <p className="text-xs text-muted-foreground mt-0.5">Words reviewed per day</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-4 rounded-sm" style={{ backgroundColor: "var(--app-primary)" }} /><span className="text-[10px] font-semibold text-muted-foreground">Correct</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-4 rounded-sm bg-muted" /><span className="text-[10px] font-semibold text-muted-foreground">Reviewed</span></div>
            <div className="hidden sm:flex items-center gap-1.5"><div className="w-4 border-t-2 border-dashed" style={{ borderColor: "color-mix(in srgb, var(--app-primary) 50%, transparent)" }} /><span className="text-[10px] font-semibold text-muted-foreground">Target</span></div>
          </div>
        </div>
        <WeeklyChart data={weekly} target={dailyTarget} />
      </div>

      {/* Lifetime + target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-duo rounded-2xl border-2 bg-card p-6 space-y-4">
          <p className="font-extrabold text-base">Lifetime Stats</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: BookOpen, label: "Words",    value: lifetime.total,          color: "var(--app-primary)" },
              { icon: Zap,      label: "Reviews",  value: lifetime.totalReviews,   color: "#1cb0f6" },
              { icon: Target,   label: "Accuracy", value: `${lifetime.accuracy}%`, color: "#ffc800" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex flex-col items-center gap-2 rounded-xl bg-muted/50 p-4 text-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)` }}><Icon className="h-4 w-4" style={{ color }} /></div>
                <p className="text-2xl font-black leading-none" style={{ color }}>{value}</p>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card-duo rounded-2xl border-2 bg-card p-6 flex flex-col gap-4">
          <div>
            <p className="font-extrabold text-base">Daily Target</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Set how many words to review per day to keep your streak.</p>
          </div>
          <div className="mt-auto"><TargetForm current={dailyTarget} /></div>
        </div>
      </div>
    </main>
  );
}
