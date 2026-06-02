import './CertificateDisplay.css';
import type { Certificate } from '../../pages/Professional/Certificates.tsx';
import { redirect } from '../../imports/routing.ts';
import { CLOUDFLARE_R2_BUCKET } from '../../imports/constants';

interface CertificateDisplayProps {
  certificate: Certificate;
}

function CertificateDisplay({certificate}: CertificateDisplayProps) {
  const imageUrl = new URL(certificate.image_url, CLOUDFLARE_R2_BUCKET).toString();

  return(
    <div className='projectDisplay'>
      <img className='projectImage' src={imageUrl} alt={certificate.image_alt}/>
      <p className='title'>{certificate.title}</p>
      <div className='textContent'>
        {/* <p className='description'>{certificate.project_description}</p> */}
        <button onClick={() => redirect(certificate.certificate_url)} className="openPDFButton">
          Open PDF
        </button>
        </div>
    </div>
  );
}

export default CertificateDisplay;