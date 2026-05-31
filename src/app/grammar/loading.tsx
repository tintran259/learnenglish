import { Skeleton } from "@/components/ui/skeleton";

export default function GrammarLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </main>
  );
}
