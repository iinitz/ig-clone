
export interface Comment {
  id: number;
  content: string;
  author: { username: string; avatarUrl?: string };
}

export interface Like {
  id: number;
  userId: number;
}

export interface Post {
  id: number;
  imageUrl: string;
  caption: string;
  author: { username: string; avatarUrl?: string };
  comments: { id: number; content: string; author: { username: string; avatarUrl?: string } }[];
  likes: Like[];
}