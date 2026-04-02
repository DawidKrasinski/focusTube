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
}

export type DurationFilter = "any" | "short" | "medium" | "long";
export type UploadDateFilter = "any" | "hour" | "today" | "week" | "month" | "year";
