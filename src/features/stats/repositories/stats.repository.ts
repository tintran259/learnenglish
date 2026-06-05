import { db } from "@/lib/db";

export async function getUserSettings(userId: string) {
  return db.userSettings.findUnique({ where: { userId } });
}

export async function upsertUserSettings(userId: string, data: {
  currentStreak?: number; bestStreak?: number; lastActiveDate?: string; dailyTarget?: number;
}) {
  return db.userSettings.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
}

export async function getDailyReview(userId: string, date: string) {
  return db.dailyReview.findUnique({ where: { userId_date: { userId, date } } });
}

export async function upsertDailyReview(userId: string, date: string, reviewed: number, correct: number) {
  return db.dailyReview.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, reviewed, correct },
    update: { reviewed: { increment: reviewed }, ...(correct > 0 ? { correct: { increment: correct } } : {}) },
  });
}

export async function getWeeklyReviews(userId: string, dates: string[]) {
  return db.dailyReview.findMany({ where: { userId, date: { in: dates } } });
}

export async function getTopLeaderboard(take: number) {
  return db.userSettings.findMany({
    orderBy: { currentStreak: "desc" },
    include: { user: { select: { id: true, name: true, image: true } } },
    take,
  });
}

export async function countAllUserSettings() {
  return db.userSettings.count();
}

export async function countUserSettingsAbove(streak: number) {
  return db.userSettings.count({ where: { currentStreak: { gt: streak } } });
}
