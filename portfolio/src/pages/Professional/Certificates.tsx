import './Certificates.css';
import { CLOUDFLARE_GATEWAY } from '../../imports/constants.ts';
import ProjectsDisplay from '../../components/ProjectsDisplay/ProjectsDisplay.tsx';
import LoadingScreen from '../Misc/LoadingScreen.tsx';
import ErrorScreen from '../Misc/ErrorScreen.tsx';

import { useState, useEffect } from 'react';

export interface Certificate {
  project_name: string;
  project_description: string;
  project_github: string;
  project_img_url: string;
  pArticle_slug: string;
}

interface CertificateResponse {
  results: Certificate[];
}

const projectGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/projects'; // path to project db

function Certificates() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [certificates, setCertificates] = useState<CertificateResponse | null>(null);
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
      setCertificates(json);
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
          {certificates?.results?.map((certificateStuff) => {
            return (
              <ProjectsDisplay key={certificateStuff.project_name} project={certificateStuff}/>
            );
          })}

        </div>
      </div>
    </>
  );
}

export default Certificates;
