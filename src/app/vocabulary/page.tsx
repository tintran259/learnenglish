import { Plus } from "lucide-react";
import { getAllVocabulary, getStats } from "@/actions/vocabulary";
import { VocabularyList } from "@/components/vocabulary-list";
import { WordDialog } from "@/components/word-dialog";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Words" };

export default async function VocabularyPage() {
  const [words, stats] = await Promise.all([getAllVocabulary(), getStats()]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">My Words</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your personal vocabulary collection
          </p>
        </div>
        <WordDialog
          mode="add"
          trigger={
            <button
              className="btn-duo flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold text-white"
              style={{ backgroundColor: "var(--app-primary)", boxShadow: "0 4px 0 var(--app-primary-shadow)" }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add word</span>
              <span className="sm:hidden">Add</span>
            </button>
          }
        />
      </div>

      {/* Stats strip — single card, 3 inline stats */}
      {words.length > 0 && (
        <div className="card-duo rounded-2xl border-2 bg-card">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { emoji: "📚", label: "Total",    value: stats.total,          color: "var(--app-primary)" },
              { emoji: "⚡", label: "Reviewed", value: stats.reviewed,       color: "#1cb0f6" },
              { emoji: "🎯", label: "Accuracy", value: `${stats.accuracy}%`, color: "#ffc800" },
            ].map(({ emoji, label, value, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-3 py-4 text-center">
                <span className="text-lg leading-none">{emoji}</span>
                <p className="text-xl font-black leading-none tabular-nums mt-0.5" style={{ color }}>
                  {value}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      {words.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-4xl">📚</div>
          <div>
            <p className="font-extrabold text-xl">No words yet</p>
            <p className="text-sm text-muted-foreground mt-1">Start building your vocabulary collection.</p>
          </div>
          <WordDialog
            mode="add"
            trigger={
              <button
                className="btn-duo flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold text-white"
                style={{ backgroundColor: "var(--app-primary)", boxShadow: "0 4px 0 var(--app-primary-shadow)" }}
              >
                <Plus className="h-4 w-4" />
                Add your first word
              </button>
            }
          />
        </div>
      ) : (
        <VocabularyList words={words} />
      )}
    </main>
  );
}
