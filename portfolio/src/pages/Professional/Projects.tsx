import './Projects.css';
import { CLOUDFLARE_GATEWAY } from '../../imports/constants.ts';
import ProjectsDisplay from '../../components/ProjectsDisplay/ProjectsDisplay.tsx';

import { useState, useEffect } from 'react';

export interface Project {
  project_name: string;
  project_description: string;
  project_img_url: string;
  project_link: string;
}

interface ProjectResponse {
  results: Project[];
}

const projectGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/projects'; // path to project db

function Projects() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<ProjectResponse | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    fetch(projectGatewayURL) // testing url
    .then((data) => data.json())
    .then((json) => {
      setProjects(json);
      setIsLoading(false);
    })
    .catch(() => {
      setHasError(true);
    });
  }, []);
  
  if(hasError) {
    return (<div className="flex items-center justify-center text-9xl">ERROR, please refresh the page</div>);
  }

  if(isLoading) {
    return (<div className="flex items-center justify-center text-9xl">Nothing to see here</div>);
  }
  
  return (
    <>
      <div className="flex items-center justify-center text-9xl">Projects</div>
      <div className="projectList">
        {projects?.results?.map((projectStuff) => {
          return (
            <ProjectsDisplay key={projectStuff.project_name} project={projectStuff}/>
          );
        })}

      </div>
    </>
  );
}

export default Projects;
