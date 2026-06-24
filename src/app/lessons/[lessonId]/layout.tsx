import type { Metadata } from 'next';
import { lessons } from '@/data/lessons';
import JsonLd, { articleSchema, breadcrumbSchema } from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ lessonId: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return {};

  const title = `${lesson.title} — Polish ${lesson.level} Lesson`;
  const description = `${lesson.description} Includes vocabulary with pronunciation, grammar explanations, dialogues, and practice phrases. Level: ${lesson.level}, ~${lesson.estimatedMinutes} minutes.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | PolishPal`,
      description,
      url: `/lessons/${lesson.id}`,
      type: 'article',
    },
    twitter: { title, description },
    alternates: { canonical: `/lessons/${lesson.id}` },
  };
}

export default async function LessonLayout({ params, children }: Props) {
  const { lessonId } = await params;
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return <>{children}</>;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://polishpal.app' },
        { name: 'Lessons', url: 'https://polishpal.app/lessons' },
        { name: lesson.title, url: `https://polishpal.app/lessons/${lesson.id}` },
      ])} />
      <JsonLd data={articleSchema({
        title: lesson.title,
        description: lesson.description,
        url: `https://polishpal.app/lessons/${lesson.id}`,
      })} />
      {children}
    </>
  );
}
