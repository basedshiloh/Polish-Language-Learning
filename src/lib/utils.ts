export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

// Shared traffic-light classes for SEO scores (CMS list, visualizer, …).
export function seoScoreBadge(score: number): string {
  if (score >= 80) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
  if (score >= 50) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
  return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
}

export function seoScoreText(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
}
