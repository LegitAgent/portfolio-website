import type { Tag } from './tag';

interface Project {
  project_name: string;
  project_description: string;
  project_github: string;
  project_img_url: string;
  pArticle_slug: string;
}

interface ProjectArticle {
  pArticle_title: string;
  pArticle_image_url: string;
  pArticle_slug: string;
  pArticle_content: string;
  project_github: string;
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
