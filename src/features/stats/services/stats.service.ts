import {
  getUserSettings, upsertUserSettings,
  getDailyReview, getWeeklyReviews,
  getTopLeaderboard, countAllUserSettings, countUserSettingsAbove,
} from "@/features/stats/repositories/stats.repository";
import type { StreakInfo, DayStats, LeaderboardResult } from "@/features/stats/types/stats.types";

export async function getStreakInfoService(userId: string): Promise<StreakInfo> {
  const today = new Date().toISOString().split("T")[0];
  const [settings, todayReview] = await Promise.all([
    getUserSettings(userId),
    getDailyReview(userId, today),
  ]);
  return {
    currentStreak: settings?.currentStreak ?? 0,
    bestStreak: settings?.bestStreak ?? 0,
    dailyTarget: settings?.dailyTarget ?? 10,
    todayReviewed: todayReview?.reviewed ?? 0,
    todayCorrect: todayReview?.correct ?? 0,
  };
}

export async function getWeeklyStatsService(userId: string): Promise<DayStats[]> {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
  const reviews = await getWeeklyReviews(userId, dates);
  return dates.map((date) => {
    const r = reviews.find((rv) => rv.date === date);
    const d = new Date(`${date}T12:00:00Z`);
    return {
      date,
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      reviewed: r?.reviewed ?? 0,
      correct: r?.correct ?? 0,
    };
  });
}

export async function getStreakLeaderboardService(userId: string): Promise<LeaderboardResult> {
  const [allSettings, totalUsers] = await Promise.all([
    getTopLeaderboard(50),
    countAllUserSettings(),
  ]);

  const entries = allSettings.map((s, i) => ({
    rank: i + 1,
    userId: s.userId,
    name: s.user.name,
    image: s.user.image,
    currentStreak: s.currentStreak,
    bestStreak: s.bestStreak,
    isCurrentUser: s.userId === userId,
  }));

  const currentUserEntry = entries.find((e) => e.isCurrentUser);
  let myRank = currentUserEntry?.rank ?? null;

  if (!currentUserEntry) {
    const mySettings = await getUserSettings(userId);
    if (mySettings) {
      const above = await countUserSettingsAbove(mySettings.currentStreak);
      myRank = above + 1;
    }
  }

  return { entries: entries.slice(0, 10), myRank, totalUsers };
}

export async function setDailyTargetService(userId: string, target: number) {
  if (isNaN(target) || target < 1 || target > 500) return;
  await upsertUserSettings(userId, { dailyTarget: target });
}
