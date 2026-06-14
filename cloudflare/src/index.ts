/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
// npx wrangler deploy
import { getLeetCodeStats } from "./services/leetcode";
import { getGithubStats } from "./services/github";

interface LoadResult {
  data: unknown;
  status: number;
}

/**
 * Parses data into JSON with JSON content and their respective headers.
 * @param data data body
 * @param status status code
 * @param origin origin of the resource
 * @returns a response JSON
 */
function json(data: unknown, status = 200, origin = '*') {
  return new Response(JSON.stringify(data), { // actual data
    status,
    headers: {
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': origin, 
      'Access-Control-Allow-Methods': 'GET, OPTIONS', 
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

/**
 * Creates a plain text response with correct UTF-8 headers.
 * @param data The text content to send
 * @param status The HTTP status code (defaults to 200)
 * @returns A plain text Response object
 */
function text(data: any, status = 200) {
  return new Response(data, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}

/**
 * Handles and returns valid methods for OPTIONS requests.
 * @param request request body
 * @param env enviornment file for allowed origins
 * @returns a response JSON
 */
function handleOptions(request: Request, env: Env) {
  const allowedOrigin = getCorsOrigin(env);

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

/**
 * Determines if origin of request is valid.
 * @param request request body
 * @param env enviornment file for allowed origins
 * @returns boolean: if request origin is in the env origin file
 */
function isAllowedOrigin(request: Request, env: Env) {
  const reqOrigin = request.headers.get('Origin');
  const allowedOrigin = env.ORIGIN;

  if (!allowedOrigin) {
    return false;
  }

  if (allowedOrigin === '*') {
    return true;
  }

  return reqOrigin?.trim() === allowedOrigin.trim();
}

/**
 * Gets the CORS origin from the env variable.
 * @param env enviornment file for allowed origins
 * @returns the valid origins from the env file
 */
function getCorsOrigin(env: Env) {
  return env.ORIGIN ?? '*';
}

/**
 * Handles valid JSON responses and caches them.
 * @param request request body
 * @param ctx execution context
 * @param ttl time to live for the cached response
 * @param loadFunc function to execute for caching
 * @returns json response
 */
async function cachedJson(request: Request, ctx: ExecutionContext, ttl: number, allowedOrigin: string, loadFunc: () => Promise<LoadResult>) {
  const cacheUrl = new URL(request.url);
  const cacheKey = new Request(cacheUrl.toString(), {method: 'GET'}); // only get methods can be cached

  const cache = caches.default; // default cache API
  const cached = await cache.match(cacheKey);

  if (cached) {
    console.log(`Cache hit for: ${request.url}.`);
    return cached;
  }

  const { data, status } = await loadFunc();
  const response = json(data, status, allowedOrigin);
  response.headers.set('Cache-Control', `public, s-maxage=${ttl}`);

  if (response.ok) {
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  }
  
  return response;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
    const allowedOrigin = getCorsOrigin(env);
    const isAllowed = isAllowedOrigin(request, env);

    // for ai dudes
    if (url.pathname === '/robots.txt') {
      return text('User-agent: *\nDisallow: /\n')
    }

    // preflight request
    if (request.method === 'OPTIONS') {
      if (!isAllowed) {
        return json({error: 'Forbidden'}, 403, allowedOrigin);
      }

      return handleOptions(request, env);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const { success } = await env.PORTFOLIO_LIMITER.limit({key: `${ip}:${url.pathname}`});

    if (!success) {
      return json({error: `Rate limit exceeded for ${url.pathname}`}, 429, allowedOrigin)
    }

    const TTL_TIME = 3600;
    // routes
    if (request.method === 'GET') {
      try {
        /**
         * structure for returning JSON responses:
         *  - make a custom const async function for fetching data
         *  - return it using custom json header for less repeating headers
         *  - use that custom const async function as parameter to the cachedJson function for caching
         */
        if (url.pathname === '/api/db/projects') {
          const loadProjects = async () => {
            const { results } = await env.portfolio_db
              .prepare('SELECT p.project_name, p.project_description, p.project_github, p.project_img_url, pa.pArticle_slug FROM Projects AS p LEFT JOIN ProjectArticles AS pa ON pa.project_name = p.project_name')
              .run();
            return { 
              data: { results },
              status: 200
            };
          }

          return cachedJson(request, ctx, TTL_TIME, allowedOrigin, loadProjects);
        }

        if (url.pathname === '/api/db/certificates') {
          const loadCertificates = async () => {
            const { results: certificates } = await env.portfolio_db // relabel as certificates for results
            .prepare('SELECT * FROM Certificates')
            .run();

            return { 
              data: { certificates },
              status: 200
            };
          }

          return cachedJson(request, ctx, TTL_TIME, allowedOrigin, loadCertificates);
        }

        if (url.pathname === '/api/db/tags') {
          const loadTags = async () => {
            const { results: tags } = await env.portfolio_db
            .prepare('SELECT * FROM Tag')
            .run();

            return { 
              data: { tags },
              status: 200
            };
          }
          return cachedJson(request, ctx, TTL_TIME, allowedOrigin, loadTags)
        }

        if (url.pathname === '/api/db/work') {
          const loadWork = async () => {
            const { results } = await env.portfolio_db
              .prepare('SELECT * FROM WorkExperience')
              .run();

            return { 
              data: { results },
              status: 200
            };
          }

          return cachedJson(request, ctx, TTL_TIME, allowedOrigin, loadWork);
        }

        if (url.pathname.startsWith('/api/project_articles/')) {
          const loadProjectArticles = async () => {
            const slug = url.pathname.replace('/api/project_articles/', '');

            const { results } = await env.portfolio_db
              .prepare('SELECT pa.pArticle_title, pArticle_image_url, pa.pArticle_slug, pa.pArticle_content, p.project_github FROM ProjectArticles AS pa JOIN Projects AS p ON pa.project_name = p.project_name WHERE pa.pArticle_slug = ?')
              .bind(slug)
              .run();

            const { results: tags }= await env.portfolio_db
              .prepare('SELECT t.tag_name FROM ProjectArticles pa JOIN ProjectTag pt ON pa.project_name = pt.project_name JOIN Tag t ON pt.tag_name = t.tag_name WHERE pa.pArticle_slug = ?')
              .bind(slug)
              .run();

            if (results.length === 0) {
              return {
                data: { error: 'Article not found' },
                status: 404
              }
            }

            if (tags.length === 0) {
              return {
                data: { error: 'Tags not found' },
                status: 404
              };
            }

            return { 
              data: { results, tags },
              status: 200
            };
          }

          return cachedJson(request, ctx, TTL_TIME, allowedOrigin, loadProjectArticles);
        }

        if (url.pathname.startsWith('/api/work_articles/')) {
          const loadWorkArticles = async () => {
            const slug = url.pathname.replace('/api/work_articles/', '');

            const { results } = await env.portfolio_db
              .prepare('SELECT wa.article_title, wa.article_summary, wa.article_content, wa.article_image_url, wa.responsibilities, wa.achievements, we.company_name, we.role_title, we.company_website FROM WorkArticle AS wa JOIN WorkExperience AS we ON wa.work_id = we.work_id WHERE we.work_slug = ?')
              .bind(slug)
              .run();

            const { results: tags }= await env.portfolio_db
              .prepare('SELECT t.tag_name FROM WorkArticle AS wa JOIN WorkTag wt ON wa.work_id = wt.work_id JOIN Tag t ON wt.tag_name = t.tag_name JOIN WorkExperience AS we ON wa.work_id = we.work_id WHERE we.work_slug = ?')
              .bind(slug)
              .run();

            if (results.length === 0) {
              return {
                data: { error: 'Article not found' },
                status: 404
              }
            }

            if (tags.length === 0) {
              return {
                data: { error: 'Tags not found' },
                status: 404
              };
            }

            return { 
              data: { results, tags },
              status: 200
            };
          }

          return cachedJson(request, ctx, TTL_TIME, allowedOrigin, loadWorkArticles);
        }

        if (url.pathname.startsWith('/api/leetcode/')) {
          const loadLeetcode = async () => {
            const username = url.pathname.replace('/api/leetcode/', '');
            if (!username) {
              return {
                data: { error: 'Username is required' },
                status: 400
              };
            }

            const leetcodeStats = await getLeetCodeStats(username);
            if (!leetcodeStats) {
              return {
                data: { error: 'LeetCode user not found' },
                status: 404
              };
            }

            return { 
              data: { leetcodeStats },
              status: 200
            }
          }

          return cachedJson(request, ctx, TTL_TIME, allowedOrigin, loadLeetcode);
        }

        if (url.pathname.startsWith('/api/github/')) {
          const loadGithub = async () => {
            const username = url.pathname.replace('/api/github/', '');
            if (!username) {
              return {
                data: { error: 'Username is required' },
                status: 400
              };
            }

            const githubStats = await getGithubStats(username, env);
            if (!githubStats) {
              return {
                data: { error: 'Github user not found' },
                status: 404
              };
            }

            return { 
              data: { githubStats },
              status: 200
            }
          }

          return cachedJson(request, ctx, TTL_TIME, allowedOrigin, loadGithub);
        }

        return json({error: 'End point does not exist'}, 404, allowedOrigin)
      } catch(error) {

        return json({
          error: error instanceof Error ? error.message : "Unknown error",
        }, 500, allowedOrigin);
      }
    } else {
      return json({error: 'Forbidden Request'}, 405, allowedOrigin);
    }
	},
} satisfies ExportedHandler<Env>;
