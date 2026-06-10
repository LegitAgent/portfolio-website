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

  fundamentalSkills: Array<SkillCount>,
  intermediateSkills: Array<SkillCount>,
  advancedSkills: Array<SkillCount>,
}

interface SkillCount {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

export interface LeetCodeStatsResponse {
  stats: LeetCodeStats;
}