import './CertificateDisplay.css';
import type { Certificate } from '../../types/certificate.ts';
import { CLOUDFLARE_R2_BUCKET } from '../../config/constants.ts';

function formatCertificateDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function CertificateDisplay({ certificate }: { certificate: Certificate }) {
  const imageUrl = new URL(certificate.image_url, CLOUDFLARE_R2_BUCKET).toString();
  const skills = certificate.skills.split(/\s+/).filter(Boolean);

  return (
    <article className='certificateDisplay'>
      <a
        className='certificateImageLink'
        href={certificate.certificate_url}
        target='_blank'
        rel='noreferrer'
        aria-label={`Open ${certificate.title} certificate`}
      >
        <img className='certificateImage' src={imageUrl} alt={certificate.image_alt} />
        <span className='certificateImageShade' aria-hidden='true' />
      </a>

      <div className='certificateContent'>
        <div className='certificateTitleRow'>
          <h3>{certificate.title}</h3>
          <span>{formatCertificateDate(certificate.completion_date)}</span>
        </div>

        <p className='certificateIssuer'>Issued by {certificate.issuer}</p>
        <p className='certificateDescription'>{certificate.description}</p>

        {skills.length > 0 && (
          <div className='certificateSkills' aria-label='Certificate skills'>
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        )}

        <div className='certificateLinks'>
          {certificate.credential_url && (
            <a href={certificate.credential_url} target='_blank' rel='noreferrer'>
              <svg viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M9 12.75 11.25 15 15 9.75' />
                <circle cx='12' cy='12' r='8' />
              </svg>
              <span>Credential</span>
            </a>
          )}

          <a className='certificateLink' href={certificate.certificate_url} target='_blank' rel='noreferrer'>
            <span>Open PDF</span>
            <svg viewBox='0 0 24 24' aria-hidden='true'>
              <path d='M14 5h5v5' />
              <path d='m10 14 9-9' />
              <path d='M19 13v6H5V5h6' />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

export default CertificateDisplay;
