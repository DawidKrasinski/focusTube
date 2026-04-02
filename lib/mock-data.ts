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

export const mockVideos: Video[] = [
  {
    id: "1",
    title: "Introduction to TypeScript - Complete Beginner Guide",
    description: "Learn the fundamentals of TypeScript from scratch. This comprehensive guide covers types, interfaces, generics, and best practices for building type-safe applications.",
    duration: "45:32",
    durationSeconds: 2732,
    uploadDate: "2 days ago",
    uploadDateISO: "2026-03-31",
    channel: "Code Academy",
    views: "125K views"
  },
  {
    id: "2",
    title: "Building Modern UIs with React and Tailwind CSS",
    description: "Discover how to create beautiful, responsive user interfaces using React components and Tailwind CSS utility classes. Includes real-world examples and component patterns.",
    duration: "1:23:45",
    durationSeconds: 5025,
    uploadDate: "1 week ago",
    uploadDateISO: "2026-03-26",
    channel: "Frontend Masters",
    views: "89K views"
  },
  {
    id: "3",
    title: "System Design Interview: Designing YouTube",
    description: "A deep dive into system design principles through the lens of building a video streaming platform. Covers scalability, CDNs, encoding pipelines, and database design.",
    duration: "2:15:00",
    durationSeconds: 8100,
    uploadDate: "3 weeks ago",
    uploadDateISO: "2026-03-12",
    channel: "Tech Interview Pro",
    views: "342K views"
  },
  {
    id: "4",
    title: "Next.js 16 - What's New and Migration Guide",
    description: "Explore the latest features in Next.js 16 including improved caching, React 19 support, and the new proxy.js middleware. Learn how to migrate your existing projects.",
    duration: "28:15",
    durationSeconds: 1695,
    uploadDate: "5 days ago",
    uploadDateISO: "2026-03-28",
    channel: "Vercel Official",
    views: "67K views"
  },
  {
    id: "5",
    title: "Understanding JavaScript Closures in 10 Minutes",
    description: "A quick and clear explanation of one of JavaScript's most misunderstood concepts. Perfect for developers preparing for technical interviews.",
    duration: "10:22",
    durationSeconds: 622,
    uploadDate: "1 month ago",
    uploadDateISO: "2026-03-02",
    channel: "JS Simplified",
    views: "215K views"
  },
  {
    id: "6",
    title: "PostgreSQL Performance Optimization Deep Dive",
    description: "Advanced techniques for optimizing PostgreSQL queries, indexing strategies, and configuration tuning. Real examples from production databases handling millions of requests.",
    duration: "1:45:30",
    durationSeconds: 6330,
    uploadDate: "2 weeks ago",
    uploadDateISO: "2026-03-19",
    channel: "Database Engineering",
    views: "45K views"
  },
  {
    id: "7",
    title: "Clean Code Principles Every Developer Should Know",
    description: "Write maintainable, readable code that your future self and teammates will thank you for. Covers naming conventions, function design, and code organization.",
    duration: "52:18",
    durationSeconds: 3138,
    uploadDate: "3 days ago",
    uploadDateISO: "2026-03-30",
    channel: "Software Craftsmanship",
    views: "178K views"
  },
  {
    id: "8",
    title: "Docker and Kubernetes for Beginners",
    description: "Start your containerization journey with this beginner-friendly introduction to Docker and Kubernetes. Deploy your first application to a cluster by the end of this video.",
    duration: "1:12:45",
    durationSeconds: 4365,
    uploadDate: "1 week ago",
    uploadDateISO: "2026-03-26",
    channel: "DevOps Journey",
    views: "156K views"
  },
  {
    id: "9",
    title: "CSS Grid vs Flexbox - When to Use What",
    description: "Finally understand the difference between CSS Grid and Flexbox. Learn practical use cases and how to combine both for powerful layouts.",
    duration: "18:42",
    durationSeconds: 1122,
    uploadDate: "Today",
    uploadDateISO: "2026-04-02",
    channel: "CSS Tricks",
    views: "23K views"
  },
  {
    id: "10",
    title: "Authentication Best Practices in 2026",
    description: "Security-focused guide to implementing authentication in modern web applications. Covers JWT, session management, OAuth, and common vulnerabilities to avoid.",
    duration: "38:55",
    durationSeconds: 2335,
    uploadDate: "4 days ago",
    uploadDateISO: "2026-03-29",
    channel: "Security First",
    views: "92K views"
  }
];

export type DurationFilter = "any" | "short" | "medium" | "long";
export type UploadDateFilter = "any" | "today" | "week" | "year";

export function filterVideos(
  videos: Video[],
  query: string,
  duration: DurationFilter,
  uploadDate: UploadDateFilter
): Video[] {
  return videos.filter((video) => {
    // Search filter - show all if query is empty, otherwise filter by query
    const normalizedQuery = query.trim().toLowerCase();
    const searchMatch = normalizedQuery === "" || 
      video.title.toLowerCase().includes(normalizedQuery) ||
      video.description.toLowerCase().includes(normalizedQuery) ||
      video.channel.toLowerCase().includes(normalizedQuery);

    // Duration filter
    let durationMatch = true;
    if (duration === "short") {
      durationMatch = video.durationSeconds < 240; // < 4 minutes
    } else if (duration === "medium") {
      durationMatch = video.durationSeconds >= 240 && video.durationSeconds <= 1200; // 4-20 minutes
    } else if (duration === "long") {
      durationMatch = video.durationSeconds > 1200; // > 20 minutes
    }

    // Upload date filter
    let dateMatch = true;
    const today = new Date("2026-04-02");
    const videoDate = new Date(video.uploadDateISO);
    const diffDays = Math.floor((today.getTime() - videoDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (uploadDate === "today") {
      dateMatch = diffDays === 0;
    } else if (uploadDate === "week") {
      dateMatch = diffDays <= 7;
    } else if (uploadDate === "year") {
      dateMatch = diffDays <= 365;
    }

    return searchMatch && durationMatch && dateMatch;
  });
}
