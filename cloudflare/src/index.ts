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

function getCorsOrigin(env: Env) {
  return env.ORIGIN;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
    const allowedOrigin = getCorsOrigin(env);

    // preflight request
    if (request.method === "OPTIONS") {

    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const { success } = await env.API_RATE_LIMIT.limit({key: `${ip}:${url.pathname}`});

    if (!success) {
      return json({error: `Rate limit exceeded for ${url.pathname}`}, 429, allowedOrigin)
    }

    if (url.pathname === "api/db/projects") {
      // If you did not use `DB` as your binding name, change it here
      const { results } = await env.portfolio_db
        .prepare("SELECT * FROM Customers WHERE CompanyName = ?")
        .bind("Bs Beverages")
        .run();
      return json({results}, 200, allowedOrigin);
    }

    return json({error: "End point does not exist"}, 404, allowedOrigin)
	},
} satisfies ExportedHandler<Env>;
