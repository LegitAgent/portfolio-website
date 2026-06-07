import './CertificateDisplay.css';
import type { Certificate } from '../../types/certificate.ts';
import { redirect } from '../../config/routing.ts';
import { CLOUDFLARE_R2_BUCKET } from '../../config/constants.ts';

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
        <button onClick={() => redirect(certificate.certificate_url)} className='openPDFButton'>
          Open PDF
        </button>
        </div>
    </div>
  );
}

export default CertificateDisplay;
