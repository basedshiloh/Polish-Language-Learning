import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = pageMetadata({
  title: 'Polish Quizzes — Test Your Knowledge',
  description:
    'Take 16 free interactive Polish quizzes on greetings, grammar cases, conjugations and food vocabulary, with multiple choice, fill-in and matching questions.',
  path: '/quizzes',
});

export default function QuizzesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.polishpal.pl' },
        { name: 'Quizzes', url: 'https://www.polishpal.pl/quizzes' },
      ])} />
      {children}
    </>
  );
}
