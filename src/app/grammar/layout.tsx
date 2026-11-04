import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import JsonLd, { breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = pageMetadata({
  title: 'Polish Grammar Reference — Tables & Visual Guides',
  description:
    'Polish grammar reference with color-coded tables: noun gender, the four core cases, three conjugations, znać vs wiedzieć vs umieć, telling time and more.',
  path: '/grammar',
});

export default function GrammarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.polishpal.pl' },
        { name: 'Grammar', url: 'https://www.polishpal.pl/grammar' },
      ])} />
      <JsonLd data={faqSchema([
        { question: 'What are the grammatical genders in Polish?', answer: 'Polish has three genders: masculine (rodzaj męski), feminine (rodzaj żeński), and neuter (rodzaj nijaki). Most nouns ending in a consonant are masculine, nouns ending in -a are feminine, and nouns ending in -o or -e are neuter.' },
        { question: 'How many cases does Polish have?', answer: 'Polish has 7 cases. At A0-A1 level, you learn four: Nominative (subject), Accusative (direct object), Instrumental (identity/with), and Genitive (negation/possession).' },
        { question: 'What is the difference between znać, wiedzieć, and umieć?', answer: 'Znać means to know/be familiar with a person or thing. Wiedzieć means to know a fact. Umieć means to know how to do something (a skill). Example: Znam Michała (I know Michał), Wiem, gdzie mieszka (I know where he lives), Umiem pływać (I can swim).' },
      ])} />
      {children}
    </>
  );
}
