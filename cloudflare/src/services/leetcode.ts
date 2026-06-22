interface DifficultyCount {
  difficulty: string;
  count: number;
  submissions?: number;
}

interface SkillCount {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

interface LeetcodeResponse {
  data?: {
    allQuestionsCount: DifficultyCount[];
    matchedUser: {
      username: string;
      profile: {
        ranking: number | null;
      };
      submitStats: {
        acSubmissionNum: DifficultyCount[];
        totalSubmissionNum: DifficultyCount[];
      };
      tagProblemCounts: {
        advanced: SkillCount[];
        intermediate: SkillCount[];
        fundamental: SkillCount[];
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}

const LEETCODE_API = 'https://leetcode.com/graphql';

const query = `
  query userSessionProgress($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      username
      profile {
        ranking
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      tagProblemCounts {
        advanced {
          tagName
          tagSlug
          problemsSolved
        }
        intermediate {
          tagName
          tagSlug
          problemsSolved
        }
        fundamental {
          tagName
          tagSlug
          problemsSolved
        }
      }
    }
  }
`;

export async function getLeetCodeStats(username: string) {
  const response = await fetch(LEETCODE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Leetcode returned ${response.status}: ${details}`);
  }

  const body = await response.json<LeetcodeResponse>();

  if (body.errors?.length) {
    const message = body.errors[0].message;

    if (message.includes('That user does not exist.')) {
      return null;
    }

    throw new Error(message);
  }

  const user = body.data?.matchedUser;
  if (!user) {
    return null;
  }

  const accepted = user.submitStats.acSubmissionNum;
  const attempted = user.submitStats.totalSubmissionNum;
  const totalProblems = body.data?.allQuestionsCount ?? [];
  const totalSolved = findCount(accepted, 'All');
  const availableProblems = findCount(totalProblems, 'All');
  const totalAcceptedSubmissions = findSubmissions(accepted, 'All');
  const totalSubmissionAttempts = findSubmissions(attempted, 'All');
  const allTopics = [
    ...user.tagProblemCounts.fundamental,
    ...user.tagProblemCounts.intermediate,
    ...user.tagProblemCounts.advanced,
  ];

  return {
    username: user.username,
    ranking: user.profile.ranking,
    totalSolved,
    totalProblems: availableProblems,
    solvedPercentage: percentage(totalSolved, availableProblems),
    easySolved: findCount(accepted, 'Easy'),
    totalEasy: findCount(totalProblems, 'Easy'),
    mediumSolved: findCount(accepted, 'Medium'),
    totalMedium: findCount(totalProblems, 'Medium'),
    hardSolved: findCount(accepted, 'Hard'),
    totalHard: findCount(totalProblems, 'Hard'),
    acceptanceRate: totalSubmissionAttempts > 0
      ? percentage(totalAcceptedSubmissions, totalSubmissionAttempts)
      : null,
    totalAcceptedSubmissions,
    totalSubmissionAttempts,
    strongestTopics: [...allTopics]
      .sort((first, second) => second.problemsSolved - first.problemsSolved)
      .slice(0, 8),
    fundamentalSkills: user.tagProblemCounts.fundamental,
    intermediateSkills: user.tagProblemCounts.intermediate,
    advancedSkills: user.tagProblemCounts.advanced,
  };
}

function findCount(items: DifficultyCount[], difficulty: string) {
  return items.find((item) => item.difficulty === difficulty)?.count ?? 0;
}

function findSubmissions(items: DifficultyCount[], difficulty: string) {
  return items.find((item) => item.difficulty === difficulty)?.submissions ?? 0;
}

function percentage(value: number, total: number) {
  return total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0;
}
