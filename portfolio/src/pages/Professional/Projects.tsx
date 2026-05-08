import './Projects.css';
import { CLOUDFLARE_GATEWAY, CLOUDFLARE_R2_BUCKET } from '../../imports/constants';

import { useState, useEffect } from 'react';

// test                                                                                                                                                                                                 
interface Project {
  project_name: string;
  project_description: string;
  project_img_url: string;
  project_link: string;
}

interface ProjectResponse {
  results: Project[];
}

const projectGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/projects';

function Projects() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [testing, setTesting] = useState<ProjectResponse | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    fetch(projectGatewayURL) // testing url
    .then((data) => data.json())
    .then((json) => {
      setTesting(json);
      setIsLoading(false);
    })
    .catch(() => {
      setHasError(true);
    });
  }, []);

  console.log(testing);
  
  if(hasError) {
    return (<div className="flex items-center justify-center text-9xl">ERROR, please refresh the page</div>);
  }

  if(isLoading) {
    return (<div className="flex items-center justify-center text-9xl">Nothing to see here</div>);
  }

  return (
    <>
      <div className="flex items-center justify-center text-9xl">Projects</div>
      <div className="flex items-center justify-center text-7xl">
        <img src={CLOUDFLARE_R2_BUCKET + '/Projects/testing.jpg'} />
        {testing?.results[0]?.project_description}
      </div>
    </>
  );
}

export default Projects;
