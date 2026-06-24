interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PolishPal',
    url: 'https://polishpal.app',
    description: 'Free interactive Polish language learning app — lessons, grammar reference, and quizzes from A0 to A1.',
    inLanguage: ['en', 'pl'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://polishpal.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function courseSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Polish Language A0–A1',
    description: 'Complete Polish language course from absolute beginner (A0) to elementary (A1). Covers greetings, grammar cases, conjugations, vocabulary, and daily conversations.',
    provider: {
      '@type': 'Organization',
      name: 'PolishPal',
      url: 'https://polishpal.app',
    },
    educationalLevel: 'Beginner',
    inLanguage: 'pl',
    teaches: 'Polish language fundamentals: pronunciation, grammar cases (Nominative, Accusative, Instrumental, Genitive), three conjugation patterns, vocabulary for daily life.',
    isAccessibleForFree: true,
    coursePrerequisites: 'No prior knowledge of Polish required.',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: 'PT20H',
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema({
  title,
  description,
  url,
  datePublished = '2026-06-01',
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: '2026-06-20',
    author: { '@type': 'Organization', name: 'PolishPal' },
    publisher: { '@type': 'Organization', name: 'PolishPal' },
    inLanguage: ['en', 'pl'],
    isAccessibleForFree: true,
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
