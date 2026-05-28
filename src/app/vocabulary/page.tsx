import { Plus } from "lucide-react";
import { getAllVocabulary } from "@/actions/vocabulary";
import { VocabularyList } from "@/components/vocabulary-list";
import { WordDialog } from "@/components/word-dialog";

export default async function VocabularyPage() {
  const words = await getAllVocabulary();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">My Words</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {words.length} word{words.length !== 1 ? "s" : ""} in your collection
          </p>
        </div>

        <WordDialog
          mode="add"
          trigger={
            <button className="btn-duo flex items-center gap-1.5 rounded-lg bg-[#58cc02] px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_#46a302] hover:bg-[#4db801] transition-colors">
              <Plus className="h-4 w-4" />
              Add word
            </button>
          }
        />
      </div>

      {words.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="text-6xl">📚</span>
          <div>
            <p className="font-extrabold text-lg">No words yet</p>
            <p className="text-sm text-muted-foreground">
              Click &ldquo;Add word&rdquo; to start your collection.
            </p>
          </div>
        </div>
      ) : (
        <VocabularyList words={words} />
      )}
    </main>
  );
}
