"use client";

import { useState, useMemo } from "react";
import { Search, Pencil, Volume2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { WordDialog } from "@/components/word-dialog";
import { DeleteWordButton } from "@/components/delete-word-button";
import { speakWord } from "@/lib/speech";
import { refetchWordAudio } from "@/actions/vocabulary";

interface Word {
  id: string;
  word: string;
  meaning: string;
  ipa: string;
  audioUrl: string;
  examples: string;
  userExamples: string;
  reviewCount: number;
  correctCount: number;
}

function masteryAccent(w: Word) {
  if (w.reviewCount === 0) return "var(--border)";
  const pct = w.correctCount / w.reviewCount;
  if (pct >= 0.8) return "var(--app-primary)";
  if (pct >= 0.5) return "#ffc800";
  return "#ff4b4b";
}

function masteryBadge(w: Word): { label: string; bg: string; color: string } | null {
  if (w.reviewCount === 0) return { label: "New", bg: "var(--muted)", color: "var(--muted-foreground)" };
  const pct = Math.round((w.correctCount / w.reviewCount) * 100);
  if (pct >= 80) return { label: `${pct}%`, bg: "color-mix(in srgb, var(--app-primary) 15%, transparent)", color: "var(--app-primary)" };
  if (pct >= 50) return { label: `${pct}%`, bg: "#ffc80025", color: "#ffc800" };
  return { label: `${pct}%`, bg: "#ff4b4b25", color: "#ff4b4b" };
}

export function VocabularyList({ words }: { words: Word[] }) {
  const [query, setQuery] = useState("");
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return words;
    return words.filter(
      (w) => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)
    );
  }, [words, query]);

  function playAudio(word: Word, e: React.MouseEvent) {
    e.stopPropagation();
    if (!word.word.includes(" ") && word.audioUrl) {
      new Audio(word.audioUrl).play().catch(() => speakWord(word.word));
    } else {
      speakWord(word.word);
    }
  }

  async function handleRefresh(id: string, wordText: string, e: React.MouseEvent) {
    e.stopPropagation();
    setRefreshingId(id);
    try {
      const result = await refetchWordAudio(id);
      if (result.ipa || result.audioUrl) toast.success(`"${wordText}" refreshed`);
      else toast.info(`No dictionary data found for "${wordText}"`);
    } catch {
      toast.error("Refresh failed");
    } finally {
      setRefreshingId(null);
    }
  }

  return (
    <div className="space-y-3">

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search words or meanings…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 w-full rounded-xl border-2 bg-card pl-10 pr-4 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:border-[color:var(--app-primary)] transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-1">
        {filtered.length === words.length ? `${words.length} words` : `${filtered.length} of ${words.length} words`}
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-3xl">🔍</div>
          <div>
            <p className="font-extrabold">No results</p>
            <p className="text-sm text-muted-foreground mt-0.5">No words match &ldquo;{query}&rdquo;</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((w) => {
            const badge = masteryBadge(w);
            return (
              <div
                key={w.id}
                className="group flex items-stretch rounded-2xl border-2 bg-card overflow-hidden transition-all hover:shadow-sm"
                style={{ borderLeftColor: masteryAccent(w), borderLeftWidth: "4px" }}
              >
                <div className="flex flex-1 items-center gap-3 px-4 py-3 min-w-0">
                  {/* Word info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-[15px]">{w.word}</span>
                      {w.ipa && (
                        <span className="hidden sm:inline font-mono text-xs text-muted-foreground">{w.ipa}</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{w.meaning}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    {badge && (
                      <span
                        className="hidden sm:block rounded-full px-2 py-0.5 text-[11px] font-extrabold mr-1"
                        style={{ backgroundColor: badge.bg, color: badge.color }}
                      >
                        {badge.label}
                      </span>
                    )}

                    <button
                      onClick={(e) => playAudio(w, e)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-[#1cb0f6] hover:bg-[#1cb0f6]/15 transition-colors"
                      title="Play audio"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleRefresh(w.id, w.word, e)}
                      disabled={refreshingId === w.id}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
                      title="Refresh IPA & audio"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${refreshingId === w.id ? "animate-spin" : ""}`} />
                    </button>

                    <WordDialog
                      mode="edit"
                      word={{ id: w.id, word: w.word, meaning: w.meaning, examples: w.userExamples }}
                      trigger={
                        <button className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      }
                    />
                    <DeleteWordButton id={w.id} word={w.word} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
