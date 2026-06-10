interface DifficultyCount {
  difficulty: string;
  count: number;
}

interface SkillCount {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

interface LeetcodeResponse {
  data?: {
    allQuestionsCount: Array<DifficultyCount>;
    matchedUser: {
      username: string;
      submitStats: {
        acSubmissionNum: Array<DifficultyCount>;
      };
      tagProblemCounts: {
        advanced: Array<SkillCount>;
        intermediate: Array<SkillCount>;
        fundamental: Array<SkillCount>;
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}

const LEETCODE_API = 'https://leetcode.com/graphql';

// for more information: https://leetcode.com/discuss/post/1297705/is-there-public-api-endpoints-available-h0661/

const query = `
  query userSessionProgress($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      username
      submitStats {
        acSubmissionNum {
          difficulty
          count
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

// appends the necessary JSON headers and custom variables to custom query
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

  // data area of the leetcode response
  const body = await response.json<LeetcodeResponse>();

  if (body.errors?.length) {
    throw new Error(body.errors[0].message);
  }

  if (!body?.data?.matchedUser) {
    return null;
  }

  const submissions = body.data?.matchedUser.submitStats.acSubmissionNum;
  const totalProblems = body.data?.allQuestionsCount;
  const tagProblems = body.data?.matchedUser.tagProblemCounts;

  // Leetcode response object
  return {
    username: body.data?.matchedUser.username,
    totalSolved: findCount(submissions, 'All'),
    totalProblems: findCount(totalProblems, 'All'),

    easySolved: findCount(submissions, 'Easy'),
    totalEasy: findCount(totalProblems, 'Easy'),

    mediumSolved: findCount(submissions, 'Medium'),
    totalMedium: findCount(totalProblems, 'Medium'),

    hardSolved: findCount(submissions, 'Hard'),
    totalHard: findCount(totalProblems, 'Hard'),

    fundamentalSkills: tagProblems.fundamental,
    intermediateSkills: tagProblems.intermediate,
    advancedSkills: tagProblems.advanced,
  };
}

function findCount(submissions: Array<{ difficulty: string; count: number }>, difficulty: string) {
  return submissions.find((item) => item.difficulty === difficulty)?.count ?? 0;
}