'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProgress, QuizAttempt } from '@/lib/types';
import { STORAGE_KEY } from '@/lib/constants';
import { lessons } from '@/data/lessons';

const DEFAULT_PROGRESS: UserProgress = {
  lessonProgress: {},
  quizAttempts: {},
  streak: {
    current: 0,
    lastActiveDate: '',
  },
};

function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_PROGRESS;
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setMounted(true);
  }, []);

  const persist = useCallback((updated: UserProgress) => {
    setProgress(updated);
    saveProgress(updated);
  }, []);

  const updateStreak = useCallback((current: UserProgress): UserProgress => {
    const today = getToday();
    const { lastActiveDate, current: streak } = current.streak;

    if (lastActiveDate === today) return current;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const newStreak = lastActiveDate === yesterdayStr ? streak + 1 : 1;
    return {
      ...current,
      streak: { current: newStreak, lastActiveDate: today },
    };
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const updated = updateStreak({
        ...prev,
        lessonProgress: {
          ...prev.lessonProgress,
          [lessonId]: {
            lessonId,
            completed: true,
            completedAt: new Date().toISOString(),
          },
        },
        lastVisited: lessonId,
      });
      saveProgress(updated);
      return updated;
    });
  }, [updateStreak]);

  const unmarkLessonComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const rest = { ...prev.lessonProgress };
      delete rest[lessonId];
      const updated = {
        ...prev,
        lessonProgress: rest,
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const saveQuizAttempt = useCallback((attempt: QuizAttempt) => {
    setProgress((prev) => {
      const existing = prev.quizAttempts[attempt.quizId] || [];
      const updated = updateStreak({
        ...prev,
        quizAttempts: {
          ...prev.quizAttempts,
          [attempt.quizId]: [...existing, attempt],
        },
        lastVisited: attempt.quizId,
      });
      saveProgress(updated);
      return updated;
    });
  }, [updateStreak]);

  const getQuizBestScore = useCallback((quizId: string): number | null => {
    const attempts = progress.quizAttempts[quizId];
    if (!attempts || attempts.length === 0) return null;
    return Math.max(...attempts.map((a) => a.score));
  }, [progress.quizAttempts]);

  const getLessonStatus = useCallback((lessonId: string): boolean => {
    return progress.lessonProgress[lessonId]?.completed ?? false;
  }, [progress.lessonProgress]);

  const getOverallCompletion = useCallback(() => {
    const total = lessons.length;
    const completed = Object.values(progress.lessonProgress).filter((l) => l.completed).length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [progress.lessonProgress]);

  const resetProgress = useCallback(() => {
    persist(DEFAULT_PROGRESS);
  }, [persist]);

  return {
    progress,
    mounted,
    markLessonComplete,
    unmarkLessonComplete,
    saveQuizAttempt,
    getQuizBestScore,
    getLessonStatus,
    getOverallCompletion,
    resetProgress,
  };
}
