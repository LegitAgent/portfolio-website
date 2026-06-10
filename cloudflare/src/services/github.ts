interface GithubResponse {
  data?: {
    user: {
      name: string | null;
      login: string;
      repositories: {
        nodes: Array<{
          name: string;
          description: string | null;
          url: string;
          isPrivate: boolean;
          stargazerCount: number;
        } | null>;
        pageInfo: {
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
  query UserRepositories($login: String!) {
    user(login: $login) {
      name
      login
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

export async function getGithubStats(username: string, env: Env) {
  const response = await fetch(GITHUB_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-website'
    },
    body: JSON.stringify({
      query,
      variables: { login: username },
    }),
  });

  if (!response.ok) {
    const details = await response.text();

    throw new Error(`GitHub returned ${response.status}: ${details}`);
  }

  const body = await response.json<GithubResponse>();

  if (body.errors?.length) {
    throw new Error(body.errors[0].message);
  }

  return body;
}