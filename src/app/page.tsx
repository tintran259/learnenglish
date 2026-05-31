import Link from "next/link";
import {
  BookOpen, Zap, Target, Plus,
  RotateCcw, GraduationCap, ChevronRight,
  Flame, Trophy,
} from "lucide-react";
import { getStats, getAllVocabulary } from "@/actions/vocabulary";
import { getStreakInfo } from "@/actions/stats";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", emoji: "☀️" };
  if (h < 18) return { text: "Good afternoon", emoji: "🌤️" };
  return { text: "Good evening", emoji: "🌙" };
}

function getDayLabel() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default async function HomePage() {
  const [stats, recent, streakInfo] = await Promise.all([
    getStats(),
    getAllVocabulary(),
    getStreakInfo(),
  ]);

  const recents = recent.slice(0, 6);
  const { currentStreak, bestStreak, dailyTarget, todayReviewed } = streakInfo;
  const todayPct = Math.min(Math.round((todayReviewed / dailyTarget) * 100), 100);
  const goalMet = todayReviewed >= dailyTarget;
  const { text: greeting, emoji: greetEmoji } = getGreeting();

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

        {/* ── 1. Greeting + Progress hero ── col-span-2 md:col-span-3 */}
        <div
          className="col-span-2 md:col-span-3 relative overflow-hidden rounded-3xl p-6 md:p-7 text-white"
          style={{
            background: "linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-shadow) 100%)",
            boxShadow: "0 8px 0 var(--app-primary-shadow)",
          }}
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-8 right-24 h-32 w-32 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />

          <div className="relative space-y-4">
            {/* Greeting */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest opacity-70">
                {getDayLabel()}
              </p>
              <h1 className="mt-1 text-2xl md:text-[28px] font-black tracking-tight leading-tight">
                {greeting} {greetEmoji}
              </h1>
              <p className="mt-0.5 text-sm opacity-80">
                {goalMet
                  ? `You hit your goal! ${todayReviewed} words reviewed today 🎉`
                  : `${todayReviewed} of ${dailyTarget} words reviewed today`}
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold opacity-80">
                <span>Daily goal</span>
                <span>{todayPct}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-white/25 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-white transition-all duration-1000 ease-out"
                  style={{ width: `${todayPct}%` }}
                />
              </div>
              <p className="text-[11px] opacity-50">
                {stats.reviewed} of {stats.total} total words ever reviewed
              </p>
            </div>

            {/* Bottom action */}
            <Link
              href="/review"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-4 py-2 text-sm font-extrabold backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              {goalMet ? "Review more →" : "Start today's review →"}
            </Link>
          </div>
        </div>

        {/* ── 2. Streak card ── col-span-2 md:col-span-1 */}
        <div className="col-span-2 md:col-span-1 card-duo rounded-3xl border-2 bg-card overflow-hidden">
          {/* Top: current streak */}
          <div className="flex flex-col items-center justify-center gap-1 p-5 pb-4 text-center">
            <span className="text-4xl select-none">🔥</span>
            <p
              className="text-5xl font-black leading-none tabular-nums"
              style={{ color: currentStreak > 0 ? "#ff9600" : undefined }}
            >
              {currentStreak}
            </p>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
              day streak
            </p>
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-border" />

          {/* Bottom: best streak */}
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#ffc800] shrink-0" />
              <span className="text-xs font-bold text-muted-foreground">Best</span>
            </div>
            <span className="text-base font-black text-[#ffc800]">{bestStreak} days</span>
          </div>
        </div>

        {/* ── 3. Stat: Words ── col-span-1 */}
        <StatCard
          icon={BookOpen}
          value={stats.total}
          label="Words"
          color="var(--app-primary)"
        />

        {/* ── 4. Stat: Reviewed ── col-span-1 */}
        <StatCard
          icon={Zap}
          value={stats.reviewed}
          label="Reviewed"
          color="#1cb0f6"
        />

        {/* ── 5. Stat: Accuracy ── col-span-2 md:col-span-2 */}
        <div className="col-span-2 md:col-span-2 card-duo rounded-3xl border-2 bg-card p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffc800]/15">
            <Target className="h-6 w-6 text-[#ffc800]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-3xl font-black text-[#ffc800] leading-none">{stats.accuracy}%</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Accuracy</p>
          </div>
          {/* Mini accuracy bar */}
          <div className="hidden sm:block w-24">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-2 rounded-full bg-[#ffc800] transition-all duration-700"
                style={{ width: `${stats.accuracy}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 text-right">
              {stats.accuracy >= 80 ? "Excellent" : stats.accuracy >= 60 ? "Good" : "Practice more"}
            </p>
          </div>
        </div>

        {/* ── 6. Review CTA ── col-span-2 */}
        <Link
          href="/review"
          className="col-span-2 group relative overflow-hidden rounded-3xl p-6 text-white"
          style={{
            background: "linear-gradient(135deg, #1cb0f6 0%, #0a8abf 100%)",
            boxShadow: "0 6px 0 #0a8abf",
          }}
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-4 right-20 h-16 w-16 rounded-full bg-white/5" />

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

        {/* ── 7. Add Word ── col-span-1 */}
        <ActionCard
          href="/vocabulary"
          icon={Plus}
          label="Add Word"
          sublabel="Manage words"
          color="var(--app-primary)"
        />

        {/* ── 8. Grammar ── col-span-1 */}
        <ActionCard
          href="/grammar"
          icon={GraduationCap}
          label="Grammar"
          sublabel="12 tenses"
          color="#ce82ff"
        />

        {/* ── 9. Recent Words ── col-span-2 md:col-span-4 */}
        {recents.length > 0 && (
          <div className="col-span-2 md:col-span-4 card-duo rounded-3xl border-2 bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-[#ff9600]" />
                <span className="text-sm font-extrabold">Recently Added</span>
              </div>
              <Link
                href="/vocabulary"
                className="flex items-center gap-0.5 text-xs font-bold transition-colors hover:underline underline-offset-4"
                style={{ color: "var(--app-primary)" }}
              >
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {recents.map((w) => {
                const pct = w.reviewCount > 0
                  ? Math.round((w.correctCount / w.reviewCount) * 100)
                  : null;
                return (
                  <div
                    key={w.id}
                    className="flex items-center gap-3 rounded-2xl bg-muted/50 px-3.5 py-3 hover:bg-muted transition-colors"
                  >
                    {/* Mastery dot */}
                    <div
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: pct === null
                          ? "var(--muted-foreground)"
                          : pct >= 80 ? "var(--app-primary)"
                            : pct >= 50 ? "#ffc800"
                              : "#ff4b4b",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-sm">{w.word}</span>
                        {w.ipa && (
                          <span className="font-mono text-[11px] text-muted-foreground truncate">{w.ipa}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{w.meaning}</p>
                    </div>
                    {pct !== null && (
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--app-primary) 15%, transparent)",
                          color: "var(--app-primary)",
                        }}
                      >
                        {pct}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {stats.total === 0 && (
          <div className="col-span-2 md:col-span-4 card-duo rounded-3xl border-2 border-dashed bg-card/50 flex flex-col items-center gap-5 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-4xl">📖</div>
            <div>
              <p className="font-extrabold text-xl">Start your vocabulary journey</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add your first word and we&apos;ll fetch the pronunciation automatically.
              </p>
            </div>
            <Link
              href="/vocabulary"
              className="btn-duo flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-extrabold text-white"
              style={{
                backgroundColor: "var(--app-primary)",
                boxShadow: "0 4px 0 var(--app-primary-shadow)",
              }}
            >
              <Plus className="h-4 w-4" />
              Add your first word
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

// ── Reusable sub-components ───────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  color: string;
}) {
  return (
    <div className="col-span-1 card-duo rounded-3xl border-2 bg-card p-4 flex flex-col items-center justify-center gap-2 text-center min-h-[110px]">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <p className="text-3xl font-black leading-none tabular-nums" style={{ color }}>
        {value}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function ActionCard({
  href,
  icon: Icon,
  label,
  sublabel,
  color,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  sublabel: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="col-span-1 btn-duo card-duo group rounded-3xl border-2 bg-card p-4 flex flex-col items-center justify-center gap-2 text-center min-h-[110px] transition-all hover:shadow-md"
      style={{ ["--hover-border" as string]: color }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <p className="text-sm font-extrabold">{label}</p>
      <p className="text-[10px] text-muted-foreground font-medium">{sublabel}</p>
    </Link>
  );
}
