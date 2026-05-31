import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Hero */}
        <Skeleton className="col-span-2 h-52 rounded-3xl" />
        {/* Streak + Leaderboard */}
        <Skeleton className="col-span-2 h-52 rounded-3xl" />
        {/* Stats */}
        <Skeleton className="col-span-1 h-24 rounded-3xl" />
        <Skeleton className="col-span-1 h-24 rounded-3xl" />
        <Skeleton className="col-span-2 h-24 rounded-3xl" />
        {/* Review CTA */}
        <Skeleton className="col-span-2 h-24 rounded-3xl" />
        {/* Quick actions */}
        <Skeleton className="col-span-1 h-28 rounded-3xl" />
        <Skeleton className="col-span-1 h-28 rounded-3xl" />
      </div>
    </main>
  );
}
