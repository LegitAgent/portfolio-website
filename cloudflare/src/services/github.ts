interface GithubLanguageEdge {
  size: number;
  node: {
    name: string;
    color: string | null;
  };
}

interface GithubResponse {
  data?: {
    user: {
      name: string | null;
      login: string;
      bio: string | null;
      avatarUrl: string;
      status: {
        message: string;
        emoji: string;
      } | null;
      contributionsCollection: {
        totalCommitContributions: number;
      };
      followers: {
        totalCount: number;
      };
      repositories: {
        totalCount: number;
        nodes: Array<{
          name: string;
          description: string | null;
          url: string;
          stargazerCount: number;
          forkCount: number;
          isArchived: boolean;
          createdAt: string;
          pushedAt: string | null;
          primaryLanguage: {
            name: string;
            color: string | null;
          } | null;
          languages: {
            edges: GithubLanguageEdge[];
          } | null;
        } | null>;
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}

const GITHUB_API = 'https://api.github.com/graphql';
const UPSTREAM_TIMEOUT_MS = 5_000;

const query = `
  query UserDeveloperStats($login: String!, $fromYear: DateTime, $toYear: DateTime) {
    user(login: $login) {
      name
      login
      bio
      avatarUrl
      status {
        message
        emoji
      }
      contributionsCollection(from: $fromYear, to: $toYear) {
        totalCommitContributions
      }
      followers {
        totalCount
      }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        privacy: PUBLIC
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          description
          url
          stargazerCount
          forkCount
          isArchived
          createdAt
          pushedAt
          primaryLanguage {
            name
            color
          }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

export async function getGithubStats(username: string, env: Env, fromDate: string, toDate: string) {
  let response: Response;

  try {
    response = await fetch(GITHUB_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-website',
      },
      body: JSON.stringify({
        query,
        variables: {
          login: username,
          fromYear: fromDate,
          toYear: toDate,
        },
      }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      throw new Error(`GitHub request timed out after ${UPSTREAM_TIMEOUT_MS}ms`, { cause: error });
    }

    throw error;
  }

  if (response.status === 404) {
    return null;
  }

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

  const repositories = user.repositories.nodes.filter((repository) => repository !== null);
  const languageTotals = new Map<string, { color: string | null; size: number }>();

  repositories.forEach((repository) => {
    repository.languages?.edges.forEach((edge) => {
      const existing = languageTotals.get(edge.node.name);
      languageTotals.set(edge.node.name, {
        color: edge.node.color,
        size: (existing?.size ?? 0) + edge.size,
      });
    });
  });

  const totalLanguageSize = [...languageTotals.values()]
    .reduce((total, language) => total + language.size, 0);
  const languages = [...languageTotals.entries()]
    .map(([name, language]) => ({
      name,
      color: language.color,
      size: language.size,
      percentage: totalLanguageSize > 0
        ? Number(((language.size / totalLanguageSize) * 100).toFixed(1))
        : 0,
    }))
    .sort((first, second) => second.size - first.size);

  const contributions = user.contributionsCollection;

  return {
    name: user.name,
    login: user.login,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    status: user.status,
    followers: user.followers.totalCount,
    contributions: {
      commits: contributions.totalCommitContributions,
    },
    repositorySummary: {
      totalRepositories: user.repositories.totalCount,
      totalStars: repositories.reduce((total, repository) => total + repository.stargazerCount, 0),
      totalForks: repositories.reduce((total, repository) => total + repository.forkCount, 0),
    },
    languages,
    repositories: repositories.slice(0, 10).map((repository) => ({
      name: repository.name,
      description: repository.description,
      url: repository.url,
      stars: repository.stargazerCount,
      forks: repository.forkCount,
      isArchived: repository.isArchived,
      createdAt: repository.createdAt,
      pushedAt: repository.pushedAt,
      primaryLanguage: repository.primaryLanguage,
    })),
  };
}
