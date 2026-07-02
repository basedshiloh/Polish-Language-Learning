import type { BlogCategory } from '@/lib/types';

// Post content lives in the Supabase `posts` table (managed via the /polaris CMS).
// This file keeps only static UI config: category styling and default authors.

export const blogAuthors = {
  polishpal: {
    name: 'PolishPal Contributor',
    bio: 'Community-driven language education — making Polish accessible to everyone.',
  },
};

export const blogCategoryStyles: Record<BlogCategory, { label: string; bg: string; text: string; darkBg: string; darkText: string }> = {
  'learning-tips':     { label: 'Learning Tips',     bg: 'bg-blue-100',   text: 'text-blue-700',   darkBg: 'dark:bg-blue-900/30',   darkText: 'dark:text-blue-300' },
  'grammar-deep-dive': { label: 'Grammar Deep Dive', bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-300' },
  'culture':           { label: 'Culture',            bg: 'bg-amber-100',  text: 'text-amber-700',  darkBg: 'dark:bg-amber-900/30',  darkText: 'dark:text-amber-300' },
  'pronunciation':     { label: 'Pronunciation',      bg: 'bg-rose-100',   text: 'text-rose-700',   darkBg: 'dark:bg-rose-900/30',   darkText: 'dark:text-rose-300' },
  'vocabulary':        { label: 'Vocabulary',          bg: 'bg-green-100',  text: 'text-green-700',  darkBg: 'dark:bg-green-900/30',  darkText: 'dark:text-green-300' },
};
