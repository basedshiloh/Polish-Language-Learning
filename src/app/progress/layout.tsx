import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Your Progress — Track Your Polish Learning',
  description: 'Track your Polish learning journey: lesson completion, quiz scores, study streaks, and areas to improve.',
  path: '/progress',
  robots: { index: false },
});

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
