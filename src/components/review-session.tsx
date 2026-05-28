"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { RotateCcw, Home, Loader2 } from "lucide-react";
import { Flashcard } from "@/components/flashcard";
import { markReview, getRandomVocabulary } from "@/actions/vocabulary";

interface ReviewWord {
  id: string;
  word: string;
  meaning: string;
  ipa: string;
  audioUrl: string;
  audioUrlUk: string;
  examples: string;
}

interface ReviewSessionProps {
  words: ReviewWord[];
}

export function ReviewSession({ words: initialWords }: ReviewSessionProps) {
  const [words, setWords] = useState<ReviewWord[]>(initialWords);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [isRetrying, startRetry] = useTransition();

  function handleResult(wasCorrect: boolean) {
    // fire-and-forget mark review
    markReview(words[index].id, wasCorrect).catch(() => null);

    if (wasCorrect) setCorrect((c) => c + 1);
    if (index + 1 >= words.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  function handleRetry() {
    startRetry(async () => {
      const newWords = await getRandomVocabulary(words.length);
      // reset everything with the new word set
      setWords(newWords as ReviewWord[]);
      setIndex(0);
      setCorrect(0);
      setDone(false);
    });
  }

  if (done) {
    const pct = Math.round((correct / words.length) * 100);
    const { emoji, msg, color } =
      pct >= 80
        ? { emoji: "🏆", msg: "Excellent work!", color: "#ffc800" }
        : pct >= 50
          ? { emoji: "💪", msg: "Good effort!", color: "#58cc02" }
          : { emoji: "📚", msg: "Keep practicing!", color: "#1cb0f6" };

    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <div className="card-duo w-full rounded-xl border-2 bg-card p-8 space-y-4">
          <div className="text-6xl">{emoji}</div>
          <div>
            <p className="text-5xl font-black" style={{ color }}>{pct}%</p>
            <p className="font-extrabold text-lg mt-1">{msg}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {correct} correct &nbsp;·&nbsp; {words.length - correct} wrong
            </p>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-3 rounded-full bg-[#58cc02] transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex w-full gap-3">
          <Link
            href="/"
            className="btn-duo flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 py-3 text-sm font-extrabold hover:border-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="btn-duo flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#58cc02] py-3 text-sm font-extrabold text-white shadow-[0_4px_0_#46a302] hover:bg-[#4db801] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {isRetrying
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <RotateCcw className="h-4 w-4" />
            }
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
