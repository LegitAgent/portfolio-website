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
import { getLeetCodeStats } from './services/leetcode';
import { getGithubStats } from './services/github';

interface LoadResult {
  data: unknown;
  status: number;
}

const TESTING = true;

/**
 * Parses data into JSON with JSON content and their respective headers.
 * @param data data body
 * @param status status code
 * @param origin origin of the resource
 * @returns a response JSON
 */
function json(data: unknown, status = 200, origin = '*', extraHeaders: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), { // actual data
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8', 
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': origin, 
      'Referrer-Policy': 'no-referrer',
      'Access-Control-Allow-Methods': 'GET, OPTIONS', 
      'Access-Control-Allow-Headers': 'Content-Type',
      ...extraHeaders
    }
  });
}

/**
 * Creates a plain text response with correct UTF-8 headers.
 * @param data The text content to send
 * @param status The HTTP status code (defaults to 200)
 * @returns A plain text Response object
 */
function text(data: string, status = 200): Response {
  return new Response(data, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}

/**
 * Handles and returns valid methods for OPTIONS requests.
 * @param env enviornment file for allowed origins
 * @returns a response JSON
 */
function handleOptions(env: Env): Response {
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
function isAllowedOrigin(request: Request, env: Env): boolean {
  const reqOrigin = request.headers.get('Origin');
  const allowedOrigin = env.ORIGIN;

  if (!reqOrigin) {
    return true;
  }

  if (!allowedOrigin) {
    return false;
  }

  if (allowedOrigin === '*') {
    return true;
  }

  return reqOrigin.trim() === allowedOrigin.trim();
}

/**
 * Gets the CORS origin from the env variable.
 * @param env enviornment file for allowed origins
 * @returns the valid origins from the env file
 */
function getCorsOrigin(env: Env): string {
  return env.ORIGIN ?? '*';
}

// for dynamic routes, limit those
function getRateLimitBucket(pathname: string): string {
  if (pathname.startsWith('/api/db/project_articles/')) return '/api/db/project_articles';
  if (pathname.startsWith('/api/db/work_articles/')) return '/api/db/work_articles';
  
  return pathname;
}

function checkParamSlug(pathname: string, prefix: string): string | null {
  let slug;

  try {
    slug = decodeURIComponent(pathname.slice(prefix.length));
  } catch {
    return null;
  }

  // no % or / or .
  if (slug.length > 100 || !/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(slug)) {
    return null;
  }

  return slug;
}

/**
 * Handles valid JSON responses and caches them.
 * @param request request body
 * @param ctx execution context
 * @param ttl time to live for the cached response
 * @param loadFunc function to execute for caching
 * @returns json response
 */
async function cachedJson(
  request: Request,
  ctx: ExecutionContext,
  ttl: number,
  allowedOrigin: string,
  loadFunc: () => Promise<LoadResult>,
  notFoundTtl = 0,
): Promise<Response> {
  const cacheUrl = new URL(request.url);
  cacheUrl.search = '';
  const cacheKey = new Request(cacheUrl.toString(), {method: 'GET'}); // only get methods can be cached

  const cache = caches.default; // default cache API
  const cached = await cache.match(cacheKey);

  if (cached) {
    const response = new Response(cached.body, cached);
    response.headers.set('X-Cache-Status', 'HIT');
    return response;
  }

  const { data, status } = await loadFunc();
  const response = json(data, status, allowedOrigin, {
    'Cache-Control': status === 200
      ? `public, max-age=60, s-maxage=${ttl}`
      : status === 404 && notFoundTtl > 0
        ? `public, max-age=0, s-maxage=${notFoundTtl}`
        : 'no-store',
    'X-Cache-Status': 'MISS',
  });
  // pull from browser cache first 60s, shared caches may cache for the route specific TTL

  if (status === 200 && ttl > 0) {
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  } else if (status === 404 && notFoundTtl > 0) {
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  }
  
  return response;
}

const ONE_HOUR = 60*60;
const ONE_DAY = ONE_HOUR*24;
const TTL_TIME = {
  PROJECTS: ONE_HOUR * 2,
  CERTIFICATES: ONE_DAY / 4,
  TAGS: ONE_DAY / 4,
  WORK: ONE_DAY / 2,
  ARTICLE: ONE_DAY / 4,
  PORTFOLIO_STATS: ONE_HOUR,
  LEETCODE: ONE_HOUR,
  GITHUB: ONE_HOUR,
  ARTICLE_NOT_FOUND: 30,
  TESTING: 0,
} as const;

const VALID_PATHS = new Set([
  '/api/db/projects',
  '/api/db/certificates',
  '/api/db/tags',
  '/api/db/work',
  '/api/stats/portfolio',
  '/api/leetcode',
  '/api/github',
]);

function isKnownRoute(pathname: string): boolean {
  return VALID_PATHS.has(pathname)
    || pathname.startsWith('/api/db/project_articles/')
    || pathname.startsWith('/api/db/work_articles/');
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
    const allowedOrigin = getCorsOrigin(env);
    const isAllowed = isAllowedOrigin(request, env);

    // for ai dudes
    if (request.method === 'GET' && url.pathname === '/robots.txt') {
      return text('User-agent: *\nDisallow: /\n')
    }

    // preflight request
    if (request.method === 'OPTIONS') {
      if (!isAllowed) {
        return json({error: 'Forbidden'}, 403, allowedOrigin, {'Cache-Control': 'no-store'});
      }

      return handleOptions(env);
    }

    if (!isAllowed) {
      return json({ error: 'Forbidden' }, 403, allowedOrigin, {'Cache-Control': 'no-store'});
    }
    // routes
    if (request.method === 'GET') {
      try {
        if (!isKnownRoute(url.pathname)) {
          return json(
            {error: 'Endpoint does not exist'},
            404,
            allowedOrigin,
            {'Cache-Control': 'no-store'},
          );
        }

        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const urlBucket = getRateLimitBucket(url.pathname);
        const { success } = await env.PORTFOLIO_LIMITER.limit({key: `${ip}:${urlBucket}`});

        if (!success) {
          return json(
            {error: `Too many requests for ${url.pathname}`},
            429,
            allowedOrigin,
            {
              'Retry-After': '60',
              'Cache-Control': 'no-store',
            },
          );
        }
        /**
         * structure for returning JSON responses:
         *  - make a custom const async function for fetching data
         *  - return it using custom json header for less repeating headers
         *  - use that custom const async function as parameter to the cachedJson function for caching
         */
        if (url.pathname === '/api/db/projects') {
          const loadProjects = async () => {
            const { results } = await env.portfolio_db
              .prepare("SELECT p.project_name, p.project_description, p.project_github, p.project_img_url, p.featured, p.started_at, p.ended_at, p.live_url, p.status, pa.pArticle_slug FROM Projects AS p LEFT JOIN ProjectArticles AS pa ON pa.project_name = p.project_name ORDER BY p.featured DESC, CASE p.status WHEN 'Done' THEN 1 WHEN 'WIP' THEN 2 WHEN 'Draft' THEN 3 WHEN 'Review' THEN 4 ELSE 5 END, p.started_at DESC")
              .run();
            return { 
              data: { results },
              status: 200
            };
          }

          const TTL = TESTING ? TTL_TIME.TESTING : TTL_TIME.PROJECTS;

          return cachedJson(request, ctx, TTL, allowedOrigin, loadProjects);
        }

        if (url.pathname === '/api/db/certificates') {
          const loadCertificates = async () => {
            const { results: certificates } = await env.portfolio_db // relabel as certificates for results
            .prepare('SELECT id, title, issuer, completion_date, credential_url, certificate_url, image_alt, skills, image_url, description FROM Certificates ORDER BY completion_date DESC')
            .run();

            const certificatesWithTags = certificates.map((values) => {
              const certificate = values as CertificateRow;
              return {
                ...certificate,
                skills: JSON.parse(certificate.skills),
              };
            });

            return { 
              data: { certificates: certificatesWithTags },
              status: 200
            };
          }

          const TTL = TESTING ? TTL_TIME.TESTING : TTL_TIME.CERTIFICATES;

          return cachedJson(request, ctx, TTL, allowedOrigin, loadCertificates);
        }

        if (url.pathname === '/api/db/tags') {
          const loadTags = async () => {
            const { results: tags } = await env.portfolio_db
            .prepare('SELECT tag_name, skill_type FROM Tag ORDER BY tag_name ASC')
            .run();

            return { 
              data: { tags },
              status: 200
            };
          }
          const TTL = TESTING ? TTL_TIME.TESTING : TTL_TIME.TAGS;

          return cachedJson(request, ctx, TTL, allowedOrigin, loadTags)
        }

        if (url.pathname === '/api/db/work') {
          const loadWork = async () => {
            const { results } = await env.portfolio_db
              .prepare('SELECT work_id, company_name, role_title, employment_type, location, start_date, end_date, is_current, short_description, company_logo_url, company_website, display_order, work_slug, type FROM WorkExperience ORDER BY display_order ASC, is_current DESC, start_date DESC')
              .run();

            return { 
              data: { results },
              status: 200
            };
          }

          const TTL = TESTING ? TTL_TIME.TESTING : TTL_TIME.WORK;

          return cachedJson(request, ctx, TTL, allowedOrigin, loadWork);
        }

        if (url.pathname.startsWith('/api/db/project_articles/')) {
          const loadProjectArticles = async () => {
            const slug = checkParamSlug(url.pathname, '/api/db/project_articles/');

            if (!slug) {
              return {
                data: { error: 'Slug not valid' },
                status: 400
              }
            }

            const articleQuery = env.portfolio_db
              .prepare('SELECT pa.project_name, pa.pArticle_slug, pa.pArticle_image_url, pa.pArticle_image_alt, pa.pArticle_summary, pa.pArticle_overview, pa.pArticle_content, pa.pArticle_challenges, pa.pArticle_lessons, pa.pArticle_future_work, p.project_github, p.started_at, p.live_url, p.status, p.featured, ib.images, ib.r2_url FROM ProjectArticles AS pa JOIN Projects AS p ON pa.project_name = p.project_name LEFT JOIN ImageBuckets AS ib ON pa.r2_url = ib.r2_url WHERE pa.pArticle_slug = ?')
              .bind(slug)

            const articleTagQuery = env.portfolio_db
              .prepare('SELECT t.tag_name FROM ProjectArticles AS pa JOIN ProjectTag AS pt ON pa.project_name = pt.project_name JOIN Tag AS t ON pt.tag_name = t.tag_name WHERE pa.pArticle_slug = ? ORDER BY t.tag_name ASC')
              .bind(slug)

            const [articleContent, articleTagContent] = await env.portfolio_db.batch([articleQuery, articleTagQuery]);

            const article = articleContent.results[0] as ArticleRow;
            if (!article) {
              return {
                data: { error: 'Article not found' },
                status: 404
              }
            }
            
            if (!article.images) {
              return {
                data: { error: 'Images not found' },
                status: 404
              }
            }
            
            const articleWithImages = {
              ...article,
              images: JSON.parse(article.images),
            };

            return { 
              data: { article: articleWithImages, tags: articleTagContent.results },
              status: 200
            };
          }

          const TTL = TESTING ? TTL_TIME.TESTING : TTL_TIME.ARTICLE;
          const notFoundTTL = TESTING ? TTL_TIME.TESTING : TTL_TIME.ARTICLE_NOT_FOUND;

          return cachedJson(request, ctx, TTL, allowedOrigin, loadProjectArticles, notFoundTTL);
        }

        if (url.pathname.startsWith('/api/db/work_articles/')) {
          const loadWorkArticles = async () => {
            const slug = checkParamSlug(url.pathname, '/api/db/work_articles/');

            if (!slug) {
              return {
                data: { error: 'Slug not valid' },
                status: 400
              }
            }

            const articleQuery = env.portfolio_db
              .prepare('SELECT wa.article_title, wa.article_summary, wa.article_content, wa.article_image_url, wa.responsibilities, wa.achievements, we.company_name, we.role_title, we.employment_type, we.location, we.start_date, we.end_date, we.is_current, we.company_website, we.work_slug, ib.r2_url, ib.images FROM WorkArticle AS wa LEFT JOIN WorkExperience AS we ON wa.work_id = we.work_id LEFT JOIN ImageBuckets AS ib ON ib.r2_url = wa.r2_url WHERE we.work_slug = ?')
              .bind(slug);

            const articleTagQuery = env.portfolio_db
              .prepare('SELECT t.tag_name FROM WorkArticle AS wa JOIN WorkTag AS wt ON wa.work_id = wt.work_id JOIN Tag AS t ON wt.tag_name = t.tag_name JOIN WorkExperience AS we ON wa.work_id = we.work_id WHERE we.work_slug = ? ORDER BY t.tag_name ASC')
              .bind(slug)

            const [articleContent, articleTagContent] = await env.portfolio_db.batch([articleQuery, articleTagQuery]);
            const article = articleContent.results[0] as ArticleRow;

            if (!article) {
              return {
                data: { error: 'Article not found' },
                status: 404
              }
            }

            if (!article.images) {
              return {
                data: { error: 'Images not found' },
                status: 404
              }
            }

            const articleWithImages = {
              ...article,
              images: JSON.parse(article.images),
            };

            return { 
              data: { article: articleWithImages, tags: articleTagContent.results },
              status: 200
            };
          }

          const TTL = TESTING ? TTL_TIME.TESTING : TTL_TIME.ARTICLE;
          const notFoundTTL = TESTING ? TTL_TIME.TESTING : TTL_TIME.ARTICLE_NOT_FOUND;

          return cachedJson(request, ctx, TTL, allowedOrigin, loadWorkArticles, notFoundTTL);
        }

        if (url.pathname === '/api/stats/portfolio') {
          const loadPortfolioStats = async () => {
            const statements = [
              env.portfolio_db.prepare('SELECT COUNT(*) AS count FROM Projects'),
              env.portfolio_db.prepare("SELECT COUNT(*) AS count FROM Projects WHERE status = 'Done'"),
              env.portfolio_db.prepare('SELECT COUNT(*) AS count FROM Tag'),
              env.portfolio_db.prepare('SELECT COUNT(*) AS count FROM Certificates'),
              env.portfolio_db.prepare('SELECT COUNT(*) AS count FROM WorkExperience'),
              env.portfolio_db.prepare('SELECT COUNT(*) AS count FROM WorkExperience WHERE is_current = 1'),
              env.portfolio_db.prepare('SELECT tag_name AS name, COUNT(*) AS projectCount FROM ProjectTag GROUP BY tag_name ORDER BY projectCount DESC, tag_name ASC LIMIT 8'),
              env.portfolio_db.prepare('SELECT status, COUNT(*) AS count FROM Projects GROUP BY status ORDER BY count DESC, status ASC'),
            ];

            const [
              totalProjectsResult,
              completedProjectsResult,
              totalTechnologiesResult,
              totalCertificatesResult,
              totalWorkExperiencesResult,
              currentRolesResult,
              mostUsedTechnologiesResult,
              projectsByStatusResult,
            ] = await env.portfolio_db.batch<PortfolioStatsRow>(statements);

            return {
              data: {
                portfolioStats: {
                  totalProjects: getBatchCount(totalProjectsResult),
                  completedProjects: getBatchCount(completedProjectsResult),
                  totalTechnologies: getBatchCount(totalTechnologiesResult),
                  totalCertificates: getBatchCount(totalCertificatesResult),
                  totalWorkExperiences: getBatchCount(totalWorkExperiencesResult),
                  currentRoles: getBatchCount(currentRolesResult),
                  mostUsedTechnologies: mostUsedTechnologiesResult.results,
                  projectsByStatus: projectsByStatusResult.results,
                },
              },
              status: 200,
            };
          };

          const TTL = TESTING ? TTL_TIME.TESTING : TTL_TIME.PORTFOLIO_STATS;

          return cachedJson(request, ctx, TTL, allowedOrigin, loadPortfolioStats);
        }

        if (url.pathname === '/api/leetcode') {
          const loadLeetcode = async () => {
            const leetcodeStats = await getLeetCodeStats(env.LEETCODE_NAME);
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

          const TTL = TESTING ? TTL_TIME.TESTING : TTL_TIME.LEETCODE;

          return cachedJson(request, ctx, TTL, allowedOrigin, loadLeetcode);
        }

        if (url.pathname === '/api/github') {
          const loadGithub = async () => {
            const fromDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(); // new date - 1 year
            const toDate = new Date().toISOString();
            const githubStats = await getGithubStats(env.GITHUB_NAME, env, fromDate, toDate);
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

          const TTL = TESTING ? TTL_TIME.TESTING : TTL_TIME.GITHUB;

          return cachedJson(request, ctx, TTL, allowedOrigin, loadGithub);
        }

        return json(
          {error: 'Endpoint does not exist'},
          404,
          allowedOrigin,
          {'Cache-Control': 'no-store'},
        );
      } catch {

		return json({error: 'Internal server error'}, 500, allowedOrigin, {'Cache-Control': 'no-store'});
      }
    } else {
      return json(
        {error: 'Method not allowed'},
        405,
        allowedOrigin,
        {
          'Allow': 'GET, OPTIONS',
          'Cache-Control': 'no-store',
        },
      );
    }
	},
} satisfies ExportedHandler<Env>;

interface PortfolioStatsRow {
  count?: number;
  name?: string;
  projectCount?: number;
  status?: string;
}

interface ArticleRow extends Record<string, string> {
  images: string;
}

interface CertificateRow extends Record<string, string> {
  skills: string;
}

function getBatchCount(result: D1Result<PortfolioStatsRow>): number {
  return result.results[0]?.count ?? 0;
}
