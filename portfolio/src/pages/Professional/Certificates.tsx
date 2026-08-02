import './Certificates.css';
import { CLOUDFLARE_GATEWAY } from '../../config/constants.ts';
import CertificateDisplay from '../../components/CertificateDisplay/CertificateDisplay.tsx';
import LoadingScreen from '../Misc/LoadingScreen.tsx';
import ErrorScreen from '../Misc/ErrorScreen.tsx';
import type { CertificateResponse } from '../../types/certificate.ts';
import Fuse from 'fuse.js';
import { useState, useEffect, useMemo } from 'react';

const certificateGatewayURL = `${CLOUDFLARE_GATEWAY}api/db/certificates`;

function Certificates() {
  const [isLoading, setIsLoading] = useState(true);
  const [certificates, setCertificates] = useState<CertificateResponse | null>(null);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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


  const certificateResults = useMemo(() => certificates?.certificates ?? [], [certificates?.certificates]);
  const certificateSearch = useMemo(() => 
    new Fuse(certificateResults, {
      keys: [
        { name: 'title', weight: 0.45 },
        { name: 'issuer', weight: 0.25 },
        { name: 'skills', weight: 0.2 },
        { name: 'description', weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
      shouldSort: true,
    }),
    [certificateResults]
  );
  
  const filteredCertificates = useMemo(() => {
    const query = searchQuery.trim();
    return query ? certificateSearch.search(query).map((result) => result.item) : certificateResults;
  }, [certificateSearch, certificateResults, searchQuery]);

  if (hasError) {
    return <ErrorScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className='certificatesPage'>
      <header className='certificatesHeader'>
        <h1>Certificates</h1>
        <span>Courses and credentials I have completed while developing my technical knowledge across software, cloud, and computer science.</span>
      </header>

      <div className='certificateSearch'>
        <svg viewBox='0 0 24 24' aria-hidden='true'>
          <circle cx='11' cy='11' r='7' />
          <path d='m20 20-4-4' />
        </svg>
        <input
          type='search'
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder='Search certificates...'
          aria-label='Search certificates'
        />
        {searchQuery && (
          <button type='button' onClick={() => setSearchQuery('')} aria-label='Clear certificate search'>
            <svg viewBox='0 0 24 24' aria-hidden='true'>
              <path d='m7 7 10 10' />
              <path d='M17 7 7 17' />
            </svg>
          </button>
        )}
      </div>

      {filteredCertificates.length === 0 ? (
        <div className='certificateSearchEmpty'>
          <p>No certificates found.</p>
          <span>Try a different title, issuer, or skill.</span>
        </div>
      ) : (
        <section className='certificatesSection'>
          <div className='certificatesSectionHeading'>
            <div>
              <span>01</span>
              <h2>Credentials</h2>
            </div>
            <p>{filteredCertificates.length} certificates</p>
          </div>

          <div className='certificateList'>
            {filteredCertificates.map((certificate) => (
              <CertificateDisplay key={certificate.id} certificate={certificate} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Certificates;
