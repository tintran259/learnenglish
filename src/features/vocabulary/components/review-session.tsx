"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { RotateCcw, Home, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Flashcard } from "@/features/vocabulary/components/flashcard";
import { markReview, getRandomVocabulary } from "@/features/vocabulary/actions/review.actions";

interface ReviewWord {
  id: string;
  word: string;
  meaning: string;
  ipa: string;
  audioUrl: string;
  audioUrlUk: string;
  examples: string;
}

export function ReviewSession({ words: initialWords }: { words: ReviewWord[] }) {
  const [words, setWords] = useState<ReviewWord[]>(initialWords);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [isRetrying, startRetry] = useTransition();

  function handleResult(wasCorrect: boolean) {
    markReview(words[index].id, wasCorrect).catch(() => null);
    if (wasCorrect) setCorrect((c) => c + 1);
    if (index + 1 >= words.length) setDone(true);
    else setIndex((i) => i + 1);
  }

  function handleRetry() {
    startRetry(async () => {
      const newWords = await getRandomVocabulary(words.length);
      setWords(newWords as ReviewWord[]);
      setIndex(0);
      setCorrect(0);
      setDone(false);
    });
  }

  if (done) {
    const total = words.length;
    const wrong = total - correct;
    const pct = Math.round((correct / total) * 100);
    const { emoji, msg, color } =
      pct >= 80
        ? { emoji: "🏆", msg: "Excellent work!", color: "#ffc800" }
        : pct >= 50
          ? { emoji: "💪", msg: "Good effort!", color: "var(--app-primary)" }
          : { emoji: "📚", msg: "Keep practicing!", color: "#1cb0f6" };

    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
        <div className="card-duo w-full rounded-2xl border-2 bg-card p-8 space-y-5">
          <div className="text-5xl">{emoji}</div>
          <div>
            <p className="text-6xl font-black" style={{ color }}>{pct}%</p>
            <p className="text-xl font-extrabold mt-1">{msg}</p>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-3 rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: "var(--app-primary)" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-4 py-3">
              <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "var(--app-primary)" }} />
              <div className="text-left">
                <p className="text-xl font-black" style={{ color: "var(--app-primary)" }}>{correct}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Correct</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-4 py-3">
              <XCircle className="h-5 w-5 shrink-0 text-[#ff4b4b]" />
              <div className="text-left">
                <p className="text-xl font-black text-[#ff4b4b]">{wrong}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Wrong</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full gap-3">
          <Link href="/" className="btn-duo flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 py-3.5 text-sm font-extrabold hover:bg-muted transition-colors">
            <Home className="h-4 w-4" />Home
          </Link>
          <button onClick={handleRetry} disabled={isRetrying} className="btn-duo flex flex-1 items-center justify-center gap-1.5 rounded-xl py-3.5 text-sm font-extrabold text-white disabled:opacity-70 disabled:cursor-not-allowed transition-colors" style={{ backgroundColor: "var(--app-primary)", boxShadow: "0 4px 0 var(--app-primary-shadow)" }}>
            {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            {isRetrying ? "Loading…" : "Try again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Flashcard
      key={words[index].id}
      word={words[index]}
      index={index}
      total={words.length}
      onResult={handleResult}
    />
  );
}
