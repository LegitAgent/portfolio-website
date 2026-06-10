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
import { stat } from "node:fs";

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

function text(data: any, status = 200) {
  return new Response(data, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}

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

function getCorsOrigin(env: Env) {
  return env.ORIGIN ?? '*';
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

    try {
      if (url.pathname === '/api/db/projects') {
        const { results } = await env.portfolio_db
          .prepare('SELECT p.project_name, p.project_description, p.project_github, p.project_img_url, pa.pArticle_slug FROM Projects AS p LEFT JOIN ProjectArticles AS pa ON pa.project_name = p.project_name')
          .run();

        return json({results}, 200, allowedOrigin);
      }

      if (url.pathname === '/api/db/certificates') {
        const { results: certificates } = await env.portfolio_db // relabel as certificates for results
        .prepare('SELECT * FROM Certificates')
        .run();

        return json({certificates}, 200, allowedOrigin);
      }

      if (url.pathname === '/api/db/tags') {
        const { results: tags } = await env.portfolio_db
        .prepare('SELECT * FROM Tag')
        .run();

        return json({tags}, 200, allowedOrigin);
      }

      if (url.pathname === '/api/db/work') {
        const { results } = await env.portfolio_db
          .prepare('SELECT * FROM WorkExperience')
          .run();

        return json({results}, 200, allowedOrigin);
      }

      if (url.pathname.startsWith('/api/project_articles/')) {
        const slug = url.pathname.replace('/api/project_articles/', '');

        const { results } = await env.portfolio_db
          .prepare('SELECT pa.pArticle_title, pArticle_image_url, pa.pArticle_slug, pa.pArticle_content, p.project_github FROM ProjectArticles AS pa JOIN Projects AS p ON pa.project_name = p.project_name WHERE pa.pArticle_slug = ?')
          .bind(slug)
          .run();

        const { results: tags }= await env.portfolio_db
          .prepare('SELECT t.tag_name FROM ProjectArticles pa JOIN ProjectTag pt ON pa.project_name = pt.project_name JOIN Tag t ON pt.tag_name = t.tag_name WHERE pa.pArticle_slug = ?')
          .bind(slug)
          .run();

        if (!results) {
          return json({ error: 'Article not found' }, 404, allowedOrigin);
        }

        if (!tags) {
          return json({ error: 'Tags not found'}, 404, allowedOrigin);
        }

        return json({results, tags}, 200, allowedOrigin);
      }

      if (url.pathname.startsWith('/api/work_articles/')) {
        const slug = url.pathname.replace('/api/work_articles/', '');

        const { results } = await env.portfolio_db
          .prepare('SELECT wa.article_title, wa.article_summary, wa.article_content, wa.article_image_url, wa.responsibilities, wa.achievements, we.company_name, we.role_title, we.company_website FROM WorkArticle AS wa JOIN WorkExperience AS we ON wa.work_id = we.work_id WHERE we.work_slug = ?')
          .bind(slug)
          .run();

        const { results: tags }= await env.portfolio_db
          .prepare('SELECT t.tag_name FROM WorkArticle AS wa JOIN WorkTag wt ON wa.work_id = wt.work_id JOIN Tag t ON wt.tag_name = t.tag_name JOIN WorkExperience AS we ON wa.work_id = we.work_id WHERE we.work_slug = ?')
          .bind(slug)
          .run();

        if (!results) {
          return json({ error: 'Article not found' }, 404, allowedOrigin);
        }

        if (!tags) {
          return json({ error: 'Tags not found'}, 404, allowedOrigin);
        }

        return json({results, tags}, 200, allowedOrigin);
      }

      if (url.pathname.startsWith('/api/leetcode/')) {
        const username = url.pathname.replace('/api/leetcode/', '');
        if (!username) {
          return json({ error: 'Username is required' }, 400, allowedOrigin);
        }

        const leetcodeStats = await getLeetCodeStats(username);
        if (!leetcodeStats) {
          return json({ error: 'LeetCode user not found' }, 400, allowedOrigin);
        }

        return json({leetcodeStats}, 200, allowedOrigin);
      }

      if (url.pathname.startsWith('/api/github/')) {
        const username = url.pathname.replace('/api/github/', '');
        if (!username) {
          return json({ error: 'Username is required' }, 400, allowedOrigin);
        }

        const githubStats = await getGithubStats(username, env);
        if (!githubStats) {
          return json({ error: 'Github user not found' }, 400, allowedOrigin);
        }

        return json({githubStats}, 200, allowedOrigin);
      }

      return json({error: 'End point does not exist'}, 404, allowedOrigin)
    } catch(error) {

      return json({
        error: error instanceof Error ? error.message : "Unknown error",
      }, 500, allowedOrigin);
    }
	},
} satisfies ExportedHandler<Env>;
