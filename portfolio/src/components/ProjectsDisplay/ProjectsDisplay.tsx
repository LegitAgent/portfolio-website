import './ProjectsDisplay.css';
import type { Project } from '../../pages/Professional/Projects';
import { CLOUDFLARE_R2_BUCKET } from '../../imports/constants';

interface ProjectDisplayProps {
  project: Project;
}

function ProjectsDisplay({project}: ProjectDisplayProps) {
  const imageUrl = new URL(project.project_img_url, CLOUDFLARE_R2_BUCKET).toString();
  console.log(imageUrl);

  return(
    <div className='projectDisplay'>
      {project.project_name}
      <br />
      {project.project_description}
      <img src={imageUrl} alt={project.project_name}/>
      <a href={project.project_link} target="_blank" rel="noreferrer"> link</a>
    </div>
  );
}

export default ProjectsDisplay;