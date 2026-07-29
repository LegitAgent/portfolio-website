import './WorkArticle.css';
import { CLOUDFLARE_GATEWAY, CLOUDFLARE_R2_BUCKET } from '../../config/constants.ts';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../pages/Misc/LoadingScreen.tsx';
import ErrorScreen from '../../pages/Misc/ErrorScreen.tsx';
import WrongPage from '../../pages/Misc/WrongPage.tsx';
import type { WorkResponse } from '../../types/work.ts';

function getBulletItems(content: string): string[] {
  return content
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);
}

function getArticleParagraphs(content: string): string[] {
  return content
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.replace(/\s*\r?\n\s*/g, ' ').trim())
    .filter(Boolean);
}

function WorkArticle() {
  const navigate = useNavigate();

  const slug = useParams();
  const workArticleGateway = CLOUDFLARE_GATEWAY + 'api/work_articles/' + slug.slug;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [article, setArticle] = useState<WorkResponse | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

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

  if (hasError) {
    return <ErrorScreen />;
  }

  if (notFound) {
    return <WrongPage />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  const articleContent = article?.article;
  const articleSkills = article?.tags;

  const imageURL = articleContent?.article_image_url ? CLOUDFLARE_R2_BUCKET + articleContent.article_image_url : null;

  return (
    <section className='workArticleContainer'>
      <nav className='workArticleNav' aria-label='Article navigation'>
        <button className='workArticleBack' onClick={() => navigate(-1)}>
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='m15 18-6-6 6-6' />
          </svg>
          <span>Back to experience</span>
        </button>
      </nav>

      <header className='workArticleHeader'>
        <p className='workArticleEyebrow'>{articleContent?.company_name}</p>
        <h1>{articleContent?.article_title}</h1>
        <p className='workArticleRole'>{articleContent?.role_title}</p>
        {articleContent?.article_summary && <p className='workArticleSummary'>{articleContent.article_summary}</p>}

        <div className='workArticleMeta'>
          <div className='techStacks' aria-label='Technologies used'>
            {articleSkills?.map((skill) => (
              <span className='techStackButton' key={skill.tag_name}>
                {skill.tag_name}
              </span>
            ))}
          </div>

          {articleContent?.company_website && (
            <a className='workArticleCompanyLink' href={articleContent.company_website} target='_blank' rel='noreferrer'>
              <span>Company website</span>
              <svg viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M14 5h5v5' />
                <path d='m10 14 9-9' />
                <path d='M19 13v6H5V5h6' />
              </svg>
            </a>
          )}
        </div>
      </header>

      {imageURL && (
        <figure className='workArticleImage'>
          <img src={imageURL} alt={articleContent?.article_title ?? ''} />
        </figure>
      )}

      <div className='workArticleBody'>
        <article className='workArticleContent'>
          {articleContent?.article_content &&
            getArticleParagraphs(articleContent.article_content).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </article>
      </div>

      {(articleContent?.responsibilities || articleContent?.achievements) && (
        <div className='workArticleHighlights'>
          {articleContent.responsibilities && (
            <section className='workArticleHighlightSection'>
              <header>
                <span className='workArticleSectionNumber'>01</span>
                <div>
                  <p>Scope of work</p>
                  <h2>Responsibilities</h2>
                </div>
              </header>
              <ul>
                {getBulletItems(articleContent.responsibilities).map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
            </section>
          )}

          {articleContent.achievements && (
            <section className='workArticleHighlightSection'>
              <header>
                <span className='workArticleSectionNumber'>02</span>
                <div>
                  <p>Outcomes</p>
                  <h2>Achievements</h2>
                </div>
              </header>
              <ul>
                {getBulletItems(articleContent.achievements).map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </section>
  );
}

export default WorkArticle;
