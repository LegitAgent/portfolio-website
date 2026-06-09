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
    throw new Error(`LeetCode returned ${response.status}`);
  }

  // data area of the leetcode response
  const body = await response.json<{
    data?: {
      allQuestionsCount: Array<{
        difficulty: string,
        count: number
      }>;
      matchedUser: {
        username: string;
        submitStats: {
          acSubmissionNum: Array<{
            difficulty: string;
            count: number;
          }>;
        };
      } | null;
    };
    errors?: Array<{ message: string }>;
  }>();

  if (body.errors?.length) {
    throw new Error(body.errors[0].message);
  }

  if (!body.data?.matchedUser) {
    return null;
  }

  const submissions = body.data.matchedUser.submitStats.acSubmissionNum;
  const totalProblems = body.data.allQuestionsCount;

  // Leetcode response object
  return {
    username: body.data.matchedUser.username,
    totalSolved: findCount(submissions, 'All'),
    totalProblems: findCount(totalProblems, 'All'),

    easySolved: findCount(submissions, 'Easy'),
    totalEasy: findCount(totalProblems, 'Easy'),

    mediumSolved: findCount(submissions, 'Medium'),
    totalMedium: findCount(totalProblems, 'Medium'),

    hardSolved: findCount(submissions, 'Hard'),
    totalHard: findCount(totalProblems, 'Hard'),
  };
}

function findCount(submissions: Array<{ difficulty: string; count: number }>, difficulty: string) {
  return submissions.find((item) => item.difficulty === difficulty)?.count ?? 0;
}