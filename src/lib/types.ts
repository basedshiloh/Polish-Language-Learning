export type LessonLevel = 'A0' | 'A1';

export type ContentBlockType =
  | 'vocabulary'
  | 'grammar'
  | 'dialogue'
  | 'phrases'
  | 'cultural-note';

export interface VocabularyItem {
  polish: string;
  english: string;
  pronunciation?: string;
  example?: string;
  exampleTranslation?: string;
}

export interface GrammarPoint {
  title: string;
  explanation: string;
  examples: {
    polish: string;
    english: string;
  }[];
  tip?: string;
}

export interface DialogueLine {
  speaker: string;
  polish: string;
  english: string;
}

export interface Phrase {
  polish: string;
  english: string;
  pronunciation?: string;
  category?: string;
}

export interface ContentBlock {
  type: ContentBlockType;
  title: string;
  vocabulary?: VocabularyItem[];
  grammar?: GrammarPoint[];
  dialogue?: DialogueLine[];
  phrases?: Phrase[];
  culturalNote?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: LessonLevel;
  order: number;
  estimatedMinutes: number;
  icon: string;
  content: ContentBlock[];
  relatedQuizId?: string;
}

export type QuestionType = 'multiple-choice' | 'fill-in-blank' | 'matching';

export interface MultipleChoiceQuestion {
  type: 'multiple-choice';
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface FillInBlankQuestion {
  type: 'fill-in-blank';
  id: string;
  prompt: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  hint?: string;
  explanation?: string;
}

export interface MatchingQuestion {
  type: 'matching';
  id: string;
  prompt: string;
  pairs: {
    left: string;
    right: string;
  }[];
}

export type Question =
  | MultipleChoiceQuestion
  | FillInBlankQuestion
  | MatchingQuestion;

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export interface QuizAttempt {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  answers: {
    questionId: string;
    correct: boolean;
    userAnswer: string;
  }[];
}

export interface UserProgress {
  lessonProgress: Record<string, LessonProgress>;
  quizAttempts: Record<string, QuizAttempt[]>;
  lastVisited?: string;
  streak: {
    current: number;
    lastActiveDate: string;
  };
}

// ─── Grammar Reference Types ──────────────────────────────

export type GrammarCategory =
  | 'pronunciation'
  | 'nouns'
  | 'cases'
  | 'verbs'
  | 'numbers'
  | 'practical';

export type TableColor = 'blue' | 'pink' | 'green' | 'amber' | 'purple' | 'gray';

export interface GrammarTable {
  caption?: string;
  headers: string[];
  rows: string[][];
  // Tint entire columns (e.g., gender colors). Index matches headers; null = no tint.
  columnColors?: (TableColor | null)[];
  // Render the first column as bold row-headers.
  highlightFirstCol?: boolean;
  footnote?: string;
}

export interface GrammarComparisonItem {
  title: string;        // e.g. "ZNAĆ"
  subtitle: string;     // e.g. "to know / be familiar with"
  color: TableColor;
  usage: string;        // when to use it
  structure: string;    // e.g. "znać + Biernik (Accusative)"
  examples: { polish: string; english: string }[];
}

export interface FrequencyItem {
  polish: string;
  english: string;
  pronunciation?: string;
  percent: number; // 0 (never) – 100 (always); drives the visual bar
}

export type GrammarSectionType =
  | 'text'
  | 'table'
  | 'examples'
  | 'comparison'
  | 'frequency'
  | 'note';

export interface GrammarSection {
  type: GrammarSectionType;
  title?: string;
  text?: string;
  table?: GrammarTable;
  examples?: { polish: string; english: string; note?: string }[];
  comparison?: GrammarComparisonItem[];
  frequency?: FrequencyItem[];
  note?: string;
  noteType?: 'tip' | 'warning' | 'info';
}

export interface GrammarTopic {
  id: string;
  title: string;
  polishTitle?: string;
  description: string;
  category: GrammarCategory;
  icon: string;
  order: number;
  sections: GrammarSection[];
}

// ─── Blog ────────────────────────────────────────────────

export type BlogCategory =
  | 'learning-tips'
  | 'grammar-deep-dive'
  | 'culture'
  | 'pronunciation'
  | 'vocabulary';

export interface BlogAuthor {
  name: string;
  avatar?: string;
  bio: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: BlogAuthor;
  date: string;
  updatedDate?: string;
  featuredImage: string;
  featuredImageAlt: string;
  readingTime: number;
  tags: string[];
  summary: string[];
  published: boolean;
}

export type PostStatus = 'draft' | 'published';
export type PostIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';

// CMS-managed post (maps to the Supabase `posts` table). Shaped to stay
// compatible with the blog components that previously consumed BlogPost.
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  focusKeyword: string;
  category: BlogCategory;
  author: BlogAuthor;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  summary: string[];
  tags: string[];
  readingTime: number;
  status: PostStatus;
  intent: PostIntent;
  isPillar: boolean;
  pillarId: string | null;
  seoScore: number;
  date: string;        // published_at (or created_at) ISO string
  updatedDate?: string; // updated_at ISO string
}
