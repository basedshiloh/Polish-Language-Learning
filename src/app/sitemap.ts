import type { MetadataRoute } from 'next';
import { lessons } from '@/data/lessons';
import { grammarTopics } from '@/data/grammar';
import { quizzes } from '@/data/quizzes';
import { getPublishedPosts } from '@/data/blog';

const BASE = 'https://polishpal.pl';

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

  const blogPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...getPublishedPosts().map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedDate ? new Date(p.updatedDate) : new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  return [...staticPages, ...lessonPages, ...grammarPages, ...quizPages, ...blogPages];
}
