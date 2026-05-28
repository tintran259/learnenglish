"use client";

import { useState, useMemo } from "react";
import { Search, Pencil, Volume2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
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
  reviewCount: number;
  correctCount: number;
}

interface VocabularyListProps {
  words: Word[];
}

export function VocabularyList({ words }: VocabularyListProps) {
  const [query, setQuery] = useState("");
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return words;
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)
    );
  }, [words, query]);

  function playAudio(word: Word, e: React.MouseEvent) {
    e.stopPropagation();
    // Phrases: stored audioUrl is from a fallback single word — speak the full phrase instead.
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
      if (result.ipa || result.audioUrl) {
        toast.success(`"${wordText}" refreshed`);
      } else {
        toast.info(`No dictionary data found for "${wordText}"`);
      }
    } catch {
      toast.error("Refresh failed");
    } finally {
      setRefreshingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search words or meanings…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 h-11 rounded-lg border-2 bg-card text-sm transition-shadow focus-visible:ring-0 focus-visible:border-[#58cc02]"
        />
      </div>

      {/* Count */}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {filtered.length === words.length
          ? `${words.length} words`
          : `${filtered.length} of ${words.length} words`}
      </p>

      {/* Empty search state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-3xl">
            🔍
          </div>
          <p className="font-bold text-foreground">No results</p>
          <p className="text-sm text-muted-foreground">
            No words match &ldquo;{query}&rdquo;
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((w) => (
            <div
              key={w.id}
              className="card-duo group flex items-center gap-3 rounded-lg border-2 bg-card px-4 py-3 transition-colors hover:border-[#58cc02]/40 hover:bg-[#58cc02]/5"
            >
              {/* Left: word + IPA + meaning */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-base tracking-tight">
                    {w.word}
                  </span>

                  {/* Audio + IPA */}
                  <button
                    onClick={(e) => playAudio(w, e)}
                    className="flex items-center gap-1 rounded-full bg-[#1cb0f6]/15 px-2 py-0.5 text-[#1cb0f6] hover:bg-[#1cb0f6]/25 transition-colors"
                    title="Play pronunciation"
                    aria-label={`Play ${w.word}`}
                  >
                    <Volume2 className="h-3 w-3" />
                    {w.ipa && (
                      <span className="font-mono text-[11px] font-medium">
                        {w.ipa}
                      </span>
                    )}
                  </button>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                  {w.meaning}
                </p>
              </div>

              {/* Right: stats + actions */}
              <div className="flex shrink-0 items-center gap-1">
                {w.reviewCount > 0 && (
                  <span className="hidden sm:flex items-center gap-0.5 rounded-full bg-[#58cc02]/15 px-2 py-0.5 text-[11px] font-bold text-[#58cc02]">
                    {w.correctCount}/{w.reviewCount}
                  </span>
                )}

                {/* Refresh dictionary data */}
                <button
                  onClick={(e) => handleRefresh(w.id, w.word, e)}
                  disabled={refreshingId === w.id}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
                  aria-label={`Refresh ${w.word}`}
                  title="Refresh IPA, audio & examples"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${refreshingId === w.id ? "animate-spin" : ""}`}
                  />
                </button>

                {/* Edit */}
                <WordDialog
                  mode="edit"
                  word={w}
                  trigger={
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      aria-label={`Edit ${w.word}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  }
                />

                <DeleteWordButton id={w.id} word={w.word} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
