import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Progress — Track Your Polish Learning',
  description: 'Track your Polish learning journey: lesson completion, quiz scores, study streaks, and areas to improve.',
  robots: { index: false },
};

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
