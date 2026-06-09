interface LeetCodeStats {
  username: string;
  ranking: number | null;

  totalSolved: number;
  totalProblems: number;

  easySolved: number;
  totalEasy: number;

  mediumSolved: number;
  totalMedium: number;

  hardSolved: number;
  totalHard: number;
}

export interface LeetCodeStatsResponse {
  stats: LeetCodeStats;
}