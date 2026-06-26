import {
  Home,
  BookOpen,
  Brain,
  BarChart3,
  Table2,
  Newspaper,
  Info,
  Mail,
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
  { label: 'Progress', href: '/progress', icon: BarChart3 },
];

export const EXTRA_NAV_ITEMS: NavItem[] = [
  { label: 'Blog', href: '/blog', icon: Newspaper },
  { label: 'About', href: '/about', icon: Info },
  { label: 'Contact', href: '/contact', icon: Mail },
];
