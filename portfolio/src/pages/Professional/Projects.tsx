import './Projects.css';
import { CLOUDFLARE_GATEWAY } from '../../imports/constants';

import { useState, useEffect } from 'react';

// https://stackoverflow.com/questions/25469244/how-can-i-define-an-interface-for-an-array-of-objects
interface Project {
  CustomerId: number;
  CompanyName: string;
  ContactName: string;
}

interface ProjectResponse {
  projects: Project[];
}

const projectGatewayURL = CLOUDFLARE_GATEWAY + 'api/beverages';

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
      <div className="flex items-center justify-center text-7xl">{testing?.results[0]?.CustomerId}</div>
    </>
  );
}

export default Projects;
