"use client";

import { useState } from "react";
import { tenses, groups, type TenseGroup } from "@/lib/tenses";
import { cn } from "@/lib/utils";
import { ChevronDown, BookOpen } from "lucide-react";

function TenseCard({ tense }: { tense: (typeof tenses)[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("rounded-2xl border-2 bg-card overflow-hidden transition-all", open && "shadow-md")}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-3.5 w-3.5 rounded-full shrink-0" style={{ backgroundColor: tense.color }} />
          <div className="min-w-0">
            <p className="font-extrabold text-[15px] leading-tight">{tense.name}</p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">{tense.nameEn}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <code className="hidden md:block text-xs font-mono px-2.5 py-1 rounded-lg bg-muted" style={{ color: tense.color }}>
            {tense.structure}
          </code>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div className="border-t border-border px-5 pb-5 space-y-5 pt-4">

          {/* Structure grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { label: "(+) Positive", value: tense.structure },
              { label: "(–) Negative", value: tense.negative },
              { label: "(?) Question", value: tense.question },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-muted/60 px-3 py-2.5">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</p>
                <code className="text-xs font-mono leading-relaxed break-words">{value}</code>
              </div>
            ))}
          </div>

          {/* Usage + Signals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">When to use</p>
              <ul className="space-y-1.5">
                {tense.usage.map((u) => (
                  <li key={u} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tense.color }} />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">Signal Words</p>
              <div className="flex flex-wrap gap-1.5">
                {tense.signals.map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{ backgroundColor: `${tense.color}18`, color: tense.color }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Examples */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">Examples</p>
            <div className="space-y-2">
              {tense.examples.map((ex, i) => (
                <div key={i} className="rounded-xl border bg-muted/30 px-4 py-3 border-border">
                  <p className="font-semibold text-sm">{ex.en}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">{ex.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TenseTabs() {
  const [active, setActive] = useState<TenseGroup>("present");
  const filtered = tenses.filter((t) => t.group === active);

  const groupColors: Record<TenseGroup, string> = {
    present: "var(--app-primary)",
    past: "#ff4b4b",
    future: "#ffc800",
  };

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl border-2 bg-muted/40 p-1.5">
        {groups.map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-extrabold transition-all",
              active === key
                ? "bg-card shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            style={active === key ? { color: groupColors[key] } : {}}
          >
            <span>{emoji}</span>
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden text-xs">{label.slice(0, 3)}...</span>
          </button>
        ))}
      </div>

      {/* Count badge */}
      <div className="flex items-center gap-2 px-1">
        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {filtered.length} tenses
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {filtered.map((t) => (
          <TenseCard key={t.id} tense={t} />
        ))}
      </div>
    </div>
  );
}
