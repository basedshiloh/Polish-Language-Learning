import type { BlogCategory } from '@/lib/types';

// Post content lives in the Supabase `posts` table (managed via the /polaris CMS).
// This file keeps only static UI config: category styling and default authors.

export const blogAuthors = {
  polishpal: {
    name: 'PolishPal Contributor',
    avatar: '/logo.svg',
    bio: 'Community-driven language education — making Polish accessible to everyone.',
  },
};

export interface BlogCategoryStyle {
  label: string;
  /** Soft tint background */
  bg: string;
  /** Ink text, readable on the soft tint and on white */
  text: string;
  /** Solid swatch (dots, bars, active chips) */
  solid: string;
  /** Border in the category colour */
  border: string;
}

// Wycinanki palette: each category owns one papercut colour.
export const blogCategoryStyles: Record<BlogCategory, BlogCategoryStyle> = {
  'learning-tips':     { label: 'Learning Tips',       bg: 'bg-cobalt-soft',  text: 'text-cobalt-ink',  solid: 'bg-cobalt',  border: 'border-cobalt' },
  'grammar-deep-dive': { label: 'Grammar Deep Dive',   bg: 'bg-violet-soft',  text: 'text-violet-ink',  solid: 'bg-violet',  border: 'border-violet' },
  'culture':           { label: 'Culture',             bg: 'bg-orange-soft',  text: 'text-orange-ink',  solid: 'bg-orange',  border: 'border-orange' },
  'pronunciation':     { label: 'Pronunciation',       bg: 'bg-teal-soft',    text: 'text-teal-ink',    solid: 'bg-teal',    border: 'border-teal' },
  'vocabulary':        { label: 'Vocabulary',          bg: 'bg-emerald-soft', text: 'text-emerald-ink', solid: 'bg-emerald', border: 'border-emerald' },
  'music':             { label: 'Polish Music',        bg: 'bg-fuchsia-soft', text: 'text-fuchsia-ink', solid: 'bg-fuchsia', border: 'border-fuchsia' },
  'memes-pop-culture': { label: 'Memes & Pop Culture', bg: 'bg-sun-soft',     text: 'text-sun-ink',     solid: 'bg-sun',     border: 'border-sun' },
  'arts':              { label: 'Arts',                bg: 'bg-crimson-soft', text: 'text-crimson-ink', solid: 'bg-crimson', border: 'border-crimson' },
};
