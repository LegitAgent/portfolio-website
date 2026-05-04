import './Projects.css';
import { AWS_API_GATEWAY } from '../../imports/constants';

import { useState, useEffect } from 'react';

interface ProjectResponse {
  message: string
}

const projectGatewayURL = AWS_API_GATEWAY + '/projects';

function Projects() {
  const [isLoading, setIsLoading] = useState(true);
  const [testing, setTesting] = useState<ProjectResponse | null>(null);
  const [hasError, setHasError] = useState(false);



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
  
  if(hasError) {
    return (<div className="flex items-center justify-center text-9xl">ERROR, please refresh the page</div>);
  }

  if(isLoading) {
    return (<div className="flex items-center justify-center text-9xl">Nothing to see here</div>);
  }

  return (
    <>
      <div className="flex items-center justify-center text-9xl">Projects</div>
      <div className="flex items-center justify-center text-7xl">{testing?.message}</div>
    </>
  );
}

export default Projects;
