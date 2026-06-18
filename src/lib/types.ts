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
