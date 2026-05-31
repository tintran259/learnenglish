"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getStreakInfo() {
  const userId = await requireUserId();
  const today = new Date().toISOString().split("T")[0];

  const [settings, todayReview] = await Promise.all([
    db.userSettings.findUnique({ where: { userId } }),
    db.dailyReview.findUnique({ where: { userId_date: { userId, date: today } } }),
  ]);

  return {
    currentStreak: settings?.currentStreak ?? 0,
    bestStreak: settings?.bestStreak ?? 0,
    dailyTarget: settings?.dailyTarget ?? 10,
    todayReviewed: todayReview?.reviewed ?? 0,
    todayCorrect: todayReview?.correct ?? 0,
  };
}

export async function getWeeklyStats() {
  const userId = await requireUserId();

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const reviews = await db.dailyReview.findMany({
    where: { userId, date: { in: dates } },
  });

  return dates.map((date) => {
    const r = reviews.find((rv) => rv.date === date);
    // Use noon UTC to avoid DST edge cases when formatting the day name
    const d = new Date(`${date}T12:00:00Z`);
    return {
      date,
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      reviewed: r?.reviewed ?? 0,
      correct: r?.correct ?? 0,
    };
  });
}

export async function getStreakLeaderboard() {
  const userId = await requireUserId();

  // Fetch top 50 by currentStreak + total count in one go
  const [allSettings, totalUsers] = await Promise.all([
    db.userSettings.findMany({
      orderBy: { currentStreak: "desc" },
      include: { user: { select: { id: true, name: true, image: true } } },
      take: 50,
    }),
    db.userSettings.count(),
  ]);

  // Rank is position in the sorted list (1-based)
  const entries = allSettings.map((s, i) => ({
    rank: i + 1,
    userId: s.userId,
    name: s.user.name,
    image: s.user.image,
    currentStreak: s.currentStreak,
    bestStreak: s.bestStreak,
    isCurrentUser: s.userId === userId,
  }));

  // If current user not in top 50, fetch their rank separately
  const currentUserEntry = entries.find((e) => e.isCurrentUser);
  let myRank = currentUserEntry?.rank ?? null;

  if (!currentUserEntry) {
    const mySettings = await db.userSettings.findUnique({ where: { userId } });
    if (mySettings) {
      const above = await db.userSettings.count({
        where: { currentStreak: { gt: mySettings.currentStreak } },
      });
      myRank = above + 1;
    }
  }

  return { entries: entries.slice(0, 10), myRank, totalUsers };
}

export async function setDailyTarget(formData: FormData) {
  const userId = await requireUserId();
  const raw = formData.get("target");
  const target = parseInt(raw as string, 10);
  if (isNaN(target) || target < 1 || target > 500) return;

  await db.userSettings.upsert({
    where: { userId },
    create: { userId, dailyTarget: target },
    update: { dailyTarget: target },
  });
  revalidatePath("/stats");
  revalidatePath("/");
}
