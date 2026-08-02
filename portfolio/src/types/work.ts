export type ExperienceType =
  | 'work'
  | 'internship'
  | 'hackathon'
  | 'competition'
  | 'open_source'
  | 'freelance'
  | 'community'
  | 'leadership'
  | 'academics'
  | 'volunteer'
  | 'organization'
  | 'project'
  | 'mentorship';

export interface WorkDisplayProps {
  work: WorkExperience;
}

interface WorkArticle {
  article_title: string;
  article_summary: string | null;
  article_content: string;
  article_image_url: string | null;
  responsibilities: string | null;
  achievements: string | null;
  company_name: string;
  role_title: string;
  employment_type: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: number;
  company_website: string | null;
  work_slug: string;
  images: string[];
  r2_url: string;
}

export interface WorkResponse {
  article: WorkArticle;
  tags: string[];
}

export interface WorkExperience {
  work_id: number;
  r2_url: string;
  company_name: string;
  role_title: string;
  employment_type: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: number;
  short_description: string;
  company_logo_url: string;
  company_website: string | null;
  display_order: number;
  work_slug: string;
  type: ExperienceType;
}

export interface WorkExperienceResponse {
  results: WorkExperience[];
}
