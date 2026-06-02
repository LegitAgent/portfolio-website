import './ProjectsDisplay.css';
import type { Project } from '../../pages/Professional/Projects.tsx';
import { Link } from 'react-router-dom';
import { CLOUDFLARE_R2_BUCKET } from '../../imports/constants.ts';

interface ProjectDisplayProps {
  project: Project;
}

function ProjectsDisplay({project}: ProjectDisplayProps) {
  const imageUrl = new URL(project.project_img_url, CLOUDFLARE_R2_BUCKET).toString();

  return(
    <div className='projectDisplay'>
      <img className='projectImage' src={imageUrl} alt={project.project_name}/>
      <p className='title'>{project.project_name}</p>
      <div className='textContent'>
        <p className='description'>{project.project_description}</p>
        <div className='links'>
          <a href={project.project_github} target='_blank' rel='noreferrer'>Github</a>
          <Link className="projectLink" to={`/projects/${project.pArticle_slug}`} aria-label="Article" >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectsDisplay;