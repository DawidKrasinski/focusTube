# FocusTube 🎯

**AI-powered search that filters out distractions. Find educational content that actually matters.**

A distraction-free video search application designed to help users discover quality educational content while avoiding shorts, clickbait, recommendations, and low-value videos. Built with modern web technologies and focused on minimalist UX that doesn't overload users with unnecessary stimuli.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Problem & Solution](#problem--solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building & Deployment](#building--deployment)
- [Architecture & Design](#architecture--design)
- [Components Guide](#components-guide)
- [Future Enhancements](#future-enhancements)

## 🎯 Project Overview

**FocusTube** is a next-generation video search platform that reimagines how people discover educational content. By leveraging AI-powered filtering and a distraction-minimized interface, FocusTube ensures users find learning materials that genuinely educate rather than entertain or manipulate.

### Key Metrics

- **Framework**: Next.js 16.2.0 (React 19)
- **Styling**: Tailwind CSS 4.2 with shadcn/ui components
- **Type Safety**: Full TypeScript support
- **UI Components**: 50+ pre-built Radix UI components
- **Analytics**: Vercel Analytics integration

## 🔍 Problem & Solution

### The Problem

Modern video platforms are designed to maximize engagement through:

- **Recommendation algorithms** that prioritize watch time over quality
- **Infinite scrolling feeds** that create addictive patterns
- **Short-form content** (15-60 seconds) optimized for distraction
- **Clickbait titles** that misrepresent content
- **Low-value content** disguised as educational material

This creates an environment where **finding quality educational content is increasingly difficult**.

### The Solution

FocusTube implements AI-driven filtering to:

1. **Identify valuable content** based on educational merit
2. **Remove distracting formats** (auto-playing recommendations, feeds, shorts)
3. **Filter low-quality content** (clickbait, manipulation, addictive design)
4. **Provide focused search** without algorithmic manipulation
5. **Maintain minimalist UI** that doesn't introduce additional cognitive load

## ✨ Features

### Core Features

- **🔍 Smart Search**: Query-based video discovery without algorithmic recommendations
- **🤖 AI Filtering**: Intelligent filtering removes:
  - Short-form videos (YouTube Shorts, TikTok-style content)
  - Clickbait titles and thumbnails
  - Low-value content disguised as educational
  - Addictive engagement patterns
  - Recommendation algorithms

- **⏱️ Duration Filters**: Find content by length
  - Short (< 4 minutes)
  - Medium (4-20 minutes)
  - Long (> 20 minutes)

- **📅 Time Filters**: Search by upload date
  - Any time
  - Today
  - This week
  - This year

- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **🌓 Dark/Light Mode**: Theme support via next-themes
- **♿ Accessibility**: WCAG-compliant with semantic HTML
- **⚡ Performance**: Optimized rendering with React 19 and Next.js 16

### UI Features

- **Grid View**: Card-based layout showing thumbnails, duration, views, and metadata
- **List View**: Detailed list view with descriptions and full metadata
- **View Toggle**: Switch between grid and list layouts
- **Sticky Header**: Navigation stays accessible while scrolling
- **Focus States**: Dynamic UI that adapts to input focus
- **Loading States**: Skeleton screens for optimal perceived performance

## 🛠 Tech Stack

### Frontend Framework

```json
{
  "framework": "Next.js 16.2.0",
  "runtime": "React 19",
  "styling": "Tailwind CSS 4.2",
  "language": "TypeScript 5.7.3"
}
```

### UI Library & Components

- **Radix UI**: 30+ unstyled, accessible components
  - Dialog, Dropdown, Popover, Toast, Select, etc.
- **shadcn/ui**: Pre-built components on top of Radix UI
- **Lucide React**: 500+ high-quality icons

### State & Data Management

- **React Hooks**: Built-in state management (useState, useMemo, useCallback)
- **Next.js Dynamic Routing**: File-based routing with `[id]` parameters
- **Mock Data**: Simulated API responses for development/demo

### Styling & Theming

- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Design tokens for theming (light/dark modes)
- **next-themes**: Dark mode persistence and system preference detection
- **class-variance-authority**: Build component variants with type safety

### Forms & Validation

- **React Hook Form**: Lightweight form library
- **@hookform/resolvers**: Integration with validation schemas
- **Zod**: TypeScript-first schema validation

### Additional Libraries

- **date-fns**: Date formatting and manipulation
- **recharts**: Composable charting library
- **cmdk**: Command menu / command palette
- **sonner**: Toast notifications
- **vaul**: Drawer component with gestures
- **embla-carousel-react**: Carousel/slider components

### Analytics & Monitoring

- **@vercel/analytics**: Performance and user analytics

## 📁 Project Structure

```
focusTube/
├── app/                          # Next.js App Router directory
│   ├── layout.tsx               # Root layout with metadata & theming
│   ├── page.tsx                 # Homepage with search interface
│   ├── search/
│   │   └── page.tsx             # Search results page
│   └── globals.css              # Global styles and CSS variables
│
├── components/                   # Reusable React components
│   ├── search-bar.tsx           # Search input with submit logic
│   ├── filters-dropdown.tsx      # Duration & date filters
│   ├── view-toggle.tsx          # Grid/List view switcher
│   ├── video-card.tsx           # Single video in grid layout
│   ├── video-list-item.tsx      # Single video in list layout
│   ├── theme-provider.tsx       # Theme initialization wrapper
│   │
│   └── ui/                       # shadcn/ui components (50+ files)
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── popover.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── select.tsx
│       └── ... (38 more components)
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts            # Responsive breakpoint detection
│   └── use-toast.ts             # Toast notification hook
│
├── lib/                          # Utilities and helpers
│   ├── mock-data.ts             # Sample video data & filtering logic
│   └── utils.ts                 # Tailwind class merging utilities
│
├── public/                       # Static assets
│   ├── icon-light-32x32.png    # Light theme favicon
│   ├── icon-dark-32x32.png     # Dark theme favicon
│   ├── icon.svg                # SVG icon
│   └── apple-icon.png          # iOS icon
│
├── styles/                       # Additional stylesheets
│   └── globals.css              # (Duplicate of app/globals.css)
│
├── package.json                 # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.mjs             # Next.js configuration
├── components.json             # shadcn/ui configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── postcss.config.mjs          # PostCSS configuration
```

### File Organization Principles

**By Responsibility:**

- `/app` - Page routes and layout structure
- `/components` - Reusable UI components
- `/lib` - Core business logic and utilities
- `/hooks` - Stateful component logic
- `/public` - Static assets

**By Feature:**

- Search functionality: `components/search-bar.tsx`, `app/search/page.tsx`
- Filtering: `components/filters-dropdown.tsx`
- Video display: `components/video-card.tsx`, `components/video-list-item.tsx`

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17+ or later
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd focusTube
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

   This installs all packages from `package.json`:
   - Next.js and React
   - Tailwind CSS and PostCSS
   - All UI component libraries
   - TypeScript and dev tools

3. **Verify installation**
   ```bash
   npm run build --check
   npm run lint
   ```

### Environment Setup

No environment variables are currently required for running locally. The project uses mock data for demonstration.

## 💻 Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

- **Hot reload enabled**: Changes reflect immediately
- **TypeScript checking**: Real-time type validation
- **Fast refresh**: Component updates without full page reload

### Development Workflow

1. **Create a new component**

   ```bash
   # Create at components/MyComponent.tsx
   # Use TypeScript for type safety
   export function MyComponent() {
     return <div>Component</div>
   }
   ```

2. **Use Radix UI components**

   ```bash
   # Install new shadcn/ui component (if needed)
   npx shadcn-ui@latest add component-name
   ```

3. **Add routes**
   - Create new files in `/app` directory
   - Next.js auto-routes based on file structure
   - Example: `app/about/page.tsx` → `/about`

4. **Style with Tailwind**
   ```tsx
   <div className="flex items-center justify-center gap-4 p-6">
     <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
       Click me
     </button>
   </div>
   ```

### Code Quality Tools

**Linting**

```bash
npm run lint
```

Checks code for errors and style violations using ESLint.

**Type Checking**

```bash
npx tsc --noEmit
```

Validates TypeScript without generating output files.

## 🏗 Building & Deployment

### Production Build

```bash
npm run build
```

Creates optimized production bundle:

- Minifies JavaScript and CSS
- Code splitting for optimal load times
- Static optimization of pages

### Production Server

```bash
npm start
```

Starts the production server on `http://localhost:3000`

### Deployment Options

**Vercel (Recommended)**

```bash
npm install -g vercel
vercel
```

- One-click deployment from Vercel dashboard
- Automatic builds on git push
- Environment variables management
- Analytics included (@vercel/analytics)

**Docker**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

**Traditional Hosting**

- Build locally: `npm run build`
- Deploy `.next` output folder
- Set `NODE_ENV=production`
- Requires Node.js 18+

## 🏛 Architecture & Design

### Design Philosophy

**Minimalist UX**
The interface is intentionally sparse to avoid introducing additional distractions:

- Limited color palette (primary, secondary, muted)
- Generous whitespace
- Clear visual hierarchy
- No autoplay, no notifications, no pop-ups
- Responsive text sizing

**Performance-First**

- **Server-side rendering (SSR)**: Initial page loads from server
- **Static generation**: Homepage pre-rendered at build time
- **Incremental static regeneration**: Cache invalidation strategies
- **Image optimization**: Next.js automatic image compression
- **Code splitting**: Load only what's needed per route

**Type-Safe Development**

- Full TypeScript coverage
- Interface definitions for all data
- Type validation in components
- Compile-time error detection

### Data Flow Architecture

```
User Input (Search Query)
    ↓
SearchBar Component (captures & validates)
    ↓
Router Navigation (/search?q=...)
    ↓
Search Page (retrieves query parameter)
    ↓
Mock Data + Filtering Logic
    ↓
useMemo (memoizes filtered results)
    ↓
Video Components (render filtered videos)
    ↓
Rendered Results
```

### State Management Strategy

**Component Level (React Hooks)**

```tsx
// Local component state
const [viewMode, setViewMode] = useState<ViewMode>("grid");
const [duration, setDuration] = useState<DurationFilter>("any");

// Memoized derived state
const filteredVideos = useMemo(() => {
  return filterVideos(mockVideos, query, duration, uploadDate);
}, [query, duration, uploadDate]);
```

**URL State (Next.js Router)**

```tsx
// Search query persisted in URL
const query = searchParams.get("q") || "";
router.push(`/search?q=${encodeURIComponent(newQuery)}`);
```

Benefits:

- Can share search URLs
- Back button works correctly
- Bookmarkable searches
- State survives page refresh

### Styling Strategy

**Tailwind CSS + CSS Variables**

```css
/* app/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 13% 13%;
    --primary: 221 83% 53%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --border: 214 32% 91%;
    --muted-foreground: 215 16% 47%;
  }

  [data-theme="dark"] {
    --background: 222 84% 5%;
    --foreground: 213 31% 91%;
    /* ... dark theme variables */
  }
}
```

**Component Styling**

```tsx
// Using CSS classes with Tailwind
<div className="flex items-center gap-4 p-6 rounded-lg bg-secondary">
  <span className="text-sm font-medium text-muted-foreground">Label</span>
</div>

// Using conditional classes
<button className={`px-4 py-2 transition-all ${
  isActive ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-accent"
}`}>
  Click
</button>
```

## 📦 Components Guide

### Page Components

#### `app/page.tsx` (Homepage)

**Purpose**: Landing page with search interface

**Key Features**:

- Centered search experience for focus
- Dynamic layout based on input focus state
- Logo and hero text that fade on input focus (mobile-optimized)
- Minimalist footer with filtering philosophy
- Responsive spacing adjustments

**Props**: None (renders static content)

**State Management**:

- `isInputFocused`: Tracks if search input has focus
- Triggers layout animations and visibility changes

---

#### `app/search/page.tsx` (Search Results)

**Purpose**: Display filtered video results

**Key Features**:

- Sticky header with search bar and filters
- Grid/List view toggle
- Dynamic result counter
- Responsive grid layout (1/2/3 columns)
- Empty state with helpful messaging
- Suspense boundary for loading states

**Data Flow**:

1. Gets `q` query parameter from URL
2. Applies duration and date filters
3. Passes to mock data filtering function
4. Memoizes results to prevent re-renders

**Child Components**:

- `SearchBar` (with initial query)
- `FiltersDropdown`
- `ViewToggle`
- `VideoCard` or `VideoListItem` (conditional)

---

### Feature Components

#### `components/search-bar.tsx`

**Purpose**: Search input with form submission

**Props**:

```typescript
interface SearchBarProps {
  initialQuery?: string; // Pre-fill search input
  size?: "large" | "normal"; // Sizing variant
  onSearch?: (query: string) => void; // Custom search handler
  onFocusChange?: (focused: boolean) => void; // Focus listener
}
```

**Behavior**:

- Submits on Enter key or Search button click
- Optional handler for custom search logic
- Default behavior: Navigate to `/search?q={query}`
- Emits focus/blur events for parent UI effects

**Styling**:

- Large size: `py-4 text-lg pl-12` (homepage)
- Normal size: `py-3 text-base pl-10` (search page)
- Icon left-aligned, button right-aligned

---

#### `components/filters-dropdown.tsx`

**Purpose**: Duration and date filters

**Props**:

```typescript
interface FiltersDropdownProps {
  duration: DurationFilter; // "any" | "short" | "medium" | "long"
  uploadDate: UploadDateFilter; // "any" | "today" | "week" | "year"
  onDurationChange: (duration: DurationFilter) => void;
  onUploadDateChange: (uploadDate: UploadDateFilter) => void;
}
```

**Features**:

- Shows active filter count badge
- Dropdown menu with filter options
- "Clear all" button when filters active
- Accessible click-outside handling
- Color-coded active state (primary background)

**UI States**:

- **Default**: Secondary background, hover effect
- **Active Filters**: Primary background with count badge
- **Open Dropdown**: Absolute positioned menu with shadow

---

#### `components/view-toggle.tsx`

**Purpose**: Switch between grid and list layouts

**Props**:

```typescript
interface ViewToggleProps {
  viewMode: ViewMode; // "grid" | "list"
  onViewModeChange: (mode: ViewMode) => void;
}
```

**Implementation**: Toggle buttons showing grid/list icons (Lucide React)

---

#### `components/video-card.tsx`

**Purpose**: Video item in grid layout

**Props**:

```typescript
interface VideoCardProps {
  video: Video; // Full video object with metadata
}
```

**Displays**:

- Aspect ratio video placeholder (16:9)
- Play icon overlay
- Duration badge (bottom-right)
- Title (line-clamp 2)
- Channel name
- View count and upload date
- Hover effect (title color change)

**Styling**: Rounded corners, border, group hover effects

---

#### `components/video-list-item.tsx`

**Purpose**: Video item in list layout

**Same Video object** as card but displays:

- Full title
- Complete description (line-clamp 2)
- All metadata in row layout
- Icons for each metadata field
- Bottom border separator
- Smoother hover background transition

---

### UI Component Library

The project includes **50+ shadcn/ui components** in `components/ui/`:

**Common Components Used**:

- `button.tsx`: Styled button with variants
- `dialog.tsx`: Modal dialogs with Radix Dialog
- `dropdown-menu.tsx`: Context menus
- `popover.tsx`: Floating UI elements
- `toast.tsx` / `toaster.tsx`: Notifications
- `select.tsx`: Dropdown selects
- `input.tsx`: Text inputs
- `label.tsx`: Form labels
- `alert.tsx` / `alert-dialog.tsx`: Alert states

**Full List**:
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, button-group, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, empty, field, form, hover-card, input, input-group, input-otp, item, kbd, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip, use-mobile, use-toast

---

### HTML Structure Example

**Search Page Hierarchy**:

```
<html>
  <body>
    <main>
      <header sticky>          {/* Sticky navigation */}
        <Link> {/* Back to home */}
          <Focus icon /> + logo
        </Link>
        <SearchBar />
      </header>

      <main>
        <div>                  {/* Controls */}
          <FiltersDropdown />
          <span>{count} results</span>
        </div>
        <div>                  {/* Results */}
          {viewMode === 'grid' ? (
            <div grid>
              {videos.map(v => <VideoCard />)}
            </div>
          ) : (
            <div>
              {videos.map(v => <VideoListItem />)}
            </div>
          )}
        </div>
      </main>

      <footer>                 {/* Footer text */}
        Results filtered by AI...
      </footer>
    </main>
  </body>
</html>
```

## 📊 Data Model

### Video Interface

```typescript
export interface Video {
  id: string; // Unique identifier
  title: string; // Video title (searchable)
  description: string; // Full description
  duration: string; // Formatted duration (HH:MM:SS)
  durationSeconds: number; // Numeric duration for filtering
  uploadDate: string; // Relative date string (e.g., "2 days ago")
  uploadDateISO: string; // ISO date for filtering (YYYY-MM-DD)
  channel: string; // Creator/channel name
  views: string; // Formatted view count (e.g., "125K views")
}
```

### Filtering Types

```typescript
type DurationFilter = "any" | "short" | "medium" | "long";
type UploadDateFilter = "any" | "today" | "week" | "year";

// Duration ranges:
// short: < 4 minutes
// medium: 4-20 minutes
// long: > 20 minutes
```

### Mock Data

The project includes 8 sample videos in `lib/mock-data.ts`:

**Examples**:

1. "Introduction to TypeScript" - Code Academy (45:32, 2 days ago)
2. "Building Modern UIs with React" - Frontend Masters (1:23:45, 1 week ago)
3. "System Design Interview" - Tech Interview Pro (2:15:00, 3 weeks ago)
4. And 5 more educational videos...

**Purpose**:

- Development without external API
- Demonstration of filtering logic
- Testing UI with realistic data
- Easy to extend with more videos

## 🔬 Filtering Logic

### Search Algorithm

Located in `lib/mock-data.ts`:

```typescript
export function filterVideos(
  videos: Video[],
  query: string,
  duration: DurationFilter,
  uploadDate: UploadDateFilter,
): Video[] {
  return videos.filter((video) => {
    // Text search on title and description
    const matchesQuery =
      !query ||
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.description.toLowerCase().includes(query.toLowerCase());

    // Duration filtering
    const durationMatch = matchesDuration(video.durationSeconds, duration);

    // Date filtering
    const dateMatch = matchesDate(video.uploadDateISO, uploadDate);

    return matchesQuery && durationMatch && dateMatch;
  });
}
```

**Features**:

- Case-insensitive text search
- Searches both title and description
- Combines multiple filters with AND logic
- Maintains original video order

### Future AI Enhancement

The filtering currently uses simple string matching. Future AI implementation should:

1. **Content Quality Analysis**
   - Educational value detection
   - Emotional intelligence (engagement tactics)
   - Misinformation detection

2. **Format Classification**
   - Identify short-form content
   - Detect clickbait patterns
   - Classify content type (tutorial, lecture, interview, etc.)

3. **Engagement Patterns**
   - Avoid algorithm-optimized content
   - Detect addictive design patterns
   - Filter recommendation optimization

## 🚀 Future Enhancements

### Phase 2: Real Data Integration

- **YouTube API Integration**

  ```typescript
  // Search real YouTube videos
  const response = await fetch("https://www.googleapis.com/youtube/v3/search", {
    params: {
      q: query,
      part: "snippet",
      key: process.env.YOUTUBE_API_KEY,
    },
  });
  ```

- **Authentication**
  - OAuth2 for user accounts
  - Saved searches and preferences
  - Watch history

- **Database**
  - Store user data (Supabase, Prisma ORM)
  - Cache filtering results
  - Track user feedback on AI quality

### Phase 3: AI Implementation

- **Machine Learning Model**
  - Train on educational vs low-value content
  - Content quality scoring
  - Engagement pattern detection

- **Advanced Features**
  - Personalized filtering profiles
  - AI-generated summaries
  - Content recommendations based on learning goals
  - Transcript search and highlighting

### Phase 4: Community Features

- **User Contributions**
  - Community-driven video ratings
  - Comments and discussions (moderated)
  - Content creator verification

- **Learning Paths**
  - Curated video sequences
  - Topic progression
  - Difficulty levels

- **Social Features**
  - Save/bookmark videos
  - Create playlists
  - Share learning paths

### Phase 5: Monetization & Sustainability

- **Freemium Model**
  - Free tier: basic search with ads
  - Pro tier: unlimited searches, AI summaries, no ads

- **Creator Revenue Sharing**
  - Revenue from users who watch shared content
  - Educational creator incentives

- **API Access**
  - White-label API for institutions
  - Integration with learning management systems

## 📝 Configuration Files

### `tsconfig.json`

- **target**: ES6 (modern JavaScript)
- **lib**: DOM + ES Next
- **strict**: `true` (maximum type safety)
- **module**: ESNext
- **jsx**: react-jsx (automatic JSX transform)
- **paths**: `@/*` aliases for imports

### `tailwind.config.ts`

- Dark mode class strategy
- Color theme customization
- Typography scale
- Spacing system

### `next.config.mjs`

- TypeScript build errors ignored (dev setup)
- Unoptimized images for static export
- Can be extended with middleware, redirects, etc.

### `components.json` (shadcn/ui)

- Style: "new-york" (Modern design style)
- Base color: "neutral"
- Taildwind config path
- CSS variables enabled
- Icon library: Lucide React

## 📚 Resources & References

### Documentation

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS 4 Docs](https://tailwindcss.com/docs)
- [Radix UI Components](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [shadcn/ui Components](https://ui.shadcn.com)

### Learning Resources

- Next.js App Router patterns
- React Server Components vs Client Components
- TypeScript best practices
- Tailwind CSS utility-first CSS
- Web Accessibility (WCAG) guidelines

### Related Concepts

- AI content quality assessment
- Educational content ranking
- Digital wellness and distraction-free design
- Information literacy

## 🤝 Contributing

### Development Guidelines

1. **Code Style**
   - Use TypeScript for type safety
   - Follow existing component patterns
   - Use functional components with hooks
   - Write descriptive variable names

2. **Component Structure**

   ```tsx
   // Import statements
   import { Component } from "react";
   import { useHook } from "@/hooks/use-hook";

   // Props interface
   interface MyComponentProps {
     prop1: string;
     prop2?: number;
   }

   // Component function (exported)
   export function MyComponent({ prop1, prop2 }: MyComponentProps) {
     return <div>{prop1}</div>;
   }
   ```

3. **Testing Locally**
   - Run `npm run dev`
   - Test on mobile using DevTools
   - Check dark mode toggle
   - Verify keyboard navigation

4. **Git Workflow**
   ```bash
   git checkout -b feature/my-feature
   git commit -m "feat: add new awesome feature"
   git push origin feature/my-feature
   ```

## 📄 License

This project is open source. Check LICENSE file for details.

## 👨‍💻 Author

Created by Dawid Krasiński

## 🎯 Vision Statement

**FocusTube** aspires to be the antidote to algorithmic manipulation in education. We believe quality learning content should be discovered through intention, not addiction. By combining intelligent filtering with a philosophy of "less is more" in UI design, FocusTube creates space for meaningful learning without the noise.

Our ultimate goal: **Make quality education more discoverable than entertainment.**

---

**Last Updated**: April 2, 2026  
**Version**: 0.1.0 (Early Development)

For questions or suggestions, please open an issue or contact the development team.
