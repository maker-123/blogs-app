export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  updated_at?: string;
}

export interface Post {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  body: string;
  caption: string | null;
  image_url: string | null;
  user_id: string;

  profiles?: Profile;
}

export interface Comment {
  id: string;
  created_at: string;
  content: string;
  post_id: string;
  user_id: string;

  profiles?: Profile;
}

export type PostInsert = Omit<Post, "id" | "created_at" | "updated_at">;
export type CommentInsert = Omit<Comment, "id" | "created_at">;
