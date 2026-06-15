interface GithubResponse {
  data?: {
    user: {
      name: string | null;
      login: string;
      status: {
        message: string;
        emoji: string;
      } | null;
      contributionsCollection: {
        totalCommitContributions: number;
        restrictedContributionsCount: number;
      };
      repositories: {
        nodes: Array<{
          name: string;
          description: string | null;
          url: string;
          isPrivate: boolean;
          stargazerCount: number;
        } | null>;
        pageInfo: { // for pagination
          endCursor: string | null;
          hasNextPage: boolean;
        };
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}

const GITHUB_API = 'https://api.github.com/graphql';

const query = `
  query UserRepositories($login: String!, $fromYear: DateTime, $toYear: DateTime) {
    user(login: $login) {
      name
      login
      status {
        message
        emoji
      }
      contributionsCollection(from: $fromYear, to: $toYear) {
        totalCommitContributions
        restrictedContributionsCount
      }
      repositories(
        first: 10
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        nodes {
          name
          description
          url
          isPrivate
          stargazerCount
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export async function getGithubStats(username: string, env: Env, fromDate: string, toDate: string) {
  const response = await fetch(GITHUB_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-website'
    },
    body: JSON.stringify({
      query,
      variables: {
        login: username,
        fromYear: fromDate,
        toYear: toDate,
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();

    throw new Error(`GitHub returned ${response.status}: ${details}`);
  }

  const body = await response.json<GithubResponse>();

  if (body.errors?.length) {
    const message = body.errors[0].message;

    if (message.includes('Could not resolve to a User')) {
      return null;
    }

    throw new Error(message);
  }

  const user = body.data?.user;

  if (!user) {
    return null;
  }

  const { name, login, status, contributionsCollection, repositories } = user;

  return {
    name,
    login,
    status: status ? {
      message: status.message,
      emoji: status.emoji,
    } : null,
    contributions: {
      commits: contributionsCollection.totalCommitContributions,
      restricted: contributionsCollection.restrictedContributionsCount,
    },
    // map repos
    repositories: repositories.nodes
      .filter((repository) => repository !== null)
      .map((repository) => ({
        name: repository.name,
        description: repository.description,
        url: repository.url,
        isPrivate: repository.isPrivate,
        stars: repository.stargazerCount,
      })),
  };
}
