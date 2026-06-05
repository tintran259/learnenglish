export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  dailyTarget: number;
  todayReviewed: number;
  todayCorrect: number;
}

export interface DayStats {
  date: string;
  day: string;
  reviewed: number;
  correct: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  currentStreak: number;
  bestStreak: number;
  isCurrentUser: boolean;
}

export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  myRank: number | null;
  totalUsers: number;
}
