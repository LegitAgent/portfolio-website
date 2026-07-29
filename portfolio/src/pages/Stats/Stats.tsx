import './Stats.css';
import type {
  GithubStats,
  GithubStatsResponse,
  LeetCodeStats,
  LeetCodeStatsResponse,
  PortfolioStats,
  PortfolioStatsResponse,
  SkillCount,
} from '../../types/stats';
import { CLOUDFLARE_GATEWAY, FOLDER_ICON, GITHUB_ICON, LEETCODE_ICON, STACK_ICON } from '../../config/constants';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../Misc/LoadingScreen';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${CLOUDFLARE_GATEWAY}${path}`);

  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }

  return response.json();
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function ProgressBar({ value, total, tone }: { value: number; total: number; tone: string }) {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div className='statsProgress'>
      <div className='statsProgressLabel'>
        <span>{tone}</span>
        <strong>
          {value} / {total}
        </strong>
      </div>
      <div className='statsProgressTrack'>
        <span className={`statsProgressFill statsProgressFill--${tone.toLowerCase()}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function TopicList({ title, topics }: { title: string; topics: SkillCount[] }) {
  if (topics.length === 0) {
    return null;
  }

  return (
    <section className='statsTopicGroup'>
      <h3>{title}</h3>
      <div>
        {topics.slice(0, 8).map((topic) => (
          <span key={topic.tagSlug}>
            {topic.tagName}
            <strong>{topic.problemsSolved}</strong>
          </span>
        ))}
      </div>
    </section>
  );
}

function OverviewIcon({ type }: { type: 'projects' | 'leetcode' | 'github' | 'technologies' }) {
  if (type === 'projects') {
    return <img className='statsOverviewIconImage' src={FOLDER_ICON} alt='folder icon' aria-hidden='true' />;
  }

  if (type === 'leetcode') {
    return <img className='statsOverviewIconImage' src={LEETCODE_ICON} alt='leetcode icon' aria-hidden='true' />;
  }

  if (type === 'github') {
    return <img className='statsOverviewIconImage statsOverviewIconImage--github' src={GITHUB_ICON} alt='github icon' aria-hidden='true' />;
  }

  return <img className='statsOverviewIconImage' src={STACK_ICON} alt='leetcode icon' aria-hidden='true' />;
}

function GithubMetricIcon({ type }: { type: 'commits' | 'repositories' | 'stars' | 'forks' | 'followers' }) {
  const paths = {
    commits: (
      <>
        <circle cx='12' cy='12' r='3' />
        <path d='M3 12h6M15 12h6' />
      </>
    ),
    repositories: (
      <>
        <path d='M5 4.5h10.5A2.5 2.5 0 0 1 18 7v13H7.5A2.5 2.5 0 0 1 5 17.5v-13Z' />
        <path d='M5 17.5A2.5 2.5 0 0 1 7.5 15H18' />
      </>
    ),
    stars: <path d='m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6-5.4-2.84-5.4 2.84 1.03-6-4.36-4.25 6.03-.88L12 3Z' />,
    forks: (
      <>
        <circle cx='7' cy='5' r='2' />
        <circle cx='17' cy='5' r='2' />
        <circle cx='12' cy='19' r='2' />
        <path d='M7 7v2a3 3 0 0 0 3 3h2M17 7v2a3 3 0 0 1-3 3h-2v5' />
      </>
    ),
    followers: (
      <>
        <circle cx='12' cy='8' r='3.25' />
        <path d='M5.5 20a6.5 6.5 0 0 1 13 0' />
      </>
    ),
  };

  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      {paths[type]}
    </svg>
  );
}

function LeetCodeMetricIcon({ type }: { type: 'ranking' | 'acceptance' | 'submissions' }) {
  const paths = {
    ranking: (
      <>
        <path d='M8 20h8' />
        <path d='M12 16v4' />
        <path d='M7 4h10v4a5 5 0 0 1-10 0V4Z' />
        <path d='M7 6H4v1a4 4 0 0 0 4 4M17 6h3v1a4 4 0 0 1-4 4' />
      </>
    ),
    acceptance: (
      <>
        <circle cx='12' cy='12' r='8' />
        <path d='m8.5 12 2.25 2.25L15.5 9.5' />
      </>
    ),
    submissions: (
      <>
        <path d='M5 4h10l4 4v12H5V4Z' />
        <path d='M15 4v4h4M8 13h8M8 16h6' />
      </>
    ),
  };

  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      {paths[type]}
    </svg>
  );
}

function PortfolioMetricIcon({ type }: { type: 'completed' | 'certificates' | 'experience' }) {
  const paths = {
    completed: (
      <>
        <path d='M4 6.5h6l1.5 2H20v9.75A1.75 1.75 0 0 1 18.25 20H5.75A1.75 1.75 0 0 1 4 18.25V6.5Z' />
        <path d='m9 14 2 2 4-4' />
      </>
    ),
    certificates: (
      <>
        <circle cx='12' cy='9' r='5' />
        <path d='m9 13-1 7 4-2 4 2-1-7' />
      </>
    ),
    experience: (
      <>
        <path d='M8 6V4.75C8 3.78 8.78 3 9.75 3h4.5C15.22 3 16 3.78 16 4.75V6' />
        <rect x='4' y='6' width='16' height='13' rx='2' />
        <path d='M4 11h16M10 11v2h4v-2' />
      </>
    ),
  };

  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      {paths[type]}
    </svg>
  );
}

function StatsSectionError({
  className,
  id,
  index,
  eyebrow,
  title,
  icon,
  message,
}: {
  className: string;
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  icon: string;
  message: string;
}) {
  return (
    <section className={`statsSection ${className}`} id={id}>
      <div className='statsSectionFailure' role='alert'>
        <header className='statsFailureHeader'>
          <span>{index}</span>
          <i>
            <img src={icon} alt='' aria-hidden='true' />
          </i>
          <div>
            <p>{eyebrow}</p>
            <h2>{title}</h2>
          </div>
        </header>
        <div className='statsFailureMessage'>
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M12 8v5' />
            <path d='M12 17.25v.1' />
            <path d='M10.3 4.4 3.1 17a2 2 0 0 0 1.74 3h14.32a2 2 0 0 0 1.74-3L13.7 4.4a2 2 0 0 0-3.4 0Z' />
          </svg>
          <div>
            <strong>{title} data is temporarily unavailable</strong>
            <p>{message}</p>
          </div>
          <button type='button' onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const [leetcode, setLeetcode] = useState<LeetCodeStats | null>(null);
  const [github, setGithub] = useState<GithubStats | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioStats | null>(null);

  const [leetcodeError, setLeetcodeError] = useState<string | null>(null);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchJson<LeetCodeStatsResponse>('api/leetcode'),
      fetchJson<GithubStatsResponse>('api/github'),
      fetchJson<PortfolioStatsResponse>('api/stats/portfolio'),
    ])
      .then(([leetcodeResponse, githubResponse, portfolioResponse]) => {
        if (leetcodeResponse.status === 'fulfilled') {
          setLeetcode(leetcodeResponse.value.leetcodeStats);
          setLeetcodeError(null);
        } else {
          setLeetcodeError('Could not load the LeetCode API. Please try again later.');
          setLeetcode(null);
        }

        if (githubResponse.status === 'fulfilled') {
          setGithub(githubResponse.value.githubStats);
          setGithubError(null);
        } else {
          setGithubError('Could not load the GitHub API. Please try again later.');
          setGithub(null);
        }

        if (portfolioResponse.status === 'fulfilled') {
          setPortfolio(portfolioResponse.value.portfolioStats);
          setPortfolioError(null);
        } else {
          setPortfolioError('Could not load the Portfolio API. Please try again later.');
          setPortfolio(null);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const overviewStats = [
    ...(portfolio
      ? [
          {
            type: 'projects' as const,
            code: 'PORTFOLIO',
            label: 'Projects built',
            value: portfolio.totalProjects,
            detail: `${portfolio.completedProjects} completed projects`,
            href: '#portfolio',
            external: false,
          },
        ]
      : []),
    ...(leetcode
      ? [
          {
            type: 'leetcode' as const,
            code: 'LEETCODE',
            label: 'Problems solved',
            value: leetcode.totalSolved,
            detail: `${leetcode.solvedPercentage}% of the problem catalog`,
            href: '#leetcode-stats',
            external: false,
          },
        ]
      : []),
    ...(github
      ? [
          {
            type: 'github' as const,
            code: 'GITHUB',
            label: 'Commits authored',
            value: github.contributions.commits,
            detail: 'Rolling previous 12 months',
            href: '#github-stats',
            external: false,
          },
        ]
      : []),
    ...(portfolio
      ? [
          {
            type: 'technologies' as const,
            code: 'STACK',
            label: 'Technologies used',
            value: portfolio.totalTechnologies,
            detail: `Backed by ${portfolio.totalCertificates} certificates`,
            href: '/skills_experience',
            external: false,
          },
        ]
      : []),
  ];
  const sortedGithubLanguages = github
    ? [...github.languages].sort((first, second) => second.percentage - first.percentage || first.name.localeCompare(second.name))
    : [];
  const githubMetrics = github
    ? [
        { type: 'commits' as const, label: 'Commits', value: github.contributions.commits, detail: 'Last 12 months' },
        { type: 'repositories' as const, label: 'Repositories', value: github.repositorySummary.totalRepositories, detail: 'Public and owned' },
        { type: 'stars' as const, label: 'Stars', value: github.repositorySummary.totalStars, detail: 'Across public repos' },
        { type: 'forks' as const, label: 'Forks', value: github.repositorySummary.totalForks, detail: 'Across public repos' },
        { type: 'followers' as const, label: 'Followers', value: github.followers, detail: 'GitHub community' },
      ]
    : [];
  const portfolioMetrics = portfolio
    ? [
        {
          type: 'completed' as const,
          label: 'Completed projects',
          value: portfolio.completedProjects,
          detail: `${portfolio.totalProjects} projects total`,
        },
        { type: 'certificates' as const, label: 'Certificates', value: portfolio.totalCertificates, detail: 'Verified learning milestones' },
        {
          type: 'experience' as const,
          label: 'Work experiences',
          value: portfolio.totalWorkExperiences,
          detail: `${portfolio.currentRoles} current role${portfolio.currentRoles === 1 ? '' : 's'}`,
        },
      ]
    : [];

  return (
    <main className='statsPage'>
      <header className='statsHeader'>
        <p>Developer analytics</p>
        <h1>
          Developer <span>Stats</span>
        </h1>
        <span>This is a view of my development activity, DSA progress, repositories, technologies, and portfolio data.</span>
      </header>

      <section className='statsOverview' aria-label='Developer overview'>
        {overviewStats.map((stat) => {
          const cardContent = (
            <>
              <div className='statsOverviewCardTop'>
                <span>{stat.code}</span>
                <i>
                  <OverviewIcon type={stat.type} />
                </i>
              </div>
              <div className='statsOverviewValue'>
                <strong>{formatNumber(stat.value)}</strong>
                <span>{stat.label}</span>
              </div>
              <p>{stat.detail}</p>
            </>
          );
          const className = `statsOverviewCard statsOverviewCard--${stat.type}`;

          return stat.external ? (
            <a className={className} href={stat.href} target='_blank' rel='noreferrer' key={stat.label}>
              {cardContent}
            </a>
          ) : stat.href.startsWith('#') ? (
            <a className={className} href={stat.href} key={stat.label}>
              {cardContent}
            </a>
          ) : (
            <Link className={className} to={stat.href} key={stat.label}>
              {cardContent}
            </Link>
          );
        })}
      </section>

      {github ? (
        <section className='statsSection githubSection' id='github-stats'>
        <div className='githubOverview'>
          <header className='statsSectionHeader githubSectionHeader'>
            <div>
              <span>01</span>
              <i className='githubSectionIcon'>
                <img src={GITHUB_ICON} alt='' aria-hidden='true' />
              </i>
              <div>
                <p>Open-source activity</p>
                <h2>GitHub</h2>
              </div>
            </div>
            <a className='githubProfileLink' href={`https://github.com/${github.login}`} target='_blank' rel='noreferrer'>
              <span>
                <small>Visit my GitHub</small>@{github.login}
              </span>
              <svg viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M14 5h5v5' />
                <path d='m10 14 9-9' />
                <path d='M19 13v6H5V5h6' />
              </svg>
            </a>
          </header>

          <div className='githubProfile'>
            <img src={github.avatarUrl} alt={`${github.login} GitHub avatar`} />
            <div>
              <span className='githubProfileLabel'>Developer profile</span>
              <h3>{github.name ?? github.login}</h3>
              {github.bio && <p>{github.bio}</p>}
              {github.status && (
                <small>
                  {github.status.emoji} {github.status.message}
                </small>
              )}
            </div>
          </div>

          <div className='statsMetricGrid githubMetricGrid'>
            {githubMetrics.map((metric) => (
              <article className={`githubMetricCard githubMetricCard--${metric.type}`} key={metric.type}>
                <div>
                  <i>
                    <GithubMetricIcon type={metric.type} />
                  </i>
                  <span>{metric.label}</span>
                </div>
                <strong>{formatNumber(metric.value)}</strong>
                <small>{metric.detail}</small>
              </article>
            ))}
          </div>
        </div>

        <div className='statsSplit githubStatsSplit'>
          <section className='languagePanel'>
            <div className='statsSubheading'>
              <p>Code distribution</p>
              <h3>Top languages</h3>
              <small>Not to be taken literally as how experienced I am in a certain language. Simply language percentage within my GitHub profile.</small>
            </div>
            <div className='languageList'>
              {sortedGithubLanguages.map((language, index) => (
                <div className='languageRank' key={language.name}>
                  <span className='languageRankNumber'>{String(index + 1).padStart(2, '0')}</span>
                  <div className='languageRankContent'>
                    <div className='languageRankLabel'>
                      <span>
                        <i style={{ backgroundColor: language.color ?? '#7dbceb' }} />
                        {language.name}
                      </span>
                      <strong>{language.percentage}%</strong>
                    </div>
                    <div className='languageTrack'>
                      <span style={{ width: `${language.percentage}%`, backgroundColor: language.color ?? '#7dbceb' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className='repositoryPanel'>
            <div className='statsSubheading'>
              <p>Public work</p>
              <h3>Repositories</h3>
            </div>
            <div className='repositorySummary'>
              <span>
                <strong>{github.repositorySummary.totalRepositories}</strong> repositories
              </span>
              <span>
                <strong>{github.repositorySummary.totalStars}</strong> stars
              </span>
              <span>
                <strong>{github.repositorySummary.totalForks}</strong> forks
              </span>
            </div>
            <div className='repositoryList'>
              {github.repositories.map((repository) => (
                <a href={repository.url} target='_blank' rel='noreferrer' key={repository.name}>
                  <div>
                    <strong>{repository.name}</strong>
                    {repository.primaryLanguage && <span>{repository.primaryLanguage.name}</span>}
                  </div>
                  <p>{repository.description ?? 'No description provided.'}</p>
                  <small>
                    ★ {repository.stars} · Forks {repository.forks}
                  </small>
                </a>
              ))}
            </div>
          </section>
        </div>
        </section>
      ) : (
        <StatsSectionError
          className='githubSection'
          id='github-stats'
          index='01'
          eyebrow='Open-source activity'
          title='GitHub'
          icon={GITHUB_ICON}
          message={githubError ?? 'GitHub data could not be loaded.'}
        />
      )}

      {leetcode ? (
        <section className='statsSection leetcodeSection' id='leetcode-stats'>
        <div className='leetcodeOverview'>
          <header className='statsSectionHeader leetcodeSectionHeader'>
            <div>
              <span>02</span>
              <i className='leetcodeSectionIcon'>
                <img src={LEETCODE_ICON} alt='' aria-hidden='true' />
              </i>
              <div>
                <p>Problem solving</p>
                <h2>LeetCode</h2>
                <h3>Building consistency through regular algorithm and data-structure practice.</h3>
              </div>
            </div>
            <a className='leetcodeProfileLink' href={`https://leetcode.com/u/${leetcode.username}/`} target='_blank' rel='noreferrer'>
              <span>
                <small>Visit my LeetCode</small>@{leetcode.username}
              </span>
              <svg viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M14 5h5v5' />
                <path d='m10 14 9-9' />
                <path d='M19 13v6H5V5h6' />
              </svg>
            </a>
          </header>

          <div className='leetcodeHero'>
            <div className='leetcodeScore'>
              <span className='leetcodeScoreEyebrow'>Problems solved</span>
              <div>
                <strong>{leetcode.totalSolved}</strong>
                <span>/ {leetcode.totalProblems}</span>
              </div>
              <p>{leetcode.solvedPercentage}% of the catalog completed</p>
            </div>
            <div className='leetcodeMetrics'>
              <article>
                <i>
                  <LeetCodeMetricIcon type='ranking' />
                </i>
                <span>Global ranking</span>
                <strong>{leetcode.ranking ? `#${formatNumber(leetcode.ranking)}` : 'Unranked'}</strong>
                <small>Worldwide position</small>
              </article>
              <article>
                <i>
                  <LeetCodeMetricIcon type='acceptance' />
                </i>
                <span>Acceptance rate</span>
                <strong>{leetcode.acceptanceRate === null ? 'N/A' : `${leetcode.acceptanceRate}%`}</strong>
                <small>{formatNumber(leetcode.totalAcceptedSubmissions)} accepted</small>
              </article>
              <article>
                <i>
                  <LeetCodeMetricIcon type='submissions' />
                </i>
                <span>Submissions</span>
                <strong>{formatNumber(leetcode.totalSubmissionAttempts)}</strong>
                <small>Total attempts</small>
              </article>
            </div>
          </div>
        </div>

        <div className='difficultyPanel'>
          <div className='leetcodePanelHeading'>
            <div>
              <p>Completion by tier</p>
              <h3>Difficulty progress</h3>
            </div>
            <span>{leetcode.totalSolved} solved</span>
          </div>
          <div className='difficultyGrid'>
            <ProgressBar tone='Easy' value={leetcode.easySolved} total={leetcode.totalEasy} />
            <ProgressBar tone='Medium' value={leetcode.mediumSolved} total={leetcode.totalMedium} />
            <ProgressBar tone='Hard' value={leetcode.hardSolved} total={leetcode.totalHard} />
          </div>
        </div>

        <div className='leetcodePanelHeading leetcodeTopicsHeading'>
          <div>
            <p>Knowledge map</p>
            <h3>Topic proficiency</h3>
          </div>
        </div>
        <div className='statsTopics'>
          <TopicList title='Strongest topics' topics={leetcode.strongestTopics} />
          <TopicList title='Fundamental' topics={leetcode.fundamentalSkills} />
          <TopicList title='Intermediate' topics={leetcode.intermediateSkills} />
          <TopicList title='Advanced' topics={leetcode.advancedSkills} />
        </div>
        </section>
      ) : (
        <StatsSectionError
          className='leetcodeSection'
          id='leetcode-stats'
          index='02'
          eyebrow='Problem solving'
          title='LeetCode'
          icon={LEETCODE_ICON}
          message={leetcodeError ?? 'LeetCode data could not be loaded.'}
        />
      )}

      {portfolio ? (
        <section className='statsSection portfolioSection' id='portfolio'>
        <div className='portfolioOverview'>
          <header className='statsSectionHeader portfolioSectionHeader'>
            <div>
              <span>03</span>
              <i className='portfolioSectionIcon'>
                <img src={FOLDER_ICON} alt='' aria-hidden='true' />
              </i>
              <div>
                <p>Body of work</p>
                <h2>Portfolio</h2>
              </div>
            </div>
            <Link className='portfolioProjectsLink' to='/projects'>
              <span>
                <small>Explore my work</small>
                View projects
              </span>
              <svg viewBox='0 0 24 24' aria-hidden='true'>
                <path d='m9 18 6-6-6-6' />
              </svg>
            </Link>
          </header>

          <div className='portfolioMetricGrid'>
            {portfolioMetrics.map((metric) => (
              <article className={`portfolioMetricCard portfolioMetricCard--${metric.type}`} key={metric.type}>
                <i>
                  <PortfolioMetricIcon type={metric.type} />
                </i>
                <span>{metric.label}</span>
                <strong>{formatNumber(metric.value)}</strong>
                <small>{metric.detail}</small>
              </article>
            ))}
          </div>
        </div>

        <div className='statsSplit portfolioStatsSplit'>
          <section className='portfolioPanel'>
            <div className='statsSubheading'>
              <p>Project pipeline</p>
              <h3>Status breakdown</h3>
            </div>
            <div className='statusBreakdown'>
              {portfolio.projectsByStatus.map((item) => (
                <div className={`statusBreakdownItem statusBreakdownItem--${item.status.toLowerCase().replace(/\s+/g, '-')}`} key={item.status}>
                  <span>
                    <i aria-hidden='true' />
                    {item.status}
                  </span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className='portfolioPanel'>
            <div className='statsSubheading'>
              <p>Across projects</p>
              <h3>Most-used technologies</h3>
            </div>
            <div className='technologyRanking'>
              {portfolio.mostUsedTechnologies.map((technology, index) => (
                <div key={technology.name}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{technology.name}</strong>
                  <small>{technology.projectCount} projects</small>
                </div>
              ))}
            </div>
          </section>
        </div>
        </section>
      ) : (
        <StatsSectionError
          className='portfolioSection'
          id='portfolio'
          index='03'
          eyebrow='Body of work'
          title='Portfolio'
          icon={FOLDER_ICON}
          message={portfolioError ?? 'Portfolio data could not be loaded.'}
        />
      )}

      <button className='statsBackToTop' type='button' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label='Back to top'>
        <span>Back to top</span>
        <svg viewBox='0 0 24 24' aria-hidden='true'>
          <path d='m6 15 6-6 6 6' />
        </svg>
      </button>
    </main>
  );
}

export default Stats;
