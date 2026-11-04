import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = pageMetadata({
  title: 'Polish Lessons — Learn Polish Step by Step',
  description:
    'Browse 16 free Polish lessons from A0 to A1: greetings, grammar cases, verb conjugations, food and daily routine, with audio pronunciation and exercises.',
  path: '/lessons',
});

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.polishpal.pl' },
        { name: 'Lessons', url: 'https://www.polishpal.pl/lessons' },
      ])} />
      {children}
    </>
  );
}
