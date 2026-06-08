import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { beforeEach, describe, expect, it } from 'vitest';
import worker from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

async function seedDatabase() {
	const queries = [
		'DROP TABLE IF EXISTS WorkTag',
		'DROP TABLE IF EXISTS ProjectTag',
		'DROP TABLE IF EXISTS WorkArticle',
		'DROP TABLE IF EXISTS WorkExperience',
		'DROP TABLE IF EXISTS ProjectArticles',
		'DROP TABLE IF EXISTS Projects',
		'DROP TABLE IF EXISTS Certificates',
		'DROP TABLE IF EXISTS Tag',
		`CREATE TABLE Projects (
			project_name TEXT PRIMARY KEY,
			project_description TEXT NOT NULL,
			project_github TEXT NOT NULL,
			project_img_url TEXT NOT NULL
		)`,
		`CREATE TABLE ProjectArticles (
			pArticle_title TEXT NOT NULL,
			pArticle_image_url TEXT NOT NULL,
			pArticle_slug TEXT PRIMARY KEY,
			pArticle_content TEXT NOT NULL,
			project_name TEXT NOT NULL
		)`,
		`CREATE TABLE Certificates (
			id INTEGER PRIMARY KEY,
			title TEXT NOT NULL,
			issuer TEXT NOT NULL,
			completion_date TEXT NOT NULL,
			credential_url TEXT,
			certificate_url TEXT NOT NULL,
			image_alt TEXT NOT NULL,
			skills TEXT NOT NULL,
			image_url TEXT NOT NULL
		)`,
		`CREATE TABLE Tag (
			tag_name TEXT PRIMARY KEY,
			skill_type TEXT NOT NULL
		)`,
		`CREATE TABLE ProjectTag (
			project_name TEXT NOT NULL,
			tag_name TEXT NOT NULL
		)`,
		`CREATE TABLE WorkExperience (
			work_id INTEGER PRIMARY KEY,
			company_name TEXT NOT NULL,
			role_title TEXT NOT NULL,
			employment_type TEXT NOT NULL,
			location TEXT,
			start_date TEXT NOT NULL,
			end_date TEXT,
			is_current INTEGER NOT NULL,
			short_description TEXT NOT NULL,
			company_logo_url TEXT NOT NULL,
			company_website TEXT,
			display_order INTEGER NOT NULL,
			work_slug TEXT NOT NULL
		)`,
		`CREATE TABLE WorkArticle (
			work_id INTEGER PRIMARY KEY,
			article_title TEXT NOT NULL,
			article_summary TEXT,
			article_content TEXT NOT NULL,
			article_image_url TEXT,
			responsibilities TEXT,
			achievements TEXT
		)`,
		`CREATE TABLE WorkTag (
			work_id INTEGER NOT NULL,
			tag_name TEXT NOT NULL
		)`,
		`INSERT INTO Projects (project_name, project_description, project_github, project_img_url)
		VALUES ('Portfolio', 'Personal portfolio site', 'https://github.com/LegitAgent/portfolio-website', 'projects/portfolio.jpg')`,
		`INSERT INTO ProjectArticles (pArticle_title, pArticle_image_url, pArticle_slug, pArticle_content, project_name)
		VALUES ('Building the Portfolio', 'articles/portfolio.jpg', 'portfolio', 'Article body', 'Portfolio')`,
		`INSERT INTO Certificates (id, title, issuer, completion_date, credential_url, certificate_url, image_alt, skills, image_url)
		VALUES (1, 'AWS Essentials', 'AWS', '2026-03-01', 'https://example.com/credential', 'certificates/AWS_Essentials_Cert.pdf', 'AWS certificate', 'Cloud', 'certificates/aws.jpg')`,
		`INSERT INTO Tag (tag_name, skill_type)
		VALUES ('React', 'frontend'), ('Cloudflare', 'backend'), ('TypeScript', 'language')`,
		`INSERT INTO ProjectTag (project_name, tag_name)
		VALUES ('Portfolio', 'React'), ('Portfolio', 'Cloudflare')`,
		`INSERT INTO WorkExperience (work_id, company_name, role_title, employment_type, location, start_date, end_date, is_current, short_description, company_logo_url, company_website, display_order, work_slug)
		VALUES (1, 'Hackazouk', 'Software Intern', 'Internship', 'Philippines', '2026-01-01', NULL, 1, 'Built internal tools', 'companies/hackazouk.png', 'https://example.com', 1, 'hackazouk')`,
		`INSERT INTO WorkArticle (work_id, article_title, article_summary, article_content, article_image_url, responsibilities, achievements)
		VALUES (1, 'Hackazouk Internship', 'Internship summary', 'Work article body', 'work/hackazouk.jpg', 'Built features', 'Shipped improvements')`,
		`INSERT INTO WorkTag (work_id, tag_name)
		VALUES (1, 'TypeScript'), (1, 'Cloudflare')`,
	];

	for (const query of queries) {
		await env.portfolio_db.prepare(query).run();
	}
}

async function fetchWorker(path: string, init?: RequestInit<IncomingRequestCfProperties<unknown>>) {
	const request = new IncomingRequest(`https://example.com${path}`, init);
	const ctx = createExecutionContext();
	const response = await worker.fetch(request, env, ctx);

	await waitOnExecutionContext(ctx);

	return response;
}

async function jsonBody<T = Record<string, unknown>>(response: Response): Promise<T> {
	return response.json();
}

beforeEach(async () => {
	await seedDatabase();
});

describe('portfolio worker', () => {
	it('returns project cards with article slugs', async () => {
		const response = await fetchWorker('/api/db/projects');
		const body = await jsonBody<{ results: Record<string, unknown>[] }>(response);

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('application/json');
		expect(body.results).toEqual([
			{
				project_name: 'Portfolio',
				project_description: 'Personal portfolio site',
				project_github: 'https://github.com/LegitAgent/portfolio-website',
				project_img_url: 'projects/portfolio.jpg',
				pArticle_slug: 'portfolio',
			},
		]);
	});

	it('returns certificates', async () => {
		const response = await fetchWorker('/api/db/certificates');
		const body = await jsonBody<{ certificates: Record<string, unknown>[] }>(response);

		expect(response.status).toBe(200);
		expect(body.certificates).toEqual([
			{
				id: 1,
				title: 'AWS Essentials',
				issuer: 'AWS',
				completion_date: '2026-03-01',
				credential_url: 'https://example.com/credential',
				certificate_url: 'certificates/AWS_Essentials_Cert.pdf',
				image_alt: 'AWS certificate',
				skills: 'Cloud',
				image_url: 'certificates/aws.jpg',
			},
		]);
	});

	it('returns tags', async () => {
		const response = await fetchWorker('/api/db/tags');
		const body = await jsonBody<{ tags: Record<string, unknown>[] }>(response);

		expect(response.status).toBe(200);
		expect(body.tags).toEqual([
			{ tag_name: 'React', skill_type: 'frontend' },
			{ tag_name: 'Cloudflare', skill_type: 'backend' },
			{ tag_name: 'TypeScript', skill_type: 'language' },
		]);
	});

	it('returns work experience rows', async () => {
		const response = await fetchWorker('/api/db/work');
		const body = await jsonBody<{ results: Record<string, unknown>[] }>(response);

		expect(response.status).toBe(200);
		expect(body.results).toEqual([
			{
				work_id: 1,
				company_name: 'Hackazouk',
				role_title: 'Software Intern',
				employment_type: 'Internship',
				location: 'Philippines',
				start_date: '2026-01-01',
				end_date: null,
				is_current: 1,
				short_description: 'Built internal tools',
				company_logo_url: 'companies/hackazouk.png',
				company_website: 'https://example.com',
				display_order: 1,
				work_slug: 'hackazouk',
			},
		]);
	});

	it('returns a project article and its tags by slug', async () => {
		const response = await fetchWorker('/api/project_articles/portfolio');
		const body = await jsonBody<{ results: Record<string, unknown>[]; tags: Record<string, unknown>[] }>(response);

		expect(response.status).toBe(200);
		expect(body.results).toEqual([
			{
				pArticle_title: 'Building the Portfolio',
				pArticle_image_url: 'articles/portfolio.jpg',
				pArticle_slug: 'portfolio',
				pArticle_content: 'Article body',
				project_github: 'https://github.com/LegitAgent/portfolio-website',
			},
		]);
		expect(body.tags).toEqual([{ tag_name: 'React' }, { tag_name: 'Cloudflare' }]);
	});

	it('returns a work article and its tags by work slug', async () => {
		const response = await fetchWorker('/api/work_articles/hackazouk');
		const body = await jsonBody<{ results: Record<string, unknown>[]; tags: Record<string, unknown>[] }>(response);

		expect(response.status).toBe(200);
		expect(body.results).toEqual([
			{
				article_title: 'Hackazouk Internship',
				article_summary: 'Internship summary',
				article_content: 'Work article body',
				article_image_url: 'work/hackazouk.jpg',
				responsibilities: 'Built features',
				achievements: 'Shipped improvements',
				company_name: 'Hackazouk',
				role_title: 'Software Intern',
				company_website: 'https://example.com',
			},
		]);
		expect(body.tags).toEqual([{ tag_name: 'TypeScript' }, { tag_name: 'Cloudflare' }]);
	});

	it('returns empty arrays for unknown article slugs', async () => {
		const response = await fetchWorker('/api/project_articles/missing');
		const body = await jsonBody<{ results: unknown[]; tags: unknown[] }>(response);

		expect(response.status).toBe(200);
		expect(body).toEqual({ results: [], tags: [] });
	});

	it('serves robots.txt before rate limiting and database access', async () => {
		const response = await fetchWorker('/robots.txt');

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
		expect(await response.text()).toBe('User-agent: *\nDisallow: /\n');
	});

	it('handles CORS preflight requests', async () => {
		const response = await fetchWorker('/api/db/projects', {
			method: 'OPTIONS',
			headers: { Origin: 'https://example.com' },
		});

		expect(response.status).toBe(204);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
		expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
	});

	it('returns 404 JSON for unknown routes', async () => {
		const response = await fetchWorker('/does-not-exist');
		const body = await jsonBody(response);

		expect(response.status).toBe(404);
		expect(body).toEqual({ error: 'End point does not exist' });
	});

	it('is reachable through the integration service binding', async () => {
		const response = await SELF.fetch('https://example.com/api/db/projects');
		const body = await jsonBody<{ results: Record<string, unknown>[] }>(response);

		expect(response.status).toBe(200);
		expect(body.results).toHaveLength(1);
		expect(body.results[0].project_name).toBe('Portfolio');
	});
});
