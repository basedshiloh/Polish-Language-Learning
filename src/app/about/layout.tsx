import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = pageMetadata({
  title: 'About — The Story Behind PolishPal',
  description:
    'PolishPal started as a personal study tool for a Polish language exam and grew into a free, open-source resource for everyone learning Polish.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.polishpal.pl' },
        { name: 'About', url: 'https://www.polishpal.pl/about' },
      ])} />
      {children}
    </>
  );
}
