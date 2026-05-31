import Link from "next/link";
import { BookOpen, Zap, RotateCcw } from "lucide-react";
import { getStats } from "@/actions/vocabulary";
import { getStreakInfo, getStreakLeaderboard } from "@/actions/stats";
import { StreakLeaderboard } from "@/components/streak-leaderboard";
import { AddWordCard } from "@/components/add-word-card";
import { AddNoteCard } from "@/components/add-note-card";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", emoji: "☀️" };
  if (h < 18) return { text: "Good afternoon", emoji: "🌤️" };
  return { text: "Good evening", emoji: "🌙" };
}

function getDayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

export default async function HomePage() {
  const [stats, streakInfo, leaderboard] = await Promise.all([
    getStats(),
    getStreakInfo(),
    getStreakLeaderboard(),
  ]);

  const { currentStreak, bestStreak, dailyTarget, todayReviewed } = streakInfo;
  const todayPct = Math.min(Math.round((todayReviewed / dailyTarget) * 100), 100);
  const goalMet = todayReviewed >= dailyTarget;
  const { text: greeting, emoji: greetEmoji } = getGreeting();

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

        {/* ── 1. Hero ── col-span-2 */}
        <div
          className="col-span-2 relative overflow-hidden rounded-3xl p-5 md:p-6 text-white flex flex-col gap-4"
          style={{
            background: "linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-shadow) 100%)",
            boxShadow: "0 8px 0 var(--app-primary-shadow)",
          }}
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-6 right-16 h-24 w-24 rounded-full bg-white/5" />

          {/* Greeting + progress */}
          <div className="relative space-y-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">{getDayLabel()}</p>
              <h1 className="mt-0.5 text-xl md:text-2xl font-black tracking-tight leading-tight">
                {greeting} {greetEmoji}
              </h1>
              <p className="mt-0.5 text-sm opacity-80">
                {goalMet
                  ? `Goal reached! ${todayReviewed} words reviewed 🎉`
                  : `${todayReviewed} of ${dailyTarget} words today`}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold opacity-75">
                <span>Daily goal</span>
                <span>{todayPct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/25 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-white transition-all duration-1000 ease-out"
                  style={{ width: `${todayPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats + actions grid */}
          <div className="relative grid grid-cols-2 gap-2">
            {/* Words stat */}
            <div className="flex items-center gap-2.5 rounded-2xl bg-white/15 px-3.5 py-2.5 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/20">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xl font-black leading-none tabular-nums">{stats.total}</p>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-wide mt-0.5">Words</p>
              </div>
            </div>

            {/* Reviewed stat */}
            <div className="flex items-center gap-2.5 rounded-2xl bg-white/15 px-3.5 py-2.5 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/20">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xl font-black leading-none tabular-nums">{stats.reviewed}</p>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-wide mt-0.5">Reviewed</p>
              </div>
            </div>

            {/* Add Word */}
            <div className="relative z-10">
              <AddWordCard hero />
            </div>

            {/* Add Note */}
            <div className="relative z-10">
              <AddNoteCard hero />
            </div>
          </div>
        </div>

        {/* ── 2. Streak + Leaderboard ── col-span-2 */}
        <div className="col-span-2 card-duo rounded-3xl border-2 bg-card overflow-hidden flex flex-col">
          {/* Streak summary */}
          <div className="flex items-center gap-4 px-5 pt-5 pb-4">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#ff9600]/10 px-4 py-3 shrink-0">
              <span className="text-2xl leading-none select-none">🔥</span>
              <p
                className="text-3xl font-black leading-none mt-1 tabular-nums"
                style={{ color: currentStreak > 0 ? "#ff9600" : undefined }}
              >
                {currentStreak}
              </p>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground mt-0.5">days</p>
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Best streak</span>
                <span className="text-sm font-black text-[#ffc800]">{bestStreak} days 🏆</span>
              </div>
              {leaderboard.myRank && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Your rank</span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-extrabold"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--app-primary) 15%, transparent)",
                      color: "var(--app-primary)",
                    }}
                  >
                    #{leaderboard.myRank} of {leaderboard.totalUsers}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Accuracy</span>
                <span className="text-sm font-black text-[#ffc800]">{stats.accuracy}%</span>
              </div>
            </div>
          </div>

          <div className="mx-5 border-t border-border" />

          {/* Leaderboard */}
          <div className="px-5 py-4 flex-1">
            <StreakLeaderboard
              entries={leaderboard.entries}
              myRank={leaderboard.myRank}
              totalUsers={leaderboard.totalUsers}
              myStreak={currentStreak}
            />
          </div>
        </div>

        {/* ── 3. Review CTA ── col-span-2 md:col-span-4 */}
        <Link
          href="/review"
          className="col-span-2 md:col-span-4 group relative overflow-hidden rounded-3xl p-6 text-white"
          style={{ background: "linear-gradient(135deg, #1cb0f6 0%, #0a8abf 100%)", boxShadow: "0 6px 0 #0a8abf" }}
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-4 right-24 h-20 w-20 rounded-full bg-white/5" />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest opacity-70">Practice</p>
              <p className="mt-1 text-xl md:text-2xl font-black">Flashcard Review</p>
              <p className="mt-0.5 text-sm opacity-75">
                {stats.total > 0 ? `${stats.total} words · ${stats.accuracy}% accuracy` : "Add words to start"}
              </p>
            </div>
            <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 group-hover:bg-white/30 transition-colors">
              <RotateCcw className="h-7 w-7 group-hover:rotate-180 transition-transform duration-500" />
            </div>
          </div>
        </Link>

        {/* ── Empty state ── */}
        {stats.total === 0 && (
          <div className="col-span-2 md:col-span-4 card-duo rounded-3xl border-2 border-dashed bg-card/50 flex flex-col items-center gap-5 py-14 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-4xl">📖</div>
            <div>
              <p className="font-extrabold text-xl">Start your vocabulary journey</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add your first word and we&apos;ll fetch pronunciation automatically.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
