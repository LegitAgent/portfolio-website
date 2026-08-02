import './WorkArticle.css';
import { CLOUDFLARE_GATEWAY } from '../../config/constants.ts';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import LoadingScreen from '../../pages/Misc/LoadingScreen.tsx';
import ErrorScreen from '../../pages/Misc/ErrorScreen.tsx';
import WrongPage from '../../pages/Misc/WrongPage.tsx';
import type { WorkResponse } from '../../types/work.ts';
import ArticleGallery from '../ArticleGallery/ArticleGallery.tsx';

interface WorkSection {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
}

function getBulletItems(content: string): string[] {
  return content
    .replace(/\\n/g, '\n')
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);
}

function getArticleParagraphs(content: string): string[] {
  return content
    .replace(/\\n\\n/g, '\n\n')
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.replace(/\s*\r?\n\s*/g, ' ').trim())
    .filter(Boolean);
}

function formatWorkDate(value: string): string {
  const [year, month] = value.split('-').map(Number);
  if (!year || !month) {
    return value;
  }

  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

function WorkArticle() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const workArticleGateway = CLOUDFLARE_GATEWAY + 'api/db/work_articles/' + slug;

  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<WorkResponse | null>(null);
  const [hasError, setHasError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    fetch(workArticleGateway)
      .then((response) => {
        if (response.status === 404) {
          setNotFound(true);
          return null;
        }

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
  }, [workArticleGateway]);

  useEffect(() => {
    if (!article) {
      return;
    }

    let animationFrameId = 0;

    const updateProgress = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;

        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`;
        }
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [article]);

  useEffect(() => {
    if (isLoading || !article) {
      return;
    }

    const revealItems = document.querySelectorAll<HTMLElement>('[data-work-article-reveal]');
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
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [article, isLoading]);

  if (hasError) {
    return <ErrorScreen />;
  }

  if (notFound) {
    return <WrongPage />;
  }

  if (isLoading || !article?.article) {
    return <LoadingScreen />;
  }

  const articleContent = article.article;
  const articleSkills = Array.isArray(article.tags) ? article.tags : [];
  const articleImages = Array.isArray(articleContent.images) ? articleContent.images : [];
  const galleryImagePaths =
    articleImages.length > 0
      ? articleImages
      : articleContent.article_image_url
        ? [articleContent.article_image_url]
        : [];
  const galleryR2Url = articleImages.length > 0 ? articleContent.r2_url : '';
  const workPeriod = `${formatWorkDate(articleContent.start_date)} — ${articleContent.is_current ? 'Present' : articleContent.end_date ? formatWorkDate(articleContent.end_date) : 'Present'}`;

  const sections: WorkSection[] = [
    {
      id: 'experience',
      number: '01',
      eyebrow: 'The experience',
      title: 'Role overview',
      paragraphs: articleContent.article_content ? getArticleParagraphs(articleContent.article_content) : [],
    },
    {
      id: 'responsibilities',
      number: '02',
      eyebrow: 'Scope of work',
      title: 'Responsibilities',
      items: articleContent.responsibilities ? getBulletItems(articleContent.responsibilities) : [],
    },
    {
      id: 'achievements',
      number: '03',
      eyebrow: 'Outcomes',
      title: 'Achievements',
      items: articleContent.achievements ? getBulletItems(articleContent.achievements) : [],
    },
  ].filter((section) => (section.paragraphs?.length ?? 0) > 0 || (section.items?.length ?? 0) > 0);

  return (
    <article className='workArticlePage'>
      <div className='workArticleProgress' aria-hidden='true'>
        <span ref={progressRef} />
      </div>

      <nav className='workArticleTopbar' aria-label='Article navigation'>
        <button className='workArticleBack' onClick={() => navigate('/skills_experience')}>
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='m15 18-6-6 6-6' />
          </svg>
          <span>Back to experience</span>
        </button>

        <div className='workArticleRoute' aria-label={`Current route: skills experience/${articleContent.work_slug}`}>
          <span className='workArticleRoutePulse' aria-hidden='true' />
          <span>/skills_experience/</span>
          <strong>{articleContent.work_slug}</strong>
        </div>
      </nav>

      <ArticleGallery
        articleTitle={articleContent.article_title}
        imagePaths={galleryImagePaths}
        key={articleContent.work_slug}
        r2Url={galleryR2Url}
      />

      <header className='workArticleHero'>
        <div className='workArticleHeroCopy'>
          <div className='workArticleLabels'>
            <span className='workArticleExperienceLabel'>
              <i aria-hidden='true' />
              {articleContent.employment_type}
            </span>
            <span className='workArticleCompanyLabel'>{articleContent.company_name}</span>
          </div>

          <p className='workArticleKicker'>Inside the role</p>
          <h1>{articleContent.article_title}</h1>
          <p className='workArticleRole'>{articleContent.role_title}</p>
          {articleContent.article_summary && <p className='workArticleSummary'>{articleContent.article_summary}</p>}

          <div className='workArticleMeta'>
            <div>
              <span>Period</span>
              <strong>{workPeriod}</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>{articleContent.location ?? 'Not listed'}</strong>
            </div>
            <div>
              <span>Stack</span>
              <strong>{articleSkills.length} technologies</strong>
            </div>
          </div>

          {articleContent.company_website && (
            <div className='workArticleActions'>
              <a href={articleContent.company_website} target='_blank' rel='noreferrer'>
                <span>Visit company website</span>
                <svg viewBox='0 0 24 24' aria-hidden='true'>
                  <path d='M14 5h5v5' />
                  <path d='m10 14 9-9' />
                  <path d='M19 13v6H5V5h6' />
                </svg>
              </a>
            </div>
          )}
        </div>
      </header>

      {articleSkills.length > 0 && (
        <section className='workArticleStack workArticleReveal' data-work-article-reveal aria-labelledby='work-article-stack-title'>
          <h2 id='work-article-stack-title'>Worked with</h2>
          <div>
            {articleSkills.map((skill) => (
              <span className='workArticleTech' key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className='workArticleLayout'>
        <aside className='workArticleAside'>
          <p>On this page</p>
          <nav aria-label='Article sections'>
            {sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                <span>{section.number}</span>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className='workArticleSections'>
          {sections.map((section) => (
            <section className='workArticleSection workArticleReveal' data-work-article-reveal id={section.id} key={section.id}>
              <header>
                <span>{section.number}</span>
                <div>
                  <p>{section.eyebrow}</p>
                  <h2>{section.title}</h2>
                </div>
              </header>

              {section.paragraphs && (
                <div className='workArticleSectionContent'>
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.id}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              )}

              {section.items && (
                <ol className='workArticleList'>
                  {section.items.map((item, index) => (
                    <li key={`${section.id}-${index}`}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <p>{item}</p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>
      </div>

      <footer className='workArticleFooter workArticleReveal' data-work-article-reveal>
        <div>
          <p>End of experience</p>
          <h2>That’s my time at {articleContent.company_name}.</h2>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='m6 15 6-6 6 6' />
          </svg>
        </button>
      </footer>
    </article>
  );
}

export default WorkArticle;
