interface SkillCount {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

export interface LeetCodeStats {
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

  fundamentalSkills: Array<SkillCount>;
  intermediateSkills: Array<SkillCount>;
  advancedSkills: Array<SkillCount>;
}

interface Repository {
  name: string;
  description: string | null;
  url: string;
  isPrivate: boolean;
  stars: number;
}

export interface GithubStats {
  name: string | null;
  login: string;
  bio: string;
  avatarUrl: string;

  status: {
    message: string;
    emoji: string;
  } | null;

  contributions: {
    commits: number;
    restricted: number;
  };

  repositories: Array<Repository>;
}
