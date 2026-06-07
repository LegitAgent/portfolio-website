import './Certificates.css';
import { CLOUDFLARE_GATEWAY } from '../../config/constants.ts';
import CertificateDisplay from '../../components/CertificateDisplay/CertificateDisplay.tsx';
import LoadingScreen from '../Misc/LoadingScreen.tsx';
import ErrorScreen from '../Misc/ErrorScreen.tsx';
import type { CertificateResponse } from '../../types/certificate.ts';

import { useState, useEffect } from 'react';

const certificateGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/certificates'; // path to certificates db

function Certificates() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [certificates, setCertificates] = useState<CertificateResponse | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    fetch(certificateGatewayURL)
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
      <div className='flex items-center justify-center text-7xl'>Certificates</div>
      <div className='certificateBox'>
        <div className='certificateList'>
          {certificates?.certificates?.map((certificateStuff) => {
            return (
              <CertificateDisplay key={certificateStuff.id} certificate={certificateStuff}/>
            );
          })}

        </div>
      </div>
    </>
  );
}

export default Certificates;
