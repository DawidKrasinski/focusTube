export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  durationSeconds: number;
  uploadDate: string;
  uploadDateISO: string;
  channel: string;
  views: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
}

export type DurationFilter = "any" | "short" | "medium" | "long";
export type UploadDateFilter =
  | "any"
  | "hour"
  | "today"
  | "week"
  | "month"
  | "year";
