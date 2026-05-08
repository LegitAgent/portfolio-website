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

function json(data: unknown, status = 200, origin = "*") {
  return new Response(JSON.stringify(data), { // actual data
    status,
    headers: {
      "Content-Type": "application/json", // tells client the response is JSON
      "Access-Control-Allow-Origin": origin, // the origins that are allowed to acces this response
      "Access-Control-Allow-Methods": "GET, OPTIONS", // allowed HTTP methods
      "Access-Control-Allow-Headers": "Content-Type" // allowed request headers
    }
  });
}

function text(data: any, status = 200) {
  return new Response(data, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}

function handleOptions(request: Request, env: Env) {
  const allowedOrigin = getCorsOrigin(env);

  return new Response(null, {
    status: 204,
    headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
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
    if (url.pathname === "/robots.txt") {
      return text("User-agent: *\nDisallow: /\n")
    }

    // preflight request
    if (request.method === "OPTIONS") {
      if (!isAllowed) {
        return json({error: 'Forbidden'}, 403, allowedOrigin);
      }

      return handleOptions(request, env);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const { success } = await env.PORTFOLIO_LIMITER.limit({key: `${ip}:${url.pathname}`});

    if (!success) {
      return json({error: `Rate limit exceeded for ${url.pathname}`}, 429, allowedOrigin)
    }

    try {
      if (url.pathname === "/api/db/projects") {
        // If you did not use `DB` as your binding name, change it here
        const { results } = await env.portfolio_db
          .prepare("SELECT * FROM Projects")
          .run();
        return json({results}, 200, allowedOrigin);
      }

      return json({error: "End point does not exist"}, 404, allowedOrigin)
    } catch(error) {
      return json({error: "Internal server error"}, 500, allowedOrigin)
    }
	},
} satisfies ExportedHandler<Env>;
