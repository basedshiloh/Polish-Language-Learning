import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Table2, Brain, CheckCircle, Clock } from 'lucide-react';
import { getPublishedPosts } from '@/lib/posts';
import { blogCategoryStyles } from '@/data/blog';
import { lessons } from '@/data/lessons';
import { quizzes } from '@/data/quizzes';
import { grammarTopics } from '@/data/grammar';
import JsonLd from '@/components/seo/JsonLd';

export const revalidate = 3600;

export const metadata = {
  title: 'PolishPal — Learn Polish Free | A0 to A1 Course',
  description: 'Free Polish language course from absolute beginner (A0) to elementary (A1). Structured lessons, grammar tables, quizzes — no sign-up required.',
  alternates: { canonical: 'https://www.polishpal.pl' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is PolishPal free to use?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, completely free. No sign-up, no subscription, and no credit card required.' },
    },
    {
      '@type': 'Question',
      name: 'What level does this Polish course cover?',
      acceptedAnswer: { '@type': 'Answer', text: 'PolishPal covers A0 (absolute beginner) to A1 (elementary) level following the CEFR framework.' },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account?',
      acceptedAnswer: { '@type': 'Answer', text: 'No account needed. Start learning immediately — your progress is saved locally in your browser.' },
    },
    {
      '@type': 'Question',
      name: 'What will I learn in the A0–A1 course?',
      acceptedAnswer: { '@type': 'Answer', text: 'You will learn everyday Polish: greetings, numbers, telling the time, the four main grammatical cases, verb conjugation patterns, and practical vocabulary.' },
    },
  ],
};

const PHRASES = [
  { pl: 'Dzień dobry', en: 'Good morning' },
  { pl: 'Dziękuję', en: 'Thank you' },
  { pl: 'Przepraszam', en: 'Excuse me' },
  { pl: 'Jak się masz?', en: 'How are you?' },
  { pl: 'Do widzenia', en: 'Goodbye' },
  { pl: 'Proszę', en: 'Please' },
];

const FEATURES = [
  {
    icon: BookOpen,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    title: 'Structured Lessons',
    desc: 'A0-to-A1 curriculum built on real university materials. Clear explanations, vocabulary, and dialogue in every lesson.',
  },
  {
    icon: Table2,
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    title: 'Grammar Reference',
    desc: 'Declension tables, conjugation grids, and case guides — everything a beginner needs in one place.',
  },
  {
    icon: Brain,
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    title: 'Practice Quizzes',
    desc: 'Immediate feedback, score tracking, and spaced repetition to lock in what you learn.',
  },
];

const STEPS = [
  { n: '01', title: 'Pick a lesson', desc: 'Choose any topic from the A0–A1 path, or jump straight to a grammar table.' },
  { n: '02', title: 'Learn with examples', desc: 'Study vocabulary, listen to pronunciation, and read real dialogues.' },
  { n: '03', title: 'Test yourself', desc: 'Take the lesson quiz, see your score instantly, and track your streak.' },
];

export default async function HomePage() {
  const allPosts = await getPublishedPosts();
  const latestPosts = allPosts.slice(0, 3);

  return (
    <>
      <JsonLd data={faqSchema} />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-950 pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Background gradient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-[600px] h-[600px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute top-1/2 -left-32 w-[400px] h-[400px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — copy */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Free · No sign-up · A0 → A1
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight text-gray-900 dark:text-gray-100 leading-[1.1] mb-6">
                Polish,{' '}
                <span className="text-blue-600 dark:text-blue-400">made simple.</span>
              </h1>

              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-md">
                Structured lessons from absolute beginner to A1 — built on real university materials. Grammar tables, quizzes, and pronunciation. All free.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/lessons"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-colors shadow-md shadow-blue-600/20 text-sm"
                >
                  Start Learning — It&apos;s Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/grammar"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-xl transition-colors text-sm"
                >
                  Browse Grammar
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-8">
                {[
                  'No registration',
                  'Learn at your pace',
                  'Progress saved locally',
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — decorative lesson card */}
            <div className="hidden lg:flex justify-center">
              <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-black/40 overflow-hidden">
                <div className="bg-blue-600 px-5 py-4">
                  <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-0.5">Lesson 1</p>
                  <p className="text-white font-bold text-lg leading-tight">Greetings &amp; First Words</p>
                </div>
                <div className="px-5 py-4 space-y-1">
                  {PHRASES.map((p) => (
                    <div key={p.pl} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                      <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm">{p.pl}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{p.en}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Lesson progress</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">75%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-blue-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            {[
              { value: `${lessons.length}`, label: 'Structured Lessons' },
              { value: `${grammarTopics.length}`, label: 'Grammar Topics' },
              { value: `${quizzes.length}`, label: 'Practice Quizzes' },
              { value: 'A0 → A1', label: 'CEFR Path' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wide font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              Everything you need to start speaking Polish
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Designed for absolute beginners — clear, structured, and completely free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md dark:hover:shadow-black/20 transition-shadow bg-white dark:bg-gray-900">
                <div className={`inline-flex w-11 h-11 rounded-xl items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              How PolishPal works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-start">
                <span className="text-5xl font-black text-blue-100 dark:text-blue-900/60 leading-none mb-4">{n}</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/lessons"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-blue-600/20 text-sm"
            >
              Go to Lessons <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Latest Blog Posts ─────────────────────────────────────────────────── */}
      {latestPosts.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                  From the Blog
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Tips, grammar deep dives, culture, and more.</p>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0">
                View all posts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => {
                const cat = blogCategoryStyles[post.category];
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg dark:hover:shadow-black/30 transition-shadow bg-white dark:bg-gray-900 flex flex-col"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={post.featuredImage}
                        alt={post.featuredImageAlt}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      {cat && (
                        <span className={`self-start text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 ${cat.bg} ${cat.text} ${cat.darkBg} ${cat.darkText}`}>
                          {cat.label}
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-3">
                        {post.title}
                      </h3>
                      <div className="mt-auto flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min read
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="sm:hidden text-center mt-6">
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                View all posts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-10 text-center">
            Frequently asked questions
          </h2>
          <dl className="space-y-6">
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                <dt className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">{item.name}</dt>
                <dd className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.acceptedAnswer.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
            Ready to start learning Polish?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Free. No sign-up. No ads on learning pages. Just Polish.
          </p>
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl transition-colors shadow-lg text-base"
          >
            Start Learning Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
