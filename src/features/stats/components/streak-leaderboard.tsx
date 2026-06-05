"use client";

import { useState } from "react";
import Image from "next/image";
import { Trophy, ChevronDown, ChevronUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/features/stats/types/stats.types";

interface Props {
  entries: LeaderboardEntry[];
  myRank: number | null;
  totalUsers: number;
  myStreak: number;
}

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

function displayName(name: string | null, isCurrentUser: boolean): string {
  if (isCurrentUser) return "You";
  if (!name) return "Anonymous";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) return <span className="text-lg leading-none">{MEDAL[rank]}</span>;
  return <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-extrabold text-muted-foreground">{rank}</span>;
}

function StreakBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
      <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: "var(--app-primary)" }} />
    </div>
  );
}

function Row({ entry, maxStreak }: { entry: LeaderboardEntry; maxStreak: number }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors", entry.isCurrentUser ? "border-2 border-[color:var(--app-primary)]/25 bg-[color-mix(in_srgb,var(--app-primary)_8%,transparent)]" : "bg-muted/40 hover:bg-muted/70")}>
      <RankBadge rank={entry.rank} />
      {entry.image ? (
        <Image src={entry.image} alt={entry.name ?? "User"} width={28} height={28} className="rounded-full shrink-0" />
      ) : (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold" style={{ backgroundColor: entry.isCurrentUser ? "color-mix(in srgb, var(--app-primary) 20%, transparent)" : "var(--muted)", color: entry.isCurrentUser ? "var(--app-primary)" : "var(--muted-foreground)" }}>
          {(entry.name?.[0] ?? "?").toUpperCase()}
        </div>
      )}
      <p className={cn("flex-1 min-w-0 text-sm font-extrabold truncate", entry.isCurrentUser && "text-[color:var(--app-primary)]")}>{displayName(entry.name, entry.isCurrentUser)}</p>
      <div className="flex items-center gap-1.5 shrink-0">
        <StreakBar value={entry.currentStreak} max={maxStreak} />
        <Flame className="h-3.5 w-3.5 text-[#ff9600]" />
        <span className="text-sm font-black tabular-nums w-6 text-right">{entry.currentStreak}</span>
      </div>
    </div>
  );
}

export function StreakLeaderboard({ entries, myRank, totalUsers, myStreak }: Props) {
  const [expanded, setExpanded] = useState(false);
  const maxStreak = entries[0]?.currentStreak ?? 1;
  const PREVIEW = 3;
  const visible = expanded ? entries : entries.slice(0, PREVIEW);
  const myEntry = entries.find((e) => e.isCurrentUser);
  const myInVisible = visible.some((e) => e.isCurrentUser);
  const showMyRow = !myInVisible && myEntry;
  const showMyRowBelow = !myInVisible && !myEntry && myRank !== null;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-[#ffc800]" />
          <span className="text-sm font-extrabold">Leaderboard</span>
        </div>
        {myRank && (
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-extrabold" style={{ backgroundColor: "color-mix(in srgb, var(--app-primary) 15%, transparent)", color: "var(--app-primary)" }}>
            #{myRank} of {totalUsers}
          </span>
        )}
      </div>

      {visible.map((entry) => <Row key={entry.userId} entry={entry} maxStreak={maxStreak} />)}

      {(showMyRow || showMyRowBelow) && (
        <>
          <div className="flex items-center gap-2 py-1 px-1">
            <div className="flex-1 border-t border-dashed border-border" />
            <span className="text-[10px] text-muted-foreground font-bold">{myRank ? `#${myRank}` : "..."}</span>
            <div className="flex-1 border-t border-dashed border-border" />
          </div>
          {showMyRow && <Row entry={showMyRow} maxStreak={maxStreak} />}
          {showMyRowBelow && (
            <div className="flex items-center gap-3 rounded-xl bg-[color-mix(in_srgb,var(--app-primary)_8%,transparent)] border-2 border-[color:var(--app-primary)]/20 px-3 py-2.5">
              <RankBadge rank={myRank!} />
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-extrabold shrink-0">Y</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-extrabold" style={{ color: "var(--app-primary)" }}>You</p></div>
              <div className="flex items-center gap-1.5 shrink-0">
                <StreakBar value={myStreak} max={maxStreak} />
                <Flame className="h-3.5 w-3.5 text-[#ff9600]" />
                <span className="text-sm font-black tabular-nums">{myStreak}</span>
              </div>
            </div>
          )}
        </>
      )}

      {entries.length > PREVIEW && (
        <button onClick={() => setExpanded((v) => !v)} className="mt-1 w-full flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold text-muted-foreground hover:bg-muted transition-colors">
          {expanded ? <><ChevronUp className="h-3.5 w-3.5" /> Show less</> : <><ChevronDown className="h-3.5 w-3.5" /> Show {entries.length - PREVIEW} more</>}
        </button>
      )}
      {entries.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No one has a streak yet. Be the first! 🔥</p>}
    </div>
  );
}
