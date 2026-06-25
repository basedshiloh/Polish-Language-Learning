import type { Metadata } from 'next';
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Polish Quizzes — Test Your Knowledge',
  description:
    'Take 16 interactive Polish language quizzes covering greetings, grammar cases, conjugations, food vocabulary, and more. Multiple choice, fill-in-the-blank, and matching exercises.',
  openGraph: {
    title: 'Polish Quizzes — Test Your Knowledge | PolishPal',
    description: '16 interactive quizzes to test your Polish. Multiple choice, fill-in-the-blank, and matching exercises with instant feedback.',
    url: '/quizzes',
  },
  twitter: {
    title: 'Polish Language Quizzes | PolishPal',
    description: 'Test your Polish with 16 quizzes — greetings, cases, conjugations, food, time, and more.',
  },
  alternates: { canonical: '/quizzes' },
};

export default function QuizzesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://polishpal.pl' },
        { name: 'Quizzes', url: 'https://polishpal.pl/quizzes' },
      ])} />
      {children}
    </>
  );
}
