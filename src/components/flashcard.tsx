"use client";

import { useState, useCallback, useEffect } from "react";
import { Volume2, RotateCcw, ChevronRight } from "lucide-react";
import { speakWord } from "@/lib/speech";

interface FlashcardWord {
  id: string;
  word: string;
  meaning: string;
  ipa: string;
  audioUrl: string;
  audioUrlUk: string;
  examples: string;
}

interface FlashcardProps {
  word: FlashcardWord;
  index: number;
  total: number;
  onResult: (correct: boolean) => void;
}

function highlightExample(example: string, word: string) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = example.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === word.toLowerCase() ? (
      <mark key={i} className="rounded px-0.5 font-bold not-italic" style={{ backgroundColor: "color-mix(in srgb, var(--app-primary) 25%, transparent)", color: "var(--app-primary)" }}>
        {part}
      </mark>
    ) : part
  );
}

export function Flashcard({ word, index, total, onResult }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const examples: string[] = (() => {
    try { return JSON.parse(word.examples) as string[]; } catch { return []; }
  })();

  const isPhrase = word.word.includes(" ");

  const playAudio = useCallback((e: React.MouseEvent, locale: "us" | "uk") => {
    e.stopPropagation();
    if (locale === "uk") {
      if (!isPhrase && word.audioUrlUk) new Audio(word.audioUrlUk).play().catch(() => speakWord(word.word, "en-GB"));
      else speakWord(word.word, "en-GB");
    } else {
      if (!isPhrase && word.audioUrl) new Audio(word.audioUrl).play().catch(() => speakWord(word.word, "en-US"));
      else speakWord(word.word, "en-US");
    }
  }, [isPhrase, word.audioUrl, word.audioUrlUk, word.word]);

  function handleFlip() {
    if (!revealed) setRevealed(true);
    setFlipped((f) => !f);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " ") { e.preventDefault(); if (!revealed) setRevealed(true); setFlipped((f) => !f); }
      else if ((e.key === "ArrowRight" || e.key === "l") && revealed) { e.preventDefault(); onResult(true); }
      else if ((e.key === "ArrowLeft" || e.key === "j") && revealed) { e.preventDefault(); onResult(false); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, onResult]);

  const progress = (index / total) * 100;

  function AudioRow() {
    return (
      <div className="flex gap-2">
        <button onClick={(e) => playAudio(e, "us")} className="btn-duo flex items-center gap-1.5 rounded-xl border-2 border-[#1cb0f6] bg-[#1cb0f6]/10 px-3 py-1.5 text-xs font-extrabold text-[#1cb0f6] shadow-[0_3px_0_#0a8abf] hover:bg-[#1cb0f6]/20 transition-colors">
          <Volume2 className="h-3.5 w-3.5" />🇺🇸 US
        </button>
        <button onClick={(e) => playAudio(e, "uk")} className="btn-duo flex items-center gap-1.5 rounded-xl border-2 border-[#ce82ff] bg-[#ce82ff]/10 px-3 py-1.5 text-xs font-extrabold text-[#ce82ff] shadow-[0_3px_0_#9b5fcf] hover:bg-[#ce82ff]/20 transition-colors">
          <Volume2 className="h-3.5 w-3.5" />🇬🇧 UK
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5">

      {/* Progress */}
      <div className="w-full space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-muted-foreground">
          <span>{index + 1} / {total}</span>
          <span>{total - index - 1} left</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-2.5 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%`, backgroundColor: "var(--app-primary)" }} />
        </div>
      </div>

      {/* Card */}
      <div
        className="relative w-full cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleFlip()}
        aria-label={flipped ? "Flip back to word" : "Flip to see meaning"}
      >
        <div className="preserve-3d grid w-full transition-transform duration-500" style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>

          {/* Front */}
          <div className="backface-hidden col-start-1 row-start-1 flex min-h-[280px] flex-col items-center justify-center gap-5 rounded-2xl border-2 bg-card p-8 shadow-[0_6px_0_rgba(0,0,0,0.07)] dark:shadow-[0_6px_0_rgba(0,0,0,0.3)]">
            <p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: "var(--app-primary)" }}>
              What does this mean?
            </p>
            <div className="flex flex-col items-center gap-2">
              <p className="text-5xl font-black tracking-tight text-center leading-tight">{word.word}</p>
              {word.ipa && <p className="font-mono text-sm text-muted-foreground">{word.ipa}</p>}
            </div>
            <AudioRow />
            <p className="text-xs text-muted-foreground">
              {revealed ? "Tap to flip" : "Tap to reveal meaning"}
            </p>
          </div>

          {/* Back */}
          <div
            className="backface-hidden col-start-1 row-start-1 flex min-h-[280px] flex-col items-center gap-5 rounded-2xl border-2 p-8 shadow-[0_6px_0_rgba(0,0,0,0.07)] dark:shadow-[0_6px_0_rgba(0,0,0,0.3)]"
            style={{
              transform: "rotateY(180deg)",
              borderColor: "color-mix(in srgb, var(--app-primary) 30%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--app-primary) 5%, var(--card))",
            }}
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-4 w-full">
              <p className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: "var(--app-primary)" }}>Meaning</p>
              <div className="flex flex-col items-center gap-2">
                <span className="rounded-full border-2 px-3 py-0.5 text-xs font-bold" style={{ borderColor: "color-mix(in srgb, var(--app-primary) 40%, transparent)", color: "var(--app-primary)" }}>
                  {word.word}
                </span>
                <p className="text-center text-2xl font-black leading-snug">{word.meaning}</p>
                {word.ipa && <p className="font-mono text-sm text-muted-foreground">{word.ipa}</p>}
              </div>
              <AudioRow />
              <p className="text-xs text-muted-foreground">Tap to flip back</p>
            </div>

            {examples.length > 0 && (
              <div className="w-full space-y-1.5 border-t pt-4" style={{ borderColor: "color-mix(in srgb, var(--app-primary) 20%, transparent)" }}>
                <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: "color-mix(in srgb, var(--app-primary) 70%, transparent)" }}>
                  Examples
                </p>
                {examples.slice(0, 2).map((ex, i) => (
                  <p key={i} className="text-xs leading-relaxed text-foreground/70 italic">
                    &ldquo;{highlightExample(ex, word.word)}&rdquo;
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {!revealed ? (
        <button
          onClick={handleFlip}
          className="btn-duo w-full flex items-center justify-center gap-2 rounded-xl border-2 py-3.5 text-sm font-extrabold transition-colors"
          style={{
            borderColor: "var(--app-primary)",
            backgroundColor: "color-mix(in srgb, var(--app-primary) 10%, transparent)",
            color: "var(--app-primary)",
          }}
        >
          Reveal answer
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : (
        <div className="w-full space-y-2">
          <button
            onClick={handleFlip}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            <RotateCcw className="h-3 w-3" />
            {flipped ? "See word" : "See meaning"}
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => onResult(false)}
              className="btn-duo flex-1 rounded-xl border-2 border-[#ff4b4b] bg-[#ff4b4b]/10 py-3.5 text-sm font-extrabold text-[#ff4b4b] shadow-[0_4px_0_rgba(255,75,75,0.3)] hover:bg-[#ff4b4b]/20 transition-colors"
            >
              ✗ Wrong
            </button>
            <button
              onClick={() => onResult(true)}
              className="btn-duo flex-1 rounded-xl border-2 py-3.5 text-sm font-extrabold transition-colors"
              style={{
                borderColor: "var(--app-primary)",
                backgroundColor: "color-mix(in srgb, var(--app-primary) 10%, transparent)",
                color: "var(--app-primary)",
                boxShadow: "0 4px 0 color-mix(in srgb, var(--app-primary) 30%, transparent)",
              }}
            >
              ✓ Correct
            </button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/50">
            [Space] flip · [←/j] wrong · [→/l] correct
          </p>
        </div>
      )}
    </div>
  );
}
