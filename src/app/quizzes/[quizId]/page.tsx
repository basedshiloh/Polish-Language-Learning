import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { quizzes } from '@/data/quizzes';
import QuizClient from './QuizClient';

interface Props {
  params: Promise<{ quizId: string }>;
}

export function generateStaticParams() {
  return quizzes.map((q) => ({ quizId: q.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { quizId } = await params;
  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) return {};

  const title = `${quiz.title} | PolishPal`;
  const description = `${quiz.description} ${quiz.questions.length} questions with instant feedback — multiple choice, fill-in-the-blank, and matching.`;
  const url = `/quizzes/${quiz.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function QuizPage({ params }: Props) {
  const { quizId } = await params;
  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) notFound();
  return <QuizClient quiz={quiz} />;
}
