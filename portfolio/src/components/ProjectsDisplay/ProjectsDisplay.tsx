import './ProjectsDisplay.css';
import type { ProjectDisplayProps } from '../../types/project.ts';
import { Link } from 'react-router-dom';
import { CLOUDFLARE_R2_BUCKET, GITHUB_ICON } from '../../config/constants.ts';

function ProjectsDisplay({ project }: ProjectDisplayProps) {
  const imageUrl = new URL(project.project_img_url, CLOUDFLARE_R2_BUCKET).toString();
  const isFeatured = Number(project.featured) === 1;
  const dateLabel = [project.started_at, project.ended_at].filter(Boolean).join(' - ');
  const statusClassName = `projectStatus projectStatus--${project.status.toLowerCase()}`;

  return (
    <article className={isFeatured ? 'projectDisplay is-featured' : 'projectDisplay'}>
      <Link className='projectImageLink' to={`/projects/${project.pArticle_slug}`} aria-label={`Read about ${project.project_name}`}>
        <img className='projectImage' src={imageUrl} alt={project.project_name} decoding='async' loading='lazy'/>
        <span className='projectImageShade' aria-hidden='true' />
        {isFeatured && <span className='projectFeaturedLabel'>Featured</span>}
      </Link>

      <div className='projectContent'>
        <div className='projectTitleRow'>
          <h3>{project.project_name}</h3>
          {dateLabel && <span>{dateLabel}</span>}
        </div>

        <div className={statusClassName} aria-label={`Project status: ${project.status}`}>
          <span aria-hidden='true' />
          {project.status}
        </div>

        <p className='projectDescription'>{project.project_description}</p>

        <div className='projectLinks'>
          <a href={project.project_github} target='_blank' rel='noreferrer'>
            <img className='projectGithubIcon' src={GITHUB_ICON} alt='' aria-hidden='true' />
            <span>GitHub</span>
          </a>

          {project.live_url && (
            <a href={project.live_url} target='_blank' rel='noreferrer'>
              <svg viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M14 5h5v5' />
                <path d='m10 14 9-9' />
                <path d='M19 13v6H5V5h6' />
              </svg>
              <span>Live</span>
            </a>
          )}

          {project.pArticle_slug && (
            <Link className='projectLink' to={`/projects/${project.pArticle_slug}`} aria-label={`Read more about ${project.project_name}`}>
              <span>Read More</span>
              <svg viewBox='0 0 24 24' aria-hidden='true'>
                <path d='m9 18 6-6-6-6' />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectsDisplay;
