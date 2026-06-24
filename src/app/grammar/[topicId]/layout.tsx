import type { Metadata } from 'next';
import { grammarTopics } from '@/data/grammar';
import JsonLd, { articleSchema, breadcrumbSchema } from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ topicId: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ topicId: string }> }): Promise<Metadata> {
  const { topicId } = await params;
  const topic = grammarTopics.find((t) => t.id === topicId);
  if (!topic) return {};

  const title = `${topic.title}${topic.polishTitle ? ` (${topic.polishTitle})` : ''} — Polish Grammar`;
  const description = `${topic.description} Visual tables, examples with pronunciation, and tips for Polish learners at A0-A1 level.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | PolishPal`,
      description,
      url: `/grammar/${topic.id}`,
      type: 'article',
    },
    twitter: { title, description },
    alternates: { canonical: `/grammar/${topic.id}` },
  };
}

export default async function GrammarTopicLayout({ params, children }: Props) {
  const { topicId } = await params;
  const topic = grammarTopics.find((t) => t.id === topicId);
  if (!topic) return <>{children}</>;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://polishpal.app' },
        { name: 'Grammar', url: 'https://polishpal.app/grammar' },
        { name: topic.title, url: `https://polishpal.app/grammar/${topic.id}` },
      ])} />
      <JsonLd data={articleSchema({
        title: topic.title,
        description: topic.description,
        url: `https://polishpal.app/grammar/${topic.id}`,
      })} />
      {children}
    </>
  );
}
