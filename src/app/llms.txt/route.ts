import { lessons } from '@/data/lessons';
import { grammarTopics } from '@/data/grammar';
import { quizzes } from '@/data/quizzes';
import { getPublishedPosts } from '@/lib/posts';

const BASE = 'https://www.polishpal.pl';

export const revalidate = 3600;

export async function GET() {
  const posts = await getPublishedPosts();

  const lessonLines = [...lessons]
    .sort((a, b) => a.order - b.order)
    .map((l) => `- [${l.title}](${BASE}/lessons/${l.id}): ${l.description}`)
    .join('\n');

  const grammarLines = [...grammarTopics]
    .sort((a, b) => a.order - b.order)
    .map((g) => `- [${g.title}](${BASE}/grammar/${g.id}): ${g.description}`)
    .join('\n');

  const quizLines = quizzes
    .map((q) => `- [${q.title}](${BASE}/quizzes/${q.id})`)
    .join('\n');

  const blogLines = posts.length
    ? posts.map((p) => `- [${p.title}](${BASE}/blog/${p.slug}): ${p.excerpt}`).join('\n')
    : '- [Blog](' + BASE + '/blog)';

  const body = `# PolishPal

> Free, open-source Polish language learning for absolute beginners (A0–A1). Interactive lessons, visual grammar references, quizzes, and a blog — built from real university materials and reviewed by a native Polish speaker.

PolishPal is a non-commercial educational resource dedicated to the public domain under CC0 1.0. It covers Polish pronunciation, noun gender, the grammatical cases (Nominative, Accusative, Instrumental, Genitive), the three verb conjugation patterns, everyday vocabulary, and practical phrases. The site is created by a Polish learner (not a native speaker or professional educator) with content reviewed by a native speaker; corrections are welcome on GitHub.

## Lessons
${lessonLines}

## Grammar Reference
${grammarLines}

## Quizzes
${quizLines}

## Blog
${blogLines}

## About
- [About PolishPal](${BASE}/about): The story behind the project and its limitations.
- [Editorial Policy](${BASE}/editorial): How content is created, reviewed, and corrected.
- [Contact](${BASE}/contact): How to report mistakes or contribute.

## Optional
- [Privacy Policy](${BASE}/privacy)
- [Cookie Policy](${BASE}/cookies)
- [Changelog](${BASE}/changelog)
- [GitHub Repository](https://github.com/basedshiloh/Polish-Language-Learning)
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
