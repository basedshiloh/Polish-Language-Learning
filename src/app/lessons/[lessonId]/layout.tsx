import type { Metadata } from 'next';
import { lessons } from '@/data/lessons';
import { quizzes } from '@/data/quizzes';
import { pageMetadata, composeDescription } from '@/lib/seo';
import JsonLd, { articleSchema, breadcrumbSchema } from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ lessonId: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return {};

  const parts = lesson.content.some((b) => b.type === 'dialogue') ? 'vocabulary and dialogues' : 'vocabulary and example phrases';
  const quiz = lesson.relatedQuizId ? quizzes.find((q) => q.id === lesson.relatedQuizId) : undefined;
  return pageMetadata({
    title: `${lesson.title} — Polish ${lesson.level} Lesson`,
    description: composeDescription(
      lesson.description,
      [
        `Free Polish ${lesson.level} lesson with audio pronunciation, ${parts}, about ${lesson.estimatedMinutes} minutes.`,
        `Free Polish ${lesson.level} lesson with audio, ${parts}.`,
        `Free ${lesson.level} lesson with audio pronunciation.`,
        `Free ${lesson.level} lesson with audio.`,
      ],
      quiz && ['Ends with a practice quiz.'],
    ),
    path: `/lessons/${lesson.id}`,
    type: 'article',
  });
}

export default async function LessonLayout({ params, children }: Props) {
  const { lessonId } = await params;
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return <>{children}</>;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.polishpal.pl' },
        { name: 'Lessons', url: 'https://www.polishpal.pl/lessons' },
        { name: lesson.title, url: `https://www.polishpal.pl/lessons/${lesson.id}` },
      ])} />
      <JsonLd data={articleSchema({
        title: lesson.title,
        description: lesson.description,
        url: `https://www.polishpal.pl/lessons/${lesson.id}`,
      })} />
      {children}
    </>
  );
}
