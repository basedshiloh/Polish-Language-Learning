import {
  Home,
  BookOpen,
  Brain,
  BarChart3,
  Table2,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';

export const STORAGE_KEY = 'polish-pal-progress';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Lessons', href: '/lessons', icon: BookOpen },
  { label: 'Grammar', href: '/grammar', icon: Table2 },
  { label: 'Quizzes', href: '/quizzes', icon: Brain },
  { label: 'Blog', href: '/blog', icon: Newspaper },
  { label: 'Progress', href: '/progress', icon: BarChart3 },
];
