"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  getStreakInfoService, getWeeklyStatsService,
  getStreakLeaderboardService, setDailyTargetService,
} from "@/features/stats/services/stats.service";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getStreakInfo() {
  const userId = await requireUserId();
  return getStreakInfoService(userId);
}

export async function getWeeklyStats() {
  const userId = await requireUserId();
  return getWeeklyStatsService(userId);
}

export async function getStreakLeaderboard() {
  const userId = await requireUserId();
  return getStreakLeaderboardService(userId);
}

export async function setDailyTarget(formData: FormData) {
  const userId = await requireUserId();
  const raw = formData.get("target");
  const target = parseInt(raw as string, 10);
  await setDailyTargetService(userId, target);
  revalidatePath("/stats");
  revalidatePath("/");
}
