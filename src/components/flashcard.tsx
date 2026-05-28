"use client";

import { useState, useCallback, useEffect } from "react";
import { Volume2, RotateCcw } from "lucide-react";
import { speakWord } from "@/lib/speech";

interface FlashcardWord {
  id: string;
  word: string;
  meaning: string;
  ipa: string;
  audioUrl: string;
  audioUrlUk: string;
  examples: string; // JSON-stringified string[]
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
      <mark
        key={i}
        className="bg-[#58cc02]/25 text-[#58cc02] font-bold not-italic rounded px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function Flashcard({ word, index, total, onResult }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const parsedExamples: string[] = (() => {
    try {
      return JSON.parse(word.examples) as string[];
    } catch {
      return [];
    }
  })();

  const isPhrase = word.word.includes(" ");

  const playAudio = useCallback(
    (e: React.MouseEvent, locale: "us" | "uk") => {
      e.stopPropagation();
      // Phrases: stored audioUrl is from a fallback single word, so always
      // use Web Speech API to pronounce the full phrase correctly.
      if (locale === "uk") {
        if (!isPhrase && word.audioUrlUk) {
          new Audio(word.audioUrlUk).play().catch(() => speakWord(word.word, "en-GB"));
        } else {
          speakWord(word.word, "en-GB");
        }
      } else {
        if (!isPhrase && word.audioUrl) {
          new Audio(word.audioUrl).play().catch(() => speakWord(word.word, "en-US"));
        } else {
          speakWord(word.word, "en-US");
        }
      }
    },
    [isPhrase, word.audioUrl, word.audioUrlUk, word.word]
  );

  function handleFlip() {
    if (!revealed) setRevealed(true);
    setFlipped((f) => !f);
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === " ") {
        e.preventDefault();
        if (!revealed) setRevealed(true);
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight" || e.key === "l") {
        if (revealed) { e.preventDefault(); onResult(true); }
      } else if (e.key === "ArrowLeft" || e.key === "j") {
        if (revealed) { e.preventDefault(); onResult(false); }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [revealed, onResult]);

  const progress = (index / total) * 100;

  function AudioButtons() {
    return (
      <div className="flex gap-2">
        <button
          onClick={(e) => playAudio(e, "us")}
          className="btn-duo flex items-center gap-1.5 rounded-lg border-2 border-[#1cb0f6] bg-[#1cb0f6]/10 px-3 py-1.5 text-xs font-extrabold text-[#1cb0f6] shadow-[0_3px_0_#0a8abf] hover:bg-[#1cb0f6]/20 transition-colors"
        >
          <Volume2 className="h-3.5 w-3.5" />
          🇺🇸 US
        </button>
        <button
          onClick={(e) => playAudio(e, "uk")}
          className="btn-duo flex items-center gap-1.5 rounded-lg border-2 border-[#ce82ff] bg-[#ce82ff]/10 px-3 py-1.5 text-xs font-extrabold text-[#ce82ff] shadow-[0_3px_0_#9b5fcf] hover:bg-[#ce82ff]/20 transition-colors"
        >
          <Volume2 className="h-3.5 w-3.5" />
          🇬🇧 UK
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
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-3 rounded-full bg-[#58cc02] transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/*
        CSS Grid stacking: both faces sit in the same grid cell (col-start-1 row-start-1).
        The taller face determines card height automatically — no fixed minHeight needed.
        preserve-3d + backface-hidden handles the flip visibility.
      */}
      <div
        className="relative w-full cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleFlip()}
        aria-label={flipped ? "Flip back to word" : "Flip to see meaning"}
      >
        <div
          className="preserve-3d grid w-full transition-transform duration-500"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Front face: word */}
          <div className="backface-hidden col-start-1 row-start-1 flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-xl border-2 bg-card p-8 shadow-[0_5px_0_rgba(0,0,0,0.08)] dark:shadow-[0_5px_0_rgba(0,0,0,0.3)]">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#58cc02]">
              What does this mean?
            </p>
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-5xl font-black tracking-tight text-center leading-tight">
                {word.word}
              </p>
              {word.ipa && (
                <p className="font-mono text-sm text-muted-foreground">{word.ipa}</p>
              )}
            </div>
            <AudioButtons />
            <p className="text-xs text-muted-foreground">
              {revealed ? "Tap to flip" : "Tap to reveal meaning"}
            </p>
          </div>

          {/* Back face: meaning + examples */}
          <div
            className="backface-hidden col-start-1 row-start-1 flex min-h-[260px] flex-col items-center gap-4 rounded-xl border-2 border-[#58cc02]/30 bg-[#58cc02]/5 p-8 shadow-[0_5px_0_rgba(88,204,2,0.15)] dark:bg-[#58cc02]/10"
            style={{ transform: "rotateY(180deg)" }}
          >
            {/* Core meaning — centered */}
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#58cc02]">
                Meaning
              </p>
              <div className="flex flex-col items-center gap-2">
                <span className="rounded-full border-2 border-[#58cc02]/40 px-3 py-0.5 text-xs font-bold text-[#58cc02]">
                  {word.word}
                </span>
                <p className="text-center text-2xl font-black leading-snug">
                  {word.meaning}
                </p>
                {word.ipa && (
                  <p className="font-mono text-sm text-muted-foreground">{word.ipa}</p>
                )}
              </div>
              <AudioButtons />
              <p className="text-xs text-muted-foreground">Tap to flip</p>
            </div>

            {/* Examples — shown at bottom of back face */}
            {parsedExamples.length > 0 && (
              <div className="w-full space-y-1.5 border-t border-[#58cc02]/20 pt-3">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#58cc02]/70">
                  Examples
                </p>
                {parsedExamples.map((ex, i) => (
                  <p key={i} className="text-xs leading-relaxed text-foreground/75 italic">
                    &ldquo;{highlightExample(ex, word.word)}&rdquo;
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {!revealed ? (
        <>
          <button
            onClick={handleFlip}
            className="btn-duo w-full rounded-lg border-2 border-[#58cc02] bg-[#58cc02]/10 py-3 text-sm font-extrabold text-[#58cc02] shadow-[0_4px_0_rgba(88,204,2,0.3)] hover:bg-[#58cc02]/20 transition-colors"
          >
            Reveal answer
          </button>
          <p className="text-[10px] text-muted-foreground/50 -mt-2">[Space] reveal</p>
        </>
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
              className="btn-duo flex-1 rounded-lg border-2 border-[#ff4b4b] bg-[#ff4b4b]/10 py-3 text-sm font-extrabold text-[#ff4b4b] shadow-[0_4px_0_rgba(255,75,75,0.3)] hover:bg-[#ff4b4b]/20 transition-colors"
            >
              ✗ &nbsp;Wrong
            </button>
            <button
              onClick={() => onResult(true)}
              className="btn-duo flex-1 rounded-lg border-2 border-[#58cc02] bg-[#58cc02]/10 py-3 text-sm font-extrabold text-[#58cc02] shadow-[0_4px_0_rgba(88,204,2,0.3)] hover:bg-[#58cc02]/20 transition-colors"
            >
              ✓ &nbsp;Correct
            </button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/50">
            [Space] flip &nbsp;·&nbsp; [←/j] wrong &nbsp;·&nbsp; [→/l] correct
          </p>
        </div>
      )}
    </div>
  );
}
