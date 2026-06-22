export interface SkillCount {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

export interface LeetCodeStats {
  username: string;
  ranking: number | null;
  totalSolved: number;
  totalProblems: number;
  solvedPercentage: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number | null;
  totalAcceptedSubmissions: number;
  totalSubmissionAttempts: number;
  strongestTopics: SkillCount[];
  fundamentalSkills: SkillCount[];
  intermediateSkills: SkillCount[];
  advancedSkills: SkillCount[];
}

export interface LeetCodeStatsResponse {
  leetcodeStats: LeetCodeStats;
}

export interface GithubLanguage {
  name: string;
  color: string | null;
  size: number;
  percentage: number;
}

export interface GithubRepository {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  isArchived: boolean;
  createdAt: string;
  pushedAt: string | null;
  primaryLanguage: {
    name: string;
    color: string | null;
  } | null;
}

export interface GithubStats {
  name: string | null;
  login: string;
  bio: string | null;
  avatarUrl: string;
  status: {
    message: string;
    emoji: string;
  } | null;
  followers: number;
  contributions: {
    commits: number;
  };
  repositorySummary: {
    totalRepositories: number;
    totalStars: number;
    totalForks: number;
  };
  languages: GithubLanguage[];
  repositories: GithubRepository[];
}

export interface GithubStatsResponse {
  githubStats: GithubStats;
}

export interface PortfolioStats {
  totalProjects: number;
  completedProjects: number;
  totalTechnologies: number;
  totalCertificates: number;
  totalWorkExperiences: number;
  currentRoles: number;
  mostUsedTechnologies: Array<{
    name: string;
    projectCount: number;
  }>;
  projectsByStatus: Array<{
    status: string;
    count: number;
  }>;
}

export interface PortfolioStatsResponse {
  portfolioStats: PortfolioStats;
}
