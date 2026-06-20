import './CertificateDisplay.css';
import type { Certificate } from '../../types/certificate.ts';
import { redirect } from '../../config/routing.ts';
import { CLOUDFLARE_R2_BUCKET } from '../../config/constants.ts';

function CertificateDisplay({ certificate }: { certificate: Certificate }) {
  const imageUrl = new URL(certificate.image_url, CLOUDFLARE_R2_BUCKET).toString();

  return (
    <article className="certificateDisplay">
      <img className="certificateImage" src={imageUrl} alt={certificate.image_alt} />
      <div className="certificateContent">
        <h2>{certificate.title}</h2>
        <p>{certificate.description}</p>
        <button onClick={() => redirect(certificate.certificate_url)} className="certificateAction">
          Open PDF
        </button>
      </div>
    </article>
  );
}

export default CertificateDisplay;
