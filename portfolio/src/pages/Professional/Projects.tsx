import './Projects.css';

import { useState, useEffect } from 'react';

interface ProjectResponse {
  message: string
}

function Projects() {
  const [isLoading, setIsLoading] = useState(true);
  const [testing, setTesting] = useState<ProjectResponse | null>(null);

  useEffect(() => {
    fetch('https://z4xczkan20.execute-api.ap-southeast-1.amazonaws.com/projects') // testing url
    .then((data) => data.json())
    .then((json) => {
      setTesting(json);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error(error);
    });
  }, []);

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
