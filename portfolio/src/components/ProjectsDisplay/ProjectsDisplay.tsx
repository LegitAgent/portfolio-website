import './ProjectsDisplay.css';
import type { Project } from '../../pages/Professional/Projects';
import { CLOUDFLARE_R2_BUCKET } from '../../imports/constants';

interface ProjectDisplayProps {
  project: Project;
}

function ProjectsDisplay({project}: ProjectDisplayProps) {
  const imageUrl = new URL(project.project_img_url, CLOUDFLARE_R2_BUCKET).toString();

  return(
    <div className='projectDisplay'>
      <img className='projectImage' src={imageUrl} alt={project.project_name}/>
      {project.project_name}
      <br />
      {project.project_description}
      <a href={project.project_link} target="_blank" rel="noreferrer"> link</a>
    </div>
  );
}

export default ProjectsDisplay;