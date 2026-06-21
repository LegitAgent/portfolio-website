export type SkillType = 'Language' | 'Frontend' | 'Backend' | 'Database' | 'Cloud' | 'Developer Tool' | 'Systems' | 'Game Development' | 'API / Integration';

export interface TagsResponse {
  tags: Tag[];
}

export interface Tag {
  tag_name: string;
  skill_type: SkillType;
}
