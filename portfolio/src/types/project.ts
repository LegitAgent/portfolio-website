import type { Tag } from './tag';

export type ProjectStatus = 'Done' | 'WIP' | 'Draft' | 'Review' | 'Blocked';

interface Project {
  project_name: string;
  project_description: string;
  project_github: string;
  project_img_url: string;
  pArticle_slug: string;
  featured: boolean;
  started_at: string;
  ended_at: string;
  live_url?: string;
  status: ProjectStatus;
}

// - summary: one or two sentences used for previews, search results, or metadata
// - overview: short section explaining what the project is, who it is for, and its primary features
// - content: detailed article covering development, architecture, decisions, and implementation

interface ProjectArticle {
  project_name: string;
  pArticle_slug: string;
  pArticle_image_url: string | null;
  pArticle_image_alt: string | null;
  pArticle_summary: string | null;
  pArticle_overview: string | null;
  pArticle_content: string | null;
  pArticle_challenges: string | null;
  pArticle_lessons: string | null;
  pArticle_future_work: string | null;
  project_github: string;
  started_at: string;
  live_url: string | null;
  status: ProjectStatus;
  featured: 0 | 1;
  }

export interface ProjectResponse {
  results: Project[];
}

export interface ArticleResponse {
  results: ProjectArticle[];
  tags: Tag[];
}

export interface ProjectDisplayProps {
  project: Project;
}
