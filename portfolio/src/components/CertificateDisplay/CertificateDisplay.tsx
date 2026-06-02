import './CertificateDisplay.css';
import type { Certificate } from '../../pages/Professional/Certificates.tsx';
import { Link } from 'react-router-dom';
import { CLOUDFLARE_R2_BUCKET } from '../../imports/constants';

interface CertificateDisplayProps {
  project: Certificate;
}

function ProjectsDisplay({certificate}: CertificateDisplayProps) {
  const imageUrl = new URL(certificate.project_img_url, CLOUDFLARE_R2_BUCKET).toString();

  return(
    <div className='projectDisplay'>
      <img className='projectImage' src={imageUrl} alt={certificate.project_name}/>
      <p className='title'>{certificate.project_name}</p>
      <div className='textContent'>
        <p className='description'>{certificate.project_description}</p>
        <div className='links'>
          <a href={certificate.project_github} target='_blank' rel='noreferrer'>Github</a>
          <Link className="projectLink" to={`/projects/${certificate.pArticle_slug}`} aria-label="Article" >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectsDisplay;