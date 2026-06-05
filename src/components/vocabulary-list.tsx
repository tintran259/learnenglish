"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Pencil, Volume2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { WordDialog } from "@/components/word-dialog";
import { DeleteWordButton } from "@/components/delete-word-button";
import { speakWord } from "@/lib/speech";
import { refetchWordAudio, VOCABULARY_PAGE_SIZE } from "@/actions/vocabulary";

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

interface Props {
  words: Word[];
  total: number;
  page: number;
  totalPages: number;
  q: string;
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

function pageUrl(page: number, q: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (q) params.set("q", q);
  const qs = params.toString();
  return `/vocabulary${qs ? `?${qs}` : ""}`;
}

function Pagination({ page, totalPages, q }: { page: number; totalPages: number; q: string }) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const btnBase = "flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-colors";
  const btnActive = "border-[color:var(--app-primary)] text-[color:var(--app-primary)] bg-[color:var(--app-primary)]/10 font-bold";
  const btnIdle = "bg-card text-muted-foreground hover:border-[color:var(--app-primary)] hover:text-foreground";
  const btnDisabled = "opacity-30 cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      {page > 1 ? (
        <Link href={pageUrl(page - 1, q)} className={`${btnBase} ${btnIdle}`}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`}><ChevronLeft className="h-4 w-4" /></span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`el-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">…</span>
        ) : (
          <Link key={p} href={pageUrl(p, q)} className={`${btnBase} text-sm ${p === page ? btnActive : btnIdle}`}>
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={pageUrl(page + 1, q)} className={`${btnBase} ${btnIdle}`}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`}><ChevronRight className="h-4 w-4" /></span>
      )}
    </div>
  );
}

export function VocabularyList({ words, total, page, totalPages, q }: Props) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(q);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  // Sync input when URL q changes (browser back/forward)
  useEffect(() => { setInputValue(q); }, [q]);

  // Debounce: update URL 300ms after user stops typing, always reset to page 1
  useEffect(() => {
    const trimmed = inputValue.trim();
    if (trimmed === q.trim()) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (trimmed) params.set("q", trimmed);
      const qs = params.toString();
      router.replace(`/vocabulary${qs ? `?${qs}` : ""}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, q, router]);

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

  const startIdx = (page - 1) * VOCABULARY_PAGE_SIZE + 1;
  const endIdx = Math.min(page * VOCABULARY_PAGE_SIZE, total);

  return (
    <div className="space-y-3">

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search words or meanings…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="h-11 w-full rounded-xl border-2 bg-card pl-10 pr-4 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:border-[color:var(--app-primary)] transition-colors"
        />
        {inputValue && (
          <button
            onClick={() => setInputValue("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {/* Count label */}
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-1">
        {q
          ? `${total} result${total !== 1 ? "s" : ""} for "${q}"`
          : total > VOCABULARY_PAGE_SIZE
          ? `${startIdx}–${endIdx} of ${total} words`
          : `${total} word${total !== 1 ? "s" : ""}`}
      </p>

      {words.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-3xl">🔍</div>
          <div>
            <p className="font-extrabold">No results</p>
            <p className="text-sm text-muted-foreground mt-0.5">No words match &ldquo;{q}&rdquo;</p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {words.map((w) => {
              const badge = masteryBadge(w);
              return (
                <div
                  key={w.id}
                  className="group flex items-stretch rounded-2xl border-2 bg-card overflow-hidden transition-all hover:shadow-sm"
                  style={{ borderLeftColor: masteryAccent(w), borderLeftWidth: "4px" }}
                >
                  <div className="flex flex-1 items-center gap-3 px-4 py-3 min-w-0">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="font-extrabold text-[15px] truncate shrink-0 max-w-[45%] sm:max-w-none">{w.word}</span>
                        {w.ipa && (
                          <span className="hidden sm:inline font-mono text-xs text-muted-foreground truncate">{w.ipa}</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground truncate">{w.meaning}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-0.5">
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
                        className="hidden sm:flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
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

          <Pagination page={page} totalPages={totalPages} q={q} />
        </>
      )}
    </div>
  );
}
