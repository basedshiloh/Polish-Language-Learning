import type { BlogPost, BlogCategory } from '@/lib/types';

export const blogAuthors = {
  polishpal: {
    name: 'PolishPal Team',
    bio: 'Language educators passionate about making Polish accessible to everyone.',
  },
};

export const blogCategoryStyles: Record<BlogCategory, { label: string; bg: string; text: string; darkBg: string; darkText: string }> = {
  'learning-tips':     { label: 'Learning Tips',     bg: 'bg-blue-100',   text: 'text-blue-700',   darkBg: 'dark:bg-blue-900/30',   darkText: 'dark:text-blue-300' },
  'grammar-deep-dive': { label: 'Grammar Deep Dive', bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-300' },
  'culture':           { label: 'Culture',            bg: 'bg-amber-100',  text: 'text-amber-700',  darkBg: 'dark:bg-amber-900/30',  darkText: 'dark:text-amber-300' },
  'pronunciation':     { label: 'Pronunciation',      bg: 'bg-rose-100',   text: 'text-rose-700',   darkBg: 'dark:bg-rose-900/30',   darkText: 'dark:text-rose-300' },
  'vocabulary':        { label: 'Vocabulary',          bg: 'bg-green-100',  text: 'text-green-700',  darkBg: 'dark:bg-green-900/30',  darkText: 'dark:text-green-300' },
  'student-stories':   { label: 'Student Stories',     bg: 'bg-teal-100',   text: 'text-teal-700',   darkBg: 'dark:bg-teal-900/30',   darkText: 'dark:text-teal-300' },
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-polish-cases-arent-scary',
    title: "Why Polish Cases Aren't as Scary as You Think",
    excerpt: "Cases are the #1 fear for Polish learners. Here's why they're actually more logical than you'd expect — and how to learn them without the headache.",
    category: 'grammar-deep-dive',
    author: blogAuthors.polishpal,
    date: '2026-06-20',
    featuredImage: '/blog/cases.jpg',
    featuredImageAlt: 'Two students studying Polish grammar books together — Photo by Ivan S on Pexels',
    readingTime: 8,
    tags: ['cases', 'grammar', 'beginners'],
    summary: [
      'Polish has 7 cases, but at A0–A1 you only need 4',
      'Cases follow predictable patterns based on noun gender',
      'Think of cases as "job titles" for nouns in a sentence',
    ],
    published: true,
  },
  {
    slug: 'master-polish-pronunciation',
    title: 'Master Polish Pronunciation: A Complete Guide',
    excerpt: 'Polish spelling looks intimidating, but it is actually one of the most consistent languages. Every letter has a fixed sound.',
    category: 'pronunciation',
    author: blogAuthors.polishpal,
    date: '2026-06-18',
    featuredImage: '/blog/pronunciation.jpg',
    featuredImageAlt: 'Close-up of a dictionary page highlighting pronunciation — Photo by Pixabay on Pexels',
    readingTime: 10,
    tags: ['pronunciation', 'phonetics', 'beginners'],
    summary: [
      'Polish has consistent spelling-to-sound rules — no silent letters',
      'Master sz, cz, rz/ż, ś, ć, ź first — they cover 90% of hard sounds',
      'Stress almost always falls on the second-to-last syllable',
    ],
    published: true,
  },
  {
    slug: 'top-10-mistakes-beginners-make',
    title: 'Top 10 Mistakes Polish Beginners Make (And How to Fix Them)',
    excerpt: 'Every Polish learner makes these mistakes. Knowing them in advance will save you months of bad habits.',
    category: 'learning-tips',
    author: blogAuthors.polishpal,
    date: '2026-06-15',
    featuredImage: '/blog/mistakes.jpg',
    featuredImageAlt: 'Notebook with crossed out words representing common learning mistakes — Photo by KATRIN BOLOVTSOVA on Pexels',
    readingTime: 7,
    tags: ['mistakes', 'beginners', 'tips'],
    summary: [
      'Confusing gender agreement is the most common issue',
      'Forgetting to change verb endings for each person',
      'Using English word order in Polish sentences',
    ],
    published: true,
  },
  {
    slug: 'polish-food-culture-guide',
    title: 'A Foodie\'s Guide to Polish Culture Through Cuisine',
    excerpt: 'From pierogi to bigos, Polish food tells the story of a nation. Learn the vocabulary and customs around the Polish table.',
    category: 'culture',
    author: blogAuthors.polishpal,
    date: '2026-06-12',
    featuredImage: '/blog/food.jpg',
    featuredImageAlt: 'Freshly made pierogi dusted with flour on a wooden board — Photo by kaboompics on Pexels',
    readingTime: 6,
    tags: ['food', 'culture', 'vocabulary'],
    summary: [
      'Pierogi, bigos, and żurek are Poland\'s national dishes',
      'Polish meals follow a specific daily rhythm: śniadanie → obiad → kolacja',
      'Learning food vocabulary is the fastest way to connect with Poles',
    ],
    published: true,
  },
  {
    slug: 'polish-verb-conjugation-patterns',
    title: 'The 3 Polish Verb Conjugation Patterns Explained Simply',
    excerpt: 'Polish verbs follow three main patterns. Once you learn these, you can conjugate hundreds of verbs correctly.',
    category: 'grammar-deep-dive',
    author: blogAuthors.polishpal,
    date: '2026-06-10',
    featuredImage: '/blog/verbs.jpg',
    featuredImageAlt: 'Students studying verb conjugation at a whiteboard — Photo by Thirdman on Pexels',
    readingTime: 9,
    tags: ['verbs', 'conjugation', 'grammar'],
    summary: [
      'Pattern 1 (-am/-asz): the most common, e.g. czytam, mam',
      'Pattern 2 (-ę/-isz or -ysz): e.g. mówię, robię',
      'Pattern 3 (-uję/-ujesz): e.g. kupuję, pracuję',
    ],
    published: true,
  },
  {
    slug: 'how-to-build-a-study-routine',
    title: 'How to Build a Polish Study Routine That Actually Sticks',
    excerpt: 'Consistency beats intensity. Here is a realistic daily routine that will get you from A0 to A1 in 3 months.',
    category: 'learning-tips',
    author: blogAuthors.polishpal,
    date: '2026-06-08',
    featuredImage: '/blog/routine.jpg',
    featuredImageAlt: 'Cozy workspace with laptop, coffee, and book for daily study — Photo by Esra Saltürk on Pexels',
    readingTime: 5,
    tags: ['study', 'routine', 'motivation'],
    summary: [
      '20 minutes daily beats 2-hour weekend sessions',
      'Mix input (reading/listening) with output (speaking/writing)',
      'Track your streak — it builds momentum',
    ],
    published: true,
  },
  {
    slug: 'essential-polish-phrases-for-travelers',
    title: '50 Essential Polish Phrases Every Traveler Needs',
    excerpt: 'Heading to Poland? These 50 phrases will help you navigate airports, restaurants, shops, and conversations with locals.',
    category: 'vocabulary',
    author: blogAuthors.polishpal,
    date: '2026-06-05',
    featuredImage: '/blog/travel.jpg',
    featuredImageAlt: 'Historic architecture of Kraków Market Square, Poland — Photo by Piotr Kalinowski on Pexels',
    readingTime: 8,
    tags: ['phrases', 'travel', 'vocabulary'],
    summary: [
      '"Dzień dobry" and "Przepraszam" are your two most important words',
      'Learn numbers 1–20 for prices, addresses, and time',
      'Poles love hearing foreigners try Polish — don\'t be shy!',
    ],
    published: true,
  },
  {
    slug: 'understanding-polish-gender',
    title: 'Understanding Polish Noun Gender: Masculine, Feminine, Neuter',
    excerpt: 'Every Polish noun has a gender. Here is how to identify it instantly from the word ending — with a few tricky exceptions.',
    category: 'grammar-deep-dive',
    author: blogAuthors.polishpal,
    date: '2026-06-03',
    featuredImage: '/blog/gender.jpg',
    featuredImageAlt: 'Scrabble letter tiles arranged into the alphabet — Photo by DS stories on Pexels',
    readingTime: 7,
    tags: ['gender', 'nouns', 'grammar'],
    summary: [
      'Consonant ending → usually masculine (dom, kot, student)',
      '-a ending → usually feminine (kobieta, szkoła, herbata)',
      '-o or -e ending → usually neuter (mleko, okno, morze)',
    ],
    published: true,
  },
  {
    slug: 'polish-holidays-and-traditions',
    title: 'Polish Holidays & Traditions: A Cultural Calendar',
    excerpt: 'From Wigilia to Śmigus-Dyngus, Polish traditions are vibrant and deeply rooted. Learn what Poles celebrate and why.',
    category: 'culture',
    author: blogAuthors.polishpal,
    date: '2026-06-01',
    featuredImage: '/blog/holidays.jpg',
    featuredImageAlt: 'Festively adorned horses in Kraków old town on a winter day — Photo by Janusz Mitura on Pexels',
    readingTime: 6,
    tags: ['holidays', 'traditions', 'culture'],
    summary: [
      'Wigilia (Christmas Eve) is the most important family gathering',
      'Imieniny (name day) is often celebrated more than birthdays',
      'Śmigus-Dyngus (Wet Monday) — yes, people splash water on each other',
    ],
    published: true,
  },
  {
    slug: 'znac-wiedziec-umiec-explained',
    title: 'Znać vs Wiedzieć vs Umieć: Which "To Know" Do You Need?',
    excerpt: 'Polish has three words for "to know" and using the wrong one is a dead giveaway. Here is the definitive guide.',
    category: 'vocabulary',
    author: blogAuthors.polishpal,
    date: '2026-05-28',
    featuredImage: '/blog/know.jpg',
    featuredImageAlt: 'Close-up of an open dictionary showing vocabulary entries — Photo by freestocks.org on Pexels',
    readingTime: 6,
    tags: ['vocabulary', 'verbs', 'confusing-words'],
    summary: [
      'Znać = to know/be familiar with (a person, place, thing)',
      'Wiedzieć = to know a fact (followed by że/jak/gdzie/etc.)',
      'Umieć = to know how to (a skill, ability)',
    ],
    published: true,
  },
];

export function getPublishedPosts(): BlogPost[] {
  return blogPosts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRelatedPosts(slug: string, category: string, limit = 3): BlogPost[] {
  return getPublishedPosts()
    .filter((p) => p.category === category && p.slug !== slug)
    .slice(0, limit);
}

export function getPaginatedPosts(page: number, perPage = 9, category?: string) {
  let posts = getPublishedPosts();
  if (category && category in blogCategoryStyles) {
    posts = posts.filter((p) => p.category === category);
  }
  const totalPages = Math.ceil(posts.length / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (currentPage - 1) * perPage;
  return {
    posts: posts.slice(start, start + perPage),
    currentPage,
    totalPages,
    totalPosts: posts.length,
    activeCategory: category && category in blogCategoryStyles ? category : undefined,
  };
}
