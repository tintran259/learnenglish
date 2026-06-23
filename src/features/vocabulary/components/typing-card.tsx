"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle2, XCircle, ChevronRight, Eye } from "lucide-react";

interface TypingCardWord {
  id: string;
  word: string;
  meaning: string;
  ipa: string;
  examples: string;
}

interface TypingCardProps {
  word: TypingCardWord;
  index: number;
  total: number;
  onResult: (correct: boolean) => void;
}

export function TypingCard({ word, index, total, onResult }: TypingCardProps) {
  let letterCount = 0;
  const parts = word.word.split("").map((char) => {
    if (char === " ") return { type: "space" as const };
    return { type: "letter" as const, letterIndex: letterCount++, target: char };
  });
  const totalLetters = letterCount;
  const targetLetters = word.word.split("").filter((c) => c !== " ");

  const [inputText, setInputText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Strip spaces from user input to compare letter-by-letter
  const inputLetters = inputText.split("").filter((c) => c !== " ");

  function getLetterStatus(letterIdx: number): "correct" | "wrong" | null {
    const typed = inputLetters[letterIdx];
    if (!typed) return null;
    return typed.toLowerCase() === targetLetters[letterIdx].toLowerCase() ? "correct" : "wrong";
  }

  const isComplete = inputLetters.length >= totalLetters;
  const allCorrect =
    isComplete && targetLetters.every((_, i) => getLetterStatus(i) === "correct");

  useEffect(() => {
    setInputText("");
    setIsDone(false);
    setIsCorrect(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [word.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isDone && (e.key === "Enter" || e.key === "ArrowRight" || e.key === "l")) {
        e.preventDefault();
        onResult(isCorrect);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDone, isCorrect, onResult]);

  function handleCheck() {
    setIsCorrect(allCorrect);
    setIsDone(true);
  }

  function handleReveal() {
    setIsCorrect(false);
    setIsDone(true);
  }

  const progress = (index / total) * 100;
  const examples: string[] = (() => {
    try { return JSON.parse(word.examples) as string[]; } catch { return []; }
  })();

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5">
      <div className="w-full space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-muted-foreground">
          <span>{index + 1} / {total}</span>
          <span>{total - index - 1} left</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%`, backgroundColor: "var(--app-primary)" }}
          />
        </div>
      </div>

      <div className="w-full rounded-2xl border-2 bg-card shadow-[0_6px_0_rgba(0,0,0,0.07)] dark:shadow-[0_6px_0_rgba(0,0,0,0.3)]">
        <div className="p-6 space-y-5">
          <p
            className="text-[11px] font-extrabold uppercase tracking-widest text-center"
            style={{ color: "var(--app-primary)" }}
          >
            Type the English word
          </p>

          <div className="text-center min-h-[48px] flex items-center justify-center">
            <p className="text-2xl font-black leading-snug">{word.meaning}</p>
          </div>

          {/* Single text input */}
          <input
            ref={inputRef}
            value={inputText}
            onChange={(e) => { if (!isDone) setInputText(e.target.value); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isComplete && !isDone) handleCheck();
            }}
            disabled={isDone}
            placeholder="Type here..."
            className="h-12 w-full rounded-xl border-2 bg-background px-4 text-sm font-semibold placeholder:text-muted-foreground focus:outline-none focus:border-[color:var(--app-primary)] disabled:opacity-50 transition-colors"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />

          {/* Per-character feedback — read-only display */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {parts.map((part, i) =>
              part.type === "space" ? (
                <div key={i} className="w-3" />
              ) : (
                <div
                  key={i}
                  className={[
                    "h-9 w-8 rounded-lg border-2 flex items-center justify-center text-xs font-extrabold uppercase transition-all duration-150 select-none",
                    getLetterStatus(part.letterIndex) === "correct"
                      ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
                      : getLetterStatus(part.letterIndex) === "wrong"
                        ? "border-[#ff4b4b] bg-[#ff4b4b]/10 text-[#ff4b4b]"
                        : "border-border bg-muted/30 text-transparent",
                  ].join(" ")}
                >
                  {inputLetters[part.letterIndex] ?? ""}
                </div>
              )
            )}
          </div>

          {/* Result feedback */}
          {isDone && (
            <div className="space-y-3">
              {isCorrect ? (
                <div className="flex items-center gap-3 rounded-xl border-2 border-green-500/30 bg-green-500/10 px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <p className="font-extrabold text-green-500">Correct!</p>
                    {word.ipa && (
                      <p className="font-mono text-sm text-muted-foreground">{word.ipa}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border-2 border-[#ff4b4b]/30 bg-[#ff4b4b]/10 px-4 py-3">
                  <XCircle className="h-5 w-5 shrink-0 text-[#ff4b4b]" />
                  <div>
                    <p className="font-extrabold text-[#ff4b4b]">Wrong</p>
                    <p className="text-sm">
                      <span className="font-extrabold" style={{ color: "var(--app-primary)" }}>
                        {word.word}
                      </span>
                      {word.ipa && (
                        <span className="ml-1.5 font-mono font-normal text-xs text-muted-foreground">
                          {word.ipa}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {examples.length > 0 && (
                <div className="space-y-1.5 border-t pt-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                    Examples
                  </p>
                  {examples.slice(0, 2).map((ex, i) => (
                    <p key={i} className="text-xs leading-relaxed text-foreground/70 italic">
                      &ldquo;{ex}&rdquo;
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {!isDone ? (
            <div className="space-y-2">
              <button
                onClick={handleCheck}
                disabled={!isComplete}
                className="btn-duo w-full rounded-xl py-3.5 text-sm font-extrabold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                style={{
                  backgroundColor: "var(--app-primary)",
                  boxShadow: "0 4px 0 var(--app-primary-shadow)",
                }}
              >
                Check →
              </button>
              <button
                onClick={handleReveal}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-xs font-extrabold text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <Eye className="h-3.5 w-3.5" /> Reveal answer
              </button>
            </div>
          ) : (
            <button
              onClick={() => onResult(isCorrect)}
              className="btn-duo w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-extrabold text-white transition-colors"
              style={{
                backgroundColor: "var(--app-primary)",
                boxShadow: "0 4px 0 var(--app-primary-shadow)",
              }}
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {isDone && (
        <p className="text-center text-[10px] text-muted-foreground/50">
          [Enter] or [→/l] next
        </p>
      )}
    </div>
  );
}
