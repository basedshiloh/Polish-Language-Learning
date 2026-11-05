import { lessons } from '@/data/lessons';
import { grammarTopics } from '@/data/grammar';
import { quizzes } from '@/data/quizzes';
import { blogCategoryStyles } from '@/data/blog';
import type { BlogCategory, Lesson, Post } from '@/lib/types';
import type { ZubekPose } from '@/components/mascot/zubek-svgs';

// Share cards (og:image), one per page, PlantAlong-style: brand + the page's
// own words on the left, a tilted "print" on the right with Żubek in front.
// Rendered by src/app/og/[kind]/[slug]/route.tsx as 1200x630 JPEG.
// Bump CARD_DESIGN (./version.ts) when the look changes so social caches refetch.

export type CardKind = 'page' | 'lesson' | 'grammar' | 'quiz' | 'blog';

export type CardArt =
  | { type: 'phrases'; heading: string; chip: string; rows: { pl: string; en: string }[] }
  | { type: 'word'; big: string; small: string; rows: string[] }
  | { type: 'quiz'; count: number; chips: string[] }
  | { type: 'photo'; src: string };

export interface Card {
  kicker: string;
  title: string;
  line: string;
  path: string;
  pose: ZubekPose;
  art: CardArt;
}

const firstWords = (lesson: Lesson, n = 3) => {
  const out: { pl: string; en: string }[] = [];
  for (const b of lesson.content) {
    for (const w of (b.type === 'vocabulary' ? b.vocabulary : b.type === 'phrases' ? b.phrases : undefined) ?? []) {
      if (out.length < n && w.polish && !out.some((o) => o.pl === w.polish)) {
        out.push({ pl: w.polish, en: w.english.split(' / ')[0].replace(/\s*\(.*?\)\s*/g, ' ').trim() });
      }
    }
  }
  return out;
};

const lesson1 = lessons.find((l) => l.order === 1) ?? lessons[0];
const homeArt: CardArt = { type: 'phrases', heading: 'First words', chip: 'Lesson 1 · A0', rows: firstWords(lesson1) };

// Static pages: kicker, title, line, pose. Titles are the pages' own headings.
const PAGES: Record<string, Omit<Card, 'art' | 'path'> & { art?: CardArt }> = {
  home: { kicker: 'Free Polish course', title: 'Polish, made simple.', line: 'Structured lessons from absolute beginner to A1, grammar tables, quizzes and pronunciation. All free.', pose: 'hello' },
  lessons: { kicker: `${lessons.length} lessons · A0 to A1`, title: 'Learn Polish step by step', line: 'From greetings to telling time, with vocabulary, dialogues and audio pronunciation.', pose: 'teach' },
  grammar: { kicker: `${grammarTopics.length} topics`, title: 'Polish grammar reference', line: 'Color-coded tables for gender, cases, conjugations, time and more.', pose: 'read' },
  quizzes: { kicker: `${quizzes.length} quizzes`, title: 'Test your Polish', line: 'Multiple choice, fill in the blank and matching, with instant feedback.', pose: 'cards' },
  blog: { kicker: 'The PolishPal Blog', title: 'Polish culture, words and grammar', line: 'Explained by people who love the language.', pose: 'read' },
  about: { kicker: 'About', title: 'The story behind PolishPal', line: 'A personal study tool for a Polish exam that grew into a free course for everyone.', pose: 'hello' },
  contact: { kicker: 'Contact', title: 'Spotted a mistake? Tell us', line: 'Report a bug or a wrong translation, or suggest a new lesson.', pose: 'speak' },
  editorial: { kicker: 'Editorial policy', title: 'How we keep PolishPal accurate', line: 'Our sources, review process and corrections.', pose: 'read' },
  changelog: { kicker: 'Changelog', title: 'What is new on PolishPal', line: 'New lessons, fixes and site updates, by date.', pose: 'celebrate' },
  privacy: { kicker: 'Privacy policy', title: 'Your data on PolishPal', line: 'What we store, and what we never collect.', pose: 'read' },
  cookies: { kicker: 'Cookie policy', title: 'Cookies on PolishPal', line: 'What is stored in your browser and why.', pose: 'read' },
  gdpr: { kicker: 'GDPR & cookies', title: 'Your choices, your data', line: 'Analytics, ads consent and how to change your settings.', pose: 'read' },
  terms: { kicker: 'Terms of use', title: 'Terms of use', line: 'Free to use, CC0 content, and the rules for comments.', pose: 'read' },
  disclosure: { kicker: 'Disclosure', title: 'Ads & affiliate disclosure', line: 'How PolishPal is funded, and what ads never change.', pose: 'read' },
  progress: { kicker: 'Your progress', title: 'Track your Polish journey', line: 'Lessons done, quiz scores and study streaks, saved on your device.', pose: 'trophy' },
  search: { kicker: 'Search', title: 'Find any lesson or word', line: 'Search lessons, grammar tables, quizzes and blog posts.', pose: 'think' },
  newsletter: { kicker: 'Newsletter', title: 'The PolishPal newsletter', line: 'New lessons, blog articles and short learning tips, by email.', pose: 'speak' },
};

const LESSON_POSE: Record<string, ZubekPose> = {
  introductions: 'hello', phonetics: 'speak', 'numbers-counting': 'cards', 'instrumental-case': 'read',
  'family-possessives': 'hello', 'accusative-case': 'think', 'hobbies-free-time': 'celebrate',
  'food-drinks-ordering': 'speak', 'daily-routine-time': 'sleep', 'genitive-case': 'think', 'shopping-clothing': 'travel',
};
const GRAMMAR_POSE: Record<string, ZubekPose> = {
  'numbers-reference': 'cards', 'polish-cities': 'travel', 'shopping-money': 'travel', 'questions-answers': 'speak',
  'znac-wiedziec-umiec': 'think', 'frequency-adverbs': 'think', 'telling-time': 'think', pronouns: 'hello', byc: 'hello',
};
const BLOG_POSE: Record<BlogCategory, ZubekPose> = {
  culture: 'travel', 'learning-tips': 'hello', 'grammar-deep-dive': 'teach', vocabulary: 'cards',
  pronunciation: 'speak', music: 'celebrate', 'memes-pop-culture': 'celebrate', arts: 'read',
};

/** Pages without their own entry share the home card rather than a broken preview. */
export function pageCard(slug: string): Card | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const p = PAGES[slug] ?? PAGES.home;
  return { ...p, path: PAGES[slug] ? (slug === 'home' ? '/' : `/${slug}`) : '/', art: p.art ?? homeArt };
}

export function lessonCard(id: string): Card | null {
  const l = lessons.find((x) => x.id === id);
  if (!l) return null;
  return {
    kicker: `Lesson ${l.order} · ${l.level}`,
    title: l.title,
    line: l.description,
    path: `/lessons/${l.id}`,
    pose: LESSON_POSE[l.id] ?? 'teach',
    art: { type: 'phrases', heading: 'In this lesson', chip: `~${l.estimatedMinutes} min`, rows: firstWords(l) },
  };
}

export function grammarCard(id: string): Card | null {
  const t = grammarTopics.find((x) => x.id === id);
  if (!t) return null;
  // Example sentences; else the comparison headings (ZNAĆ / WIEDZIEĆ / UMIEĆ); else the first table column.
  const examples = t.sections.flatMap((s) => s.examples ?? []).map((e) => e.polish);
  const compared = t.sections.flatMap((s) => s.comparison ?? []).map((c) => c.title);
  const tableCol = t.sections.flatMap((s) => s.table?.rows ?? []).map((r) => r[0].split('\n')[0]);
  const rows = (examples.length ? examples : compared.length ? compared : tableCol).slice(0, 3);
  return {
    kicker: 'Grammar reference',
    title: t.title,
    line: t.description,
    path: `/grammar/${t.id}`,
    pose: GRAMMAR_POSE[t.id] ?? 'teach',
    art: { type: 'word', big: t.polishTitle ?? t.title, small: 'Polish grammar · A0-A1', rows },
  };
}

export function quizCard(id: string): Card | null {
  const q = quizzes.find((x) => x.id === id);
  if (!q) return null;
  const count = (type: string) => q.questions.filter((x) => x.type === type).length;
  const chips = [
    count('multiple-choice') && `${count('multiple-choice')} multiple choice`,
    count('fill-in-blank') && `${count('fill-in-blank')} fill in the blank`,
    count('matching') && `${count('matching')} matching`,
  ].filter((c): c is string => !!c);
  return {
    kicker: `Quiz · ${q.questions.length} questions`,
    title: q.title,
    line: q.description,
    path: `/quizzes/${q.id}`,
    pose: 'think',
    art: { type: 'quiz', count: q.questions.length, chips },
  };
}

export function blogCard(post: Post): Card {
  return {
    kicker: blogCategoryStyles[post.category]?.label ?? 'Blog',
    title: post.title,
    line: post.excerpt,
    path: `/blog/${post.slug}`,
    pose: BLOG_POSE[post.category] ?? 'read',
    art: { type: 'photo', src: post.featuredImage },
  };
}

export const STATIC_CARD_PARAMS: { kind: CardKind; slug: string }[] = [
  ...Object.keys(PAGES).map((slug) => ({ kind: 'page' as const, slug })),
  ...lessons.map((l) => ({ kind: 'lesson' as const, slug: l.id })),
  ...grammarTopics.map((t) => ({ kind: 'grammar' as const, slug: t.id })),
  ...quizzes.map((q) => ({ kind: 'quiz' as const, slug: q.id })),
];
