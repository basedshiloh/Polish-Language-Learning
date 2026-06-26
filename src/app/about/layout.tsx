import type { Metadata } from 'next';
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'About — The Story Behind PolishPal',
  description:
    'PolishPal started as a personal study tool for a Polish language exam and grew into a free, open-source resource for everyone learning Polish.',
  openGraph: {
    title: 'About PolishPal — Why This Website Exists',
    description: 'A personal project born from exam prep, built with love for Polish culture. Free and open-source.',
    url: '/about',
  },
  alternates: { canonical: '/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://polishpal.pl' },
        { name: 'About', url: 'https://polishpal.pl/about' },
      ])} />
      {children}
    </>
  );
}
