/* ========== Shared TypeScript Interfaces ========== */

export interface NavItem {
  id: string;
  path: string;
  label?: string;
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface Comment {
  id: string;
  author: string;
  avatarInitials: string;
  avatarUrl?: string;
  timeAgo: string;
  body: string;
}

export interface Post {
  id: string;
  author: string;
  avatarInitials: string;
  avatarUrl?: string;
  timeAgo: string;
  category: string;
  title: string;
  body: string;
  likes: number;
  comments: Comment[];
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  cta?: string;
}

export interface Member {
  initials: string;
  name: string;
  posts: number;
  color?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface QuickAction {
  icon: React.ReactNode;
  label: string;
}
