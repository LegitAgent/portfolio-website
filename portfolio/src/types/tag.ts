export interface TagsResponse {
  tags: Tag[];
}

export interface Tag {
  tag_name: string;
  skill_type: string;
}
