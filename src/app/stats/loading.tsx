import { Skeleton } from "@/components/ui/skeleton";

export default function StatsLoading() {
  return (
    <main className="mx-auto max-w-4xl px-4 md:px-8 py-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Streak + Today grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Skeleton className="md:col-span-2 h-56 rounded-2xl" />
        <Skeleton className="md:col-span-3 h-56 rounded-2xl" />
      </div>

      {/* Weekly chart */}
      <Skeleton className="h-64 w-full rounded-2xl" />

      {/* Lifetime + Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    </main>
  );
}
