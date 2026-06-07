import type { Tag } from './tag';

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
  company_website: string | null;
  work_slug: string;
}

export interface WorkResponse {
  results : WorkArticle[];
  tags: Tag[];
}

interface WorkExperience {
  work_id: number;
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
}

export interface WorkExperienceResponse {
  results: WorkExperience[];
}
