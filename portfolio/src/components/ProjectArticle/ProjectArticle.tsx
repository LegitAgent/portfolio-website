import './ProjectArticle.css';
import { CLOUDFLARE_GATEWAY, CLOUDFLARE_R2_BUCKET } from '../../config/constants.ts';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../pages/Misc/LoadingScreen.tsx';
import ErrorScreen from '../../pages/Misc/ErrorScreen.tsx';
import WrongPage from '../../pages/Misc/WrongPage.tsx';
import type { ArticleResponse } from '../../types/project.ts';


function ProjectArticle() {
  const navigate = useNavigate();

  const slug = useParams();
  const articleGateway = CLOUDFLARE_GATEWAY + 'api/project_articles/' + slug.slug;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [article, setArticle] = useState<ArticleResponse | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

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

  const imageURL = CLOUDFLARE_R2_BUCKET + articleContent?.pArticle_image_url;

  return (
    <div className='body'>
      <img className='projectArticleImage' src={imageURL} alt={articleContent?.pArticle_title} />
      <p className='articleHeader'>
        {articleContent?.pArticle_title}
      </p>
      <div className='techStacks'>
        {articleSkills?.map((skill) => {
          return (
            <div className='techStackButton' key={skill.tag_name}>
              {skill.tag_name}
            </div>
          );
        })}
      </div>
      <div className='content'>
        {articleContent?.pArticle_content}
      </div>
      <button className='text-2xl' onClick={() => navigate(-1)}>Back</button> 
    </div>
  );
}

export default ProjectArticle;
