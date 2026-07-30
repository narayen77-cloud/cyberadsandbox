export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  email?: string;
  totalPosts: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  count: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
  status?: 'draft' | 'published';
  published?: boolean;
  views: number;
  likes: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface GA4Event {
  id: string;
  timestamp: string;
  name: string;
  params: Record<string, any>;
}

export type ThemeMode = 'light' | 'dark';
