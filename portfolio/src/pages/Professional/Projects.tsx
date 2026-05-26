import './Projects.css';
import { CLOUDFLARE_GATEWAY } from '../../imports/constants.ts';
import ProjectsDisplay from '../../components/ProjectsDisplay/ProjectsDisplay.tsx';
import LoadingScreen from '../Misc/LoadingScreen.tsx';
import ErrorScreen from '../Misc/ErrorScreen.tsx';

import { useState, useEffect } from 'react';

export interface Project {
  project_name: string;
  project_description: string;
  project_github: string;
  project_img_url: string;
  pArticle_slug: string;
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
    fetch(projectGatewayURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      setProjects(json);
      setIsLoading(false);
    })
    .catch(() => {
      setHasError(true);
      setIsLoading(false);
    });
  }, []);

  if(hasError) {
    return (<ErrorScreen />);
  }

  if(isLoading) {
    return (<LoadingScreen />);
  }
  
  return (
    <>
      <div className="flex items-center justify-center text-7xl">Projects</div>
      <div className='projectBox'>
        <div className="projectList">
          {projects?.results?.map((projectStuff) => {
            return (
              <ProjectsDisplay key={projectStuff.project_name} project={projectStuff}/>
            );
          })}

        </div>
      </div>
    </>
  );
}

export default Projects;
