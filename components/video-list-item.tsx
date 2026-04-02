import type { Video } from "@/lib/mock-data";
import { Clock, User } from "lucide-react";

interface VideoListItemProps {
  video: Video;
}

export function VideoListItem({ video }: VideoListItemProps) {
  return (
    <article className="group cursor-pointer py-4 border-b border-border last:border-b-0 hover:bg-secondary/50 -mx-4 px-4 transition-colors">
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {video.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {video.channel}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {video.duration}
          </span>
          <span>{video.views}</span>
          <span>•</span>
          <span>{video.uploadDate}</span>
        </div>
      </div>
    </article>
  );
}

export function VideoListItemSkeleton() {
  return (
    <div className="animate-pulse py-4 border-b border-border last:border-b-0">
      <div className="space-y-2">
        <div className="h-5 bg-secondary rounded w-3/4" />
        <div className="h-4 bg-secondary rounded w-full" />
        <div className="h-4 bg-secondary rounded w-2/3" />
        <div className="flex gap-4">
          <div className="h-3 bg-secondary rounded w-24" />
          <div className="h-3 bg-secondary rounded w-16" />
          <div className="h-3 bg-secondary rounded w-20" />
        </div>
      </div>
    </div>
  );
}
