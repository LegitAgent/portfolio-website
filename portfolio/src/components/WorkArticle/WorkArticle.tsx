import './WorkArticle.css';
import { CLOUDFLARE_GATEWAY, CLOUDFLARE_R2_BUCKET } from '../../imports/constants';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Tag } from '../ProjectArticle/ProjectArticle.tsx';
import LoadingScreen from '../../pages/Misc/LoadingScreen.tsx';
import ErrorScreen from '../../pages/Misc/ErrorScreen.tsx';
import WrongPage from '../../pages/Misc/WrongPage.tsx';

interface WorkArticle {
  article_title: string;
  article_summary: string | null;
  article_content: string;
  article_image_url: string | null;
  responsibilities: string | null;
  achievements: string | null;
  company_name: string;
  role_title: string;
  company_website: string | null;
  work_slug: string;
}

interface WorkResponse {
  results : WorkArticle[];
  tags: Tag[];
}

function WorkArticle() {
  const navigate = useNavigate();

  const slug = useParams();
  const workArticleGateway = CLOUDFLARE_GATEWAY + 'api/work_articles/' + slug.slug;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [article, setArticle] = useState<WorkResponse | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    fetch(workArticleGateway)
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
  }, [workArticleGateway]);

  if (hasError) {
    return (<ErrorScreen />);
  }

  if (article?.results.length === 0) {
    return (<WrongPage />);
  }

  if (isLoading) {
    return (<LoadingScreen />);
  }
  
  const articleContent = article?.results[0];
  const articleSkills = article?.tags;

  const imageURL = CLOUDFLARE_R2_BUCKET + articleContent?.article_image_url; // TODO

  return (
    <section className='workArticleContainer'>
      <img src={imageURL} alt={articleContent?.article_title} />
      {articleContent?.article_title}
      <div className='techStacks'>
        {articleSkills?.map((skill) => {
          return (
            <div className='techStackButton' key={skill.tag_name}>
              {skill.tag_name}
            </div>
          );
        })}
      </div>
      <button className='text-2xl' onClick={() => navigate(-1)}>Back</button> 
    </section>
  );
}

export default WorkArticle;