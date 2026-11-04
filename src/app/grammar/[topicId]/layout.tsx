import type { Metadata } from 'next';
import { grammarTopics } from '@/data/grammar';
import { pageMetadata, composeDescription, TITLE_MAX } from '@/lib/seo';
import JsonLd, { articleSchema, breadcrumbSchema } from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ topicId: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ topicId: string }> }): Promise<Metadata> {
  const { topicId } = await params;
  const topic = grammarTopics.find((t) => t.id === topicId);
  if (!topic) return {};

  // Keep the Polish name in the title only while the whole title stays short enough.
  const withPolish = `${topic.title}${topic.polishTitle ? ` (${topic.polishTitle})` : ''} — Polish Grammar`;
  const title = withPolish.length <= TITLE_MAX ? withPolish : `${topic.title} — Polish Grammar`;

  return pageMetadata({
    title,
    description: composeDescription(
      topic.description,
      [
        'Polish grammar tables with examples and audio for A0-A1 learners.',
        'Tables and examples with audio for A0-A1 learners.',
        'Tables and examples for A0-A1.',
        'A0-A1 tables.',
      ],
    ),
    path: `/grammar/${topic.id}`,
    type: 'article',
  });
}

export default async function GrammarTopicLayout({ params, children }: Props) {
  const { topicId } = await params;
  const topic = grammarTopics.find((t) => t.id === topicId);
  if (!topic) return <>{children}</>;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.polishpal.pl' },
        { name: 'Grammar', url: 'https://www.polishpal.pl/grammar' },
        { name: topic.title, url: `https://www.polishpal.pl/grammar/${topic.id}` },
      ])} />
      <JsonLd data={articleSchema({
        title: topic.title,
        description: topic.description,
        url: `https://www.polishpal.pl/grammar/${topic.id}`,
      })} />
      {children}
    </>
  );
}
