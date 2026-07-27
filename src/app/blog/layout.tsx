import type { Metadata } from 'next';
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd';
import AdSenseLoader from '@/components/shared/AdSenseLoader';

export const metadata: Metadata = {
  title: 'Blog — Polish Language Tips & Stories',
  description:
    'Read articles about Polish language learning: grammar deep dives, pronunciation tips, cultural insights, vocabulary building, and student success stories.',
  openGraph: {
    title: 'Blog — Polish Language Tips & Stories | PolishPal',
    description: 'Articles about Polish language learning — grammar deep dives, pronunciation tips, cultural insights, and more.',
    url: '/blog',
  },
  twitter: {
    title: 'Blog — Polish Language Tips | PolishPal',
    description: 'Tips and stories about learning Polish, from grammar to culture.',
  },
  alternates: { canonical: '/blog' },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdSenseLoader />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.polishpal.pl' },
        { name: 'Blog', url: 'https://www.polishpal.pl/blog' },
      ])} />
      {children}
    </>
  );
}
