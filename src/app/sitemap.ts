import type { MetadataRoute } from 'next';
import { lessons } from '@/data/lessons';
import { grammarTopics } from '@/data/grammar';
import { quizzes } from '@/data/quizzes';

const BASE = 'https://polish-language-learning.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/lessons`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/grammar`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/quizzes`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const lessonPages: MetadataRoute.Sitemap = lessons.map((l) => ({
    url: `${BASE}/lessons/${l.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const grammarPages: MetadataRoute.Sitemap = grammarTopics.map((g) => ({
    url: `${BASE}/grammar/${g.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const quizPages: MetadataRoute.Sitemap = quizzes.map((q) => ({
    url: `${BASE}/quizzes/${q.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...lessonPages, ...grammarPages, ...quizPages];
}
