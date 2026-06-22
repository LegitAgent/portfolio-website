import './ProjectArticle.css';
import { CLOUDFLARE_GATEWAY, CLOUDFLARE_R2_BUCKET, GITHUB_ICON } from '../../config/constants.ts';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../pages/Misc/LoadingScreen.tsx';
import ErrorScreen from '../../pages/Misc/ErrorScreen.tsx';
import WrongPage from '../../pages/Misc/WrongPage.tsx';
import type { ArticleResponse } from '../../types/project.ts';

interface ArticleSection {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  content: string;
}

function getParagraphs(content: string): string[] {
  // either via blank line or a literal \n\n in the DB data
  return content
    .replace(/\\n\\n/g, '\n\n')
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.replace(/\s*\r?\n\s*/g, ' ').trim())
    .filter(Boolean);
}

function ProjectArticle() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const articleGateway = `${CLOUDFLARE_GATEWAY}api/project_articles/${slug ?? ''}`;

  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<ArticleResponse | null>(null);
  const [hasError, setHasError] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // fetching from API
  useEffect(() => {
    fetch(articleGateway)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setArticle(json);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  }, [articleGateway]);

  // the scroll bar above
  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  // animation as it renders into viewport
  useEffect(() => {
    if (isLoading || !article) {
      return;
    }

    const revealItems = document.querySelectorAll<HTMLElement>('[data-article-reveal]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [article, isLoading]);

  const articleContent = article?.results[0];

  // for rendering the side sections
  const sections: ArticleSection[] = articleContent
    ? [
        {
          id: 'overview',
          number: '01',
          eyebrow: 'The project',
          title: 'Overview',
          content: articleContent.pArticle_overview ?? '',
        },
        {
          id: 'implementation',
          number: '02',
          eyebrow: 'Under the hood',
          title: 'How it works',
          content: articleContent.pArticle_content ?? '',
        },
        {
          id: 'challenges',
          number: '03',
          eyebrow: 'Problem solving',
          title: 'Challenges',
          content: articleContent.pArticle_challenges ?? '',
        },
        {
          id: 'lessons',
          number: '04',
          eyebrow: 'Takeaways',
          title: 'What I learned',
          content: articleContent.pArticle_lessons ?? '',
        },
        {
          id: 'future-work',
          number: '05',
          eyebrow: 'What comes next',
          title: 'Future work',
          content: articleContent.pArticle_future_work ?? '',
        },
      ].filter((section) => section.content.trim().length > 0)
    : [];

  if (hasError) {
    return <ErrorScreen />;
  }

  if (!isLoading && !articleContent) {
    return <WrongPage />;
  }

  if (isLoading || !articleContent) {
    return <LoadingScreen />;
  }

  const imageUrl = articleContent.pArticle_image_url
    ? new URL(articleContent.pArticle_image_url, CLOUDFLARE_R2_BUCKET).toString()
    : null;
  const statusClassName = `projectArticleStatus projectArticleStatus--${articleContent.status.toLowerCase()}`;
  const isFeatured = Number(articleContent.featured) === 1;

  return (
    <article className="projectArticlePage">
      <div className="projectArticleProgress" aria-hidden="true">
        <span style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>

      <nav className="projectArticleTopbar" aria-label="Article navigation">
        <button className="projectArticleBack" onClick={() => navigate('/projects')}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Back to projects</span>
        </button>

        <div className="projectArticleRoute" aria-label={`Current route: projects/${articleContent.pArticle_slug}`}>
          <span className="projectArticleRoutePulse" aria-hidden="true" />
          <span>/projects/</span>
          <strong>{articleContent.pArticle_slug}</strong>
        </div>
      </nav>

      <div className={isFeatured ? 'projectArticleVisual is-featured' : 'projectArticleVisual'}>
        {imageUrl ? (
          <img src={imageUrl} alt={articleContent.pArticle_image_alt ?? articleContent.project_name} />
        ) : (
          <div className="projectArticleFallback" aria-hidden="true">
            <span>&lt;/&gt;</span>
            <p>PROJECT_PREVIEW</p>
          </div>
        )}
        {isFeatured && <span className="projectArticleImageFeatured">Featured project</span>}
      </div>

      <header className="projectArticleHero">
        <div className="projectArticleHeroCopy">
          <div className="projectArticleLabels">
            <span className={statusClassName}>
              <i aria-hidden="true" />
              {articleContent.status}
            </span>
            {isFeatured && <span className="projectArticleFeatured">Featured project</span>}
          </div>

          <p className="projectArticleKicker">About the Project</p>
          <h1>{articleContent.project_name}</h1>
          {articleContent.pArticle_summary && <p className="projectArticleSummary">{articleContent.pArticle_summary}</p>}

          <div className="projectArticleMeta">
            <div>
              <span>Started</span>
              <strong>{articleContent.started_at}</strong>
            </div>
            <div>
              <span>Stack</span>
              <strong>{article.tags.length} technologies</strong>
            </div>
            <div>
              <span>Sections</span>
              <strong>{sections.length} chapters</strong>
            </div>
          </div>

          <div className="projectArticleActions">
            <a className="resumeAction" href={articleContent.project_github} target="_blank" rel="noreferrer">
              <img className="projectArticleGithubIcon" src={GITHUB_ICON} alt="" aria-hidden="true" />
              <span>View source</span>
            </a>
            {articleContent.live_url && (
              <a className="resumeAction resumeAction--primary" href={articleContent.live_url} target="_blank" rel="noreferrer">
                <span>Open live project</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 5h5v5" />
                  <path d="m10 14 9-9" />
                  <path d="M19 13v6H5V5h6" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </header>

      <section className="projectArticleStack projectArticleReveal" data-article-reveal aria-labelledby="project-article-stack-title">
        <h2 id="project-article-stack-title">Built with</h2>
        <div>
          {article.tags.map((skill) => (
            <span className="projectArticleTech" key={skill.tag_name}>
              {skill.tag_name}
            </span>
          ))}
        </div>
      </section>

      <div className="projectArticleLayout">
        <aside className="projectArticleAside">
          <p>On this page</p>
          <nav aria-label="Article sections">
            {sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                <span>{section.number}</span>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="projectArticleSections">
          {sections.map((section) => (
            <section className="projectArticleSection projectArticleReveal" data-article-reveal id={section.id} key={section.id}>
              <header>
                <span>{section.number}</span>
                <div>
                  <p>{section.eyebrow}</p>
                  <h2>{section.title}</h2>
                </div>
              </header>
              <div className="projectArticleSectionContent">
                {getParagraphs(section.content).map((paragraph, index) => (
                  <p key={`${section.id}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <footer className="projectArticleFooter projectArticleReveal" data-article-reveal>
        <div>
          <p>End of Project</p>
          <h2>That's all for {articleContent.project_name}! Thanks.</h2>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 15 6-6 6 6" />
          </svg>
        </button>
      </footer>
    </article>
  );
}

export default ProjectArticle;
