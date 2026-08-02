import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getGithubStats } from '../src/services/github';
import { getLeetCodeStats } from '../src/services/leetcode';
import worker from '../src/index';

vi.mock('../src/services/github', () => ({
	getGithubStats: vi.fn(),
}));

vi.mock('../src/services/leetcode', () => ({
	getLeetCodeStats: vi.fn(),
}));

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;
const mockedGetGithubStats = vi.mocked(getGithubStats);
const mockedGetLeetCodeStats = vi.mocked(getLeetCodeStats);

async function seedDatabase() {
	const queries = [
		'DROP TABLE IF EXISTS WorkTag',
		'DROP TABLE IF EXISTS ProjectTag',
		'DROP TABLE IF EXISTS WorkArticle',
		'DROP TABLE IF EXISTS WorkExperience',
		'DROP TABLE IF EXISTS ProjectArticles',
		'DROP TABLE IF EXISTS ImageBuckets',
		'DROP TABLE IF EXISTS Projects',
		'DROP TABLE IF EXISTS Certificates',
		'DROP TABLE IF EXISTS Tag',
		`CREATE TABLE Projects (
			project_name TEXT PRIMARY KEY,
			project_description TEXT NOT NULL,
			project_github TEXT NOT NULL,
			project_img_url TEXT NOT NULL,
			featured INTEGER NOT NULL DEFAULT 0,
			started_at TEXT NOT NULL,
			ended_at TEXT,
			live_url TEXT,
			status TEXT NOT NULL
		)`,
		`CREATE TABLE ProjectArticles (
			project_name TEXT NOT NULL,
			pArticle_slug TEXT PRIMARY KEY,
			pArticle_image_url TEXT,
			pArticle_image_alt TEXT,
			pArticle_summary TEXT,
			pArticle_overview TEXT,
			pArticle_content TEXT,
			pArticle_challenges TEXT,
			pArticle_lessons TEXT,
			pArticle_future_work TEXT,
			r2_url TEXT
		)`,
		`CREATE TABLE ImageBuckets (
			r2_url TEXT PRIMARY KEY,
			images TEXT NOT NULL
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
			image_url TEXT NOT NULL,
			description TEXT NOT NULL
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
			work_slug TEXT NOT NULL,
			type TEXT NOT NULL
		)`,
		`CREATE TABLE WorkArticle (
			work_id INTEGER PRIMARY KEY,
			article_title TEXT NOT NULL,
			article_summary TEXT,
			article_content TEXT NOT NULL,
			article_image_url TEXT,
			responsibilities TEXT,
			achievements TEXT,
			r2_url TEXT
		)`,
		`CREATE TABLE WorkTag (
			work_id INTEGER NOT NULL,
			tag_name TEXT NOT NULL
		)`,
		`INSERT INTO Projects (project_name, project_description, project_github, project_img_url, featured, started_at, ended_at, live_url, status)
		VALUES ('Portfolio', 'Personal portfolio site', 'https://github.com/LegitAgent/portfolio-website', 'projects/portfolio.jpg', 1, '2026-01-01', NULL, 'https://example.com/portfolio', 'WIP')`,
		`INSERT INTO ProjectArticles (project_name, pArticle_slug, pArticle_image_url, pArticle_image_alt, pArticle_summary, pArticle_overview, pArticle_content, pArticle_challenges, pArticle_lessons, pArticle_future_work, r2_url)
		VALUES ('Portfolio', 'portfolio', 'articles/portfolio.jpg', 'Portfolio preview', 'Portfolio summary', 'Portfolio overview', 'Article body', 'Challenges', 'Lessons', 'Future work', 'articles/portfolio')`,
		`INSERT INTO ImageBuckets (r2_url, images)
		VALUES ('articles/portfolio', '["overview.jpg","dashboard.jpg"]'),
		       ('work/hackazouk', '["architecture.jpg","internal-tools.jpg"]')`,
		`INSERT INTO Certificates (id, title, issuer, completion_date, credential_url, certificate_url, image_alt, skills, image_url, description)
		VALUES (1, 'AWS Essentials', 'AWS', '2026-03-01', 'https://example.com/credential', 'certificates/AWS_Essentials_Cert.pdf', 'AWS certificate', 'Cloud', 'certificates/aws.jpg', 'AWS course')`,
		`INSERT INTO Tag (tag_name, skill_type)
		VALUES ('React', 'frontend'), ('Cloudflare', 'backend'), ('TypeScript', 'language')`,
		`INSERT INTO ProjectTag (project_name, tag_name)
		VALUES ('Portfolio', 'React'), ('Portfolio', 'Cloudflare')`,
		`INSERT INTO WorkExperience (work_id, company_name, role_title, employment_type, location, start_date, end_date, is_current, short_description, company_logo_url, company_website, display_order, work_slug, type)
		VALUES (1, 'Hackazouk', 'Software Intern', 'Internship', 'Philippines', '2026-01-01', NULL, 1, 'Built internal tools', 'companies/hackazouk.png', 'https://example.com', 1, 'hackazouk', 'backend_development')`,
		`INSERT INTO WorkArticle (work_id, article_title, article_summary, article_content, article_image_url, responsibilities, achievements, r2_url)
		VALUES (1, 'Hackazouk Internship', 'Internship summary', 'Work article body', 'work/hackazouk.jpg', 'Built features', 'Shipped improvements', 'work/hackazouk')`,
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

async function clearCachedRoutes() {
	const paths = [
		'/api/db/projects',
		'/api/db/certificates',
		'/api/db/tags',
		'/api/db/work',
		'/api/stats/portfolio',
		'/api/db/project_articles/portfolio',
		'/api/db/project_articles/missing',
		'/api/db/work_articles/hackazouk',
		'/api/db/work_articles/missing',
		'/api/github',
		'/api/leetcode',
	];

	await Promise.all(
		paths.map((path) => caches.default.delete(new Request(`https://example.com${path}`))),
	);
}

beforeEach(async () => {
	vi.resetAllMocks();
	await clearCachedRoutes();
	await seedDatabase();
});

describe('portfolio worker', () => {
	it('returns project cards with article slugs', async () => {
		const response = await fetchWorker('/api/db/projects');
		const body = await jsonBody<{ results: Record<string, unknown>[] }>(response);

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
		expect(body.results).toEqual([
			{
				project_name: 'Portfolio',
				project_description: 'Personal portfolio site',
				project_github: 'https://github.com/LegitAgent/portfolio-website',
				project_img_url: 'projects/portfolio.jpg',
				featured: 1,
				started_at: '2026-01-01',
				ended_at: null,
				live_url: 'https://example.com/portfolio',
				status: 'WIP',
				pArticle_slug: 'portfolio',
				tags: ['Cloudflare', 'React'],
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
				skills: ['Cloud'],
				image_url: 'certificates/aws.jpg',
				description: 'AWS course',
			},
		]);
	});

	it('returns tags', async () => {
		const response = await fetchWorker('/api/db/tags');
		const body = await jsonBody<{ tags: Record<string, unknown>[] }>(response);

		expect(response.status).toBe(200);
		expect(body.tags).toEqual([
			{ tag_name: 'Cloudflare', skill_type: 'backend' },
			{ tag_name: 'React', skill_type: 'frontend' },
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
				type: 'backend_development',
			},
		]);
	});

	it('returns a project article and its tags by slug', async () => {
		const response = await fetchWorker('/api/db/project_articles/portfolio');
		const body = await jsonBody<{ article: Record<string, unknown>; tags: string[] }>(response);

		expect(response.status).toBe(200);
		expect(body.article).toEqual({
			project_name: 'Portfolio',
			pArticle_slug: 'portfolio',
			pArticle_image_url: 'articles/portfolio.jpg',
			pArticle_image_alt: 'Portfolio preview',
			pArticle_summary: 'Portfolio summary',
			pArticle_overview: 'Portfolio overview',
			pArticle_content: 'Article body',
			pArticle_challenges: 'Challenges',
			pArticle_lessons: 'Lessons',
			pArticle_future_work: 'Future work',
			images: ['overview.jpg', 'dashboard.jpg'],
			r2_url: 'articles/portfolio',
			project_github: 'https://github.com/LegitAgent/portfolio-website',
			started_at: '2026-01-01',
			live_url: 'https://example.com/portfolio',
			status: 'WIP',
			featured: 1,
		});
		expect(body.tags).toEqual(['Cloudflare', 'React']);
	});

	it('returns an empty image list when an article image manifest is malformed', async () => {
		await env.portfolio_db
			.prepare("UPDATE ImageBuckets SET images = 'not-valid-json' WHERE r2_url = 'articles/portfolio'")
			.run();

		const response = await fetchWorker('/api/db/project_articles/portfolio');
		const body = await jsonBody<{ article: { images: string[] } }>(response);

		expect(response.status).toBe(200);
		expect(body.article.images).toEqual([]);
	});

	it('returns a work article and its tags by work slug', async () => {
		const response = await fetchWorker('/api/db/work_articles/hackazouk');
		const body = await jsonBody<{ article: Record<string, unknown>; tags: string[] }>(response);

		expect(response.status).toBe(200);
		expect(body.article).toEqual({
			article_title: 'Hackazouk Internship',
			article_summary: 'Internship summary',
			article_content: 'Work article body',
			article_image_url: 'work/hackazouk.jpg',
			responsibilities: 'Built features',
			achievements: 'Shipped improvements',
			company_name: 'Hackazouk',
			role_title: 'Software Intern',
			employment_type: 'Internship',
			location: 'Philippines',
			start_date: '2026-01-01',
			end_date: null,
			is_current: 1,
			company_website: 'https://example.com',
			work_slug: 'hackazouk',
			images: ['architecture.jpg', 'internal-tools.jpg'],
			r2_url: 'work/hackazouk',
		});
		expect(body.tags).toEqual(['Cloudflare', 'TypeScript']);
	});

	it('returns and caches a 404 for an unknown project article slug', async () => {
		const response = await fetchWorker('/api/db/project_articles/missing');
		const body = await jsonBody(response);

		expect(response.status).toBe(404);
		expect(body).toEqual({ error: 'Article not found' });
		expect(response.headers.get('Cache-Control')).toBe('public, max-age=0, s-maxage=30');
		expect(response.headers.get('X-Cache-Status')).toBe('MISS');

		const cachedResponse = await fetchWorker('/api/db/project_articles/missing');

		expect(cachedResponse.status).toBe(404);
		expect(await jsonBody(cachedResponse)).toEqual({ error: 'Article not found' });
		expect(cachedResponse.headers.get('X-Cache-Status')).toBe('HIT');
	});

	it('returns 404 for an unknown work article slug', async () => {
		const response = await fetchWorker('/api/db/work_articles/missing');

		expect(response.status).toBe(404);
		expect(await jsonBody(response)).toEqual({ error: 'Article not found' });
		expect(response.headers.get('Cache-Control')).toBe('public, max-age=0, s-maxage=30');
		expect(response.headers.get('X-Cache-Status')).toBe('MISS');
	});

	it.each([
		'/api/db/project_articles/not%2Fa-valid-slug',
		'/api/db/work_articles/not%2Fa-valid-slug',
	])('rejects an invalid article slug at %s', async (path) => {
		const response = await fetchWorker(path);

		expect(response.status).toBe(400);
		expect(await jsonBody(response)).toEqual({ error: 'Slug not valid' });
		expect(response.headers.get('Cache-Control')).toBe('no-store');
	});

	it('serves robots.txt before rate limiting and database access', async () => {
		const response = await fetchWorker('/robots.txt');

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
		expect(await response.text()).toBe('User-agent: *\nDisallow: /\n');
	});

	it('rejects CORS preflight requests when no allowed origin is configured', async () => {
		const response = await fetchWorker('/api/db/projects', {
			method: 'OPTIONS',
			headers: { Origin: 'https://example.com' },
		});

		expect(response.status).toBe(403);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
	});

	it('returns portfolio statistics', async () => {
		const response = await fetchWorker('/api/stats/portfolio');
		const body = await jsonBody<{
			portfolioStats: {
				totalProjects: number;
				totalTechnologies: number;
				totalCertificates: number;
				totalWorkExperiences: number;
				currentRoles: number;
			};
		}>(response);

		expect(response.status).toBe(200);
		expect(body.portfolioStats).toMatchObject({
			totalProjects: 1,
			totalTechnologies: 3,
			totalCertificates: 1,
			totalWorkExperiences: 1,
			currentRoles: 1,
		});
	});

	it('returns mocked GitHub statistics', async () => {
		const githubStats = {
			name: 'Alba Martin',
			login: 'LegitAgent',
			bio: 'Software developer',
			avatarUrl: 'https://example.com/avatar.png',
			status: null,
			followers: 7,
			contributions: { commits: 120 },
			repositorySummary: {
				totalRepositories: 10,
				totalStars: 11,
				totalForks: 1,
			},
			languages: [],
			repositories: [],
		};
		mockedGetGithubStats.mockResolvedValue(githubStats);

		const response = await fetchWorker('/api/github');

		expect(response.status).toBe(200);
		expect(await jsonBody(response)).toEqual({ githubStats });
		expect(response.headers.get('Cache-Control')).toBe('public, max-age=60, s-maxage=3600');
		expect(mockedGetGithubStats).toHaveBeenCalledOnce();
		expect(mockedGetGithubStats).toHaveBeenCalledWith(
			env.GITHUB_NAME,
			env,
			expect.any(String),
			expect.any(String),
		);
	});

	it('returns 404 when the mocked GitHub user does not exist', async () => {
		mockedGetGithubStats.mockResolvedValue(null);

		const response = await fetchWorker('/api/github');

		expect(response.status).toBe(404);
		expect(await jsonBody(response)).toEqual({ error: 'Github user not found' });
		expect(response.headers.get('Cache-Control')).toBe('no-store');
	});

	it('returns mocked LeetCode statistics', async () => {
		const leetcodeStats = {
			username: 'LegitAgent',
			ranking: 100000,
			totalSolved: 42,
			totalProblems: 3000,
			solvedPercentage: 1.4,
			easySolved: 25,
			totalEasy: 800,
			mediumSolved: 15,
			totalMedium: 1600,
			hardSolved: 2,
			totalHard: 600,
			acceptanceRate: 50,
			totalAcceptedSubmissions: 50,
			totalSubmissionAttempts: 100,
			strongestTopics: [],
			fundamentalSkills: [],
			intermediateSkills: [],
			advancedSkills: [],
		};
		mockedGetLeetCodeStats.mockResolvedValue(leetcodeStats);

		const response = await fetchWorker('/api/leetcode');

		expect(response.status).toBe(200);
		expect(await jsonBody(response)).toEqual({ leetcodeStats });
		expect(response.headers.get('Cache-Control')).toBe('public, max-age=60, s-maxage=3600');
		expect(mockedGetLeetCodeStats).toHaveBeenCalledOnce();
		expect(mockedGetLeetCodeStats).toHaveBeenCalledWith(env.LEETCODE_NAME);
	});

	it('returns 404 when the mocked LeetCode user does not exist', async () => {
		mockedGetLeetCodeStats.mockResolvedValue(null);

		const response = await fetchWorker('/api/leetcode');

		expect(response.status).toBe(404);
		expect(await jsonBody(response)).toEqual({ error: 'LeetCode user not found' });
		expect(response.headers.get('Cache-Control')).toBe('no-store');
	});

	it('returns 404 JSON for unknown routes', async () => {
		const response = await fetchWorker('/does-not-exist');
		const body = await jsonBody(response);

		expect(response.status).toBe(404);
		expect(body).toEqual({ error: 'Endpoint does not exist' });
		expect(response.headers.get('Cache-Control')).toBe('no-store');
	});

	it('is reachable through the integration service binding', async () => {
		const response = await SELF.fetch('https://example.com/api/db/projects');
		const body = await jsonBody<{ results: Record<string, unknown>[] }>(response);

		expect(response.status).toBe(200);
		expect(body.results).toHaveLength(1);
		expect(body.results[0].project_name).toBe('Portfolio');
	});
});
