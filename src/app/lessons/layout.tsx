import type { Metadata } from 'next';
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Polish Lessons — Learn Polish Step by Step',
  description:
    'Browse 16 structured Polish lessons from A0 to A1. Learn greetings, grammar cases, conjugations, food vocabulary, daily routine, and more — with pronunciation guides and exercises.',
  openGraph: {
    title: 'Polish Lessons — Learn Polish Step by Step | PolishPal',
    description:
      '16 structured lessons covering Polish from absolute beginner to elementary. Each lesson includes vocabulary tables, grammar explanations, dialogues, and cultural notes.',
    url: '/lessons',
  },
  twitter: {
    title: 'Polish Lessons — A0 to A1 | PolishPal',
    description: '16 structured Polish lessons with vocabulary, grammar, dialogues, and pronunciation guides.',
  },
  alternates: { canonical: '/lessons' },
};

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://polishpal.app' },
        { name: 'Lessons', url: 'https://polishpal.app/lessons' },
      ])} />
      {children}
    </>
  );
}
