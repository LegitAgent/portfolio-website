export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  completion_date: string;
  credential_url: string | null;
  certificate_url: string;
  image_alt: string;
  skills: string;
  image_url: string;
}

export interface CertificateResponse {
  certificates: Certificate[];
}
