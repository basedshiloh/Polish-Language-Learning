import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Clock, Plus, Star } from 'lucide-react';
import { getPublishedPosts } from '@/lib/posts';
import { blogCategoryStyles } from '@/data/blog';
import { lessons } from '@/data/lessons';
import { quizzes } from '@/data/quizzes';
import { grammarTopics } from '@/data/grammar';
import JsonLd from '@/components/seo/JsonLd';
import SpeakButton from '@/components/shared/SpeakButton';
import Wycinanka from '@/components/shared/Wycinanka';

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
];

// One papercut colour per path node, cycling.
const NODE_TONES = [
  { bg: 'bg-crimson', edge: 'var(--color-crimson-edge)' },
  { bg: 'bg-orange', edge: 'var(--color-orange-edge)' },
  { bg: 'bg-sun', edge: 'var(--color-sun-edge)' },
  { bg: 'bg-emerald', edge: 'var(--color-emerald-edge)' },
  { bg: 'bg-teal', edge: 'var(--color-teal-edge)' },
  { bg: 'bg-cobalt', edge: 'var(--color-cobalt-edge)' },
  { bg: 'bg-violet', edge: 'var(--color-violet-edge)' },
  { bg: 'bg-fuchsia', edge: 'var(--color-fuchsia-edge)' },
];
// Duolingo-style zig-zag offsets (px) for the path.
const ZIGZAG = [0, 56, 92, 56, 0, -56, -92, -56];

const BYC = [
  ['ja', 'jestem'],
  ['ty', 'jesteś'],
  ['on / ona / ono', 'jest'],
  ['my', 'jesteśmy'],
  ['wy', 'jesteście'],
  ['oni / one', 'są'],
];

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function HomePage() {
  const allPosts = await getPublishedPosts();
  const [featured, ...more] = allPosts.slice(0, 5);
  const ordered = [...lessons].sort((a, b) => a.order - b.order);
  const pathLessons = ordered.slice(0, 8);
  const remaining = ordered.length - pathLessons.length;
  const totalMinutes = ordered.reduce((sum, l) => sum + (l.estimatedMinutes || 0), 0);

  return (
    <>
      <JsonLd data={faqSchema} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="container-pp pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-10 items-center">

            <div className="max-w-xl">
              <h1 className="font-display font-semibold text-[2.9rem] leading-[1.02] sm:text-6xl lg:text-[4.6rem] tracking-[-0.02em] text-ink mb-6 text-balance">
                Polish, <span className="text-crimson">made simple.</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted leading-relaxed mb-9 max-w-md">
                Structured lessons from absolute beginner to A1, built on real university materials. Grammar tables, quizzes, and pronunciation. All free.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/lessons" className="btn btn-primary btn-lg">
                  Start learning free
                </Link>
                <Link href="/blog" className="btn btn-secondary btn-lg">
                  Read the blog
                </Link>
              </div>

              <p className="mt-7 flex items-center gap-2 text-[15px] font-bold text-ink-2">
                <span className="w-5 h-5 rounded-full bg-emerald text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" strokeWidth={3.5} />
                </span>
                Free forever. No sign-up. Progress saved on your device.
              </p>
            </div>

            {/* Phrase card over a papercut flower */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px] mt-10 lg:mt-0">
                <Wycinanka className="absolute -top-[120px] -right-[110px] w-[300px] sm:w-[340px] rotate-[14deg] pointer-events-none" withStem={false} />
                <Wycinanka className="absolute -bottom-[70px] -left-[90px] w-[170px] -rotate-[20deg] pointer-events-none hidden sm:block" withStem={false} />
                <span className="pp-float absolute -top-6 -left-3 sm:-left-8 z-10 chip text-sm bg-sun text-ink shadow-[0_3px_0_var(--color-sun-edge)] [--r:-6deg]">
                  Cześć!
                </span>

                <div className="tile relative overflow-hidden shadow-[0_24px_50px_-24px_rgba(30,33,50,0.35)]">
                  <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <p className="font-display text-xl font-semibold text-ink">Greetings &amp; first words</p>
                    <span className="chip bg-crimson-soft text-crimson-ink">Lesson 1 · A0</span>
                  </div>
                  <ul className="px-3 pb-2">
                    {PHRASES.map((p) => (
                      <li key={p.pl} className="flex items-center gap-3 px-2 py-2.5 border-t-2 border-canvas first:border-t-0">
                        <SpeakButton text={p.pl} />
                        <span className="polish-text text-[17px]">{p.pl}</span>
                        <span className="ml-auto text-sm font-semibold text-muted">{p.en}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="px-5 pb-5 pt-2">
                    <Link href="/lessons" className="btn btn-green w-full">
                      Continue lesson
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── From the blog ────────────────────────────────────────────────── */}
      {featured && (
        <section className="bg-canvas scallop-top pt-4">
          <div className="container-pp py-16 md:py-20">
            <div className="flex items-end justify-between gap-6 mb-10">
              <div>
                <h2 className="font-display text-3xl md:text-[2.6rem] font-semibold tracking-tight text-ink leading-tight">
                  Fresh from the blog
                </h2>
                <p className="mt-2 text-lg text-muted">Culture, words, and the stories behind them.</p>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex btn btn-secondary btn-sm shrink-0">
                All articles
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6">
              {/* Featured */}
              {(() => {
                const cat = blogCategoryStyles[featured.category];
                return (
                  <Link href={`/blog/${featured.slug}`} className="group tile tile-link overflow-hidden flex flex-col">
                    <div className="relative aspect-[16/9] overflow-hidden bg-line">
                      <Image
                        src={featured.featuredImage}
                        alt={featured.featuredImageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                      />
                    </div>
                    <div className="p-6 md:p-7 flex flex-col flex-1">
                      {cat && <span className={`chip self-start mb-3 ${cat.bg} ${cat.text}`}>{cat.label}</span>}
                      <h3 className="font-display text-2xl md:text-[1.9rem] font-semibold leading-tight text-ink group-hover:text-crimson-ink transition-colors text-balance">
                        {featured.title}
                      </h3>
                      <p className="mt-3 text-[15px] text-muted leading-relaxed line-clamp-2">{featured.excerpt}</p>
                      <p className="mt-auto pt-5 text-sm font-semibold text-muted flex items-center gap-1.5">
                        {fmtDate(featured.date)} <span aria-hidden="true">·</span> <Clock className="w-3.5 h-3.5" /> {featured.readingTime} min read
                      </p>
                    </div>
                  </Link>
                );
              })()}

              {/* More */}
              <div className="flex flex-col gap-4">
                {more.map((post) => {
                  const cat = blogCategoryStyles[post.category];
                  return (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group tile tile-link flex gap-4 p-3 pr-4 items-center">
                      <span className="relative w-24 h-20 sm:w-28 sm:h-[5.5rem] rounded-2xl overflow-hidden bg-line shrink-0">
                        <Image src={post.featuredImage} alt={post.featuredImageAlt} fill className="object-cover" sizes="112px" />
                      </span>
                      <span className="min-w-0">
                        {cat && <span className={`chip mb-1.5 ${cat.bg} ${cat.text} !text-[0.65rem] !px-2 !py-0.5`}>{cat.label}</span>}
                        <span className="block font-extrabold text-[15px] leading-snug text-ink line-clamp-2 group-hover:text-crimson-ink transition-colors">
                          {post.title}
                        </span>
                        <span className="block text-xs font-semibold text-muted mt-1">{post.readingTime} min read</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link href="/blog" className="sm:hidden btn btn-secondary w-full mt-6">
              All articles
            </Link>
          </div>
        </section>
      )}

      {/* ── Course path ──────────────────────────────────────────────────── */}
      <section className="container-pp py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <h2 className="font-display text-3xl md:text-[2.6rem] font-semibold tracking-tight text-ink leading-tight text-balance">
              One clear path from zero to&nbsp;A1
            </h2>
            <p className="mt-4 text-lg text-muted leading-relaxed max-w-md">
              {ordered.length} short lessons, in order. Each one gives you vocabulary, real dialogues, a grammar point, and a quiz to lock it in.
            </p>
            <dl className="mt-8 flex flex-wrap gap-3">
              {[
                { v: `${ordered.length}`, l: 'lessons', tone: 'bg-crimson-soft text-crimson-ink' },
                { v: `~${Math.round(totalMinutes / 60)} h`, l: 'of study', tone: 'bg-sun-soft text-sun-ink' },
                { v: `${quizzes.length}`, l: 'quizzes', tone: 'bg-emerald-soft text-emerald-ink' },
              ].map((s) => (
                <div key={s.l} className={`rounded-2xl px-4 py-3 ${s.tone}`}>
                  <dt className="sr-only">{s.l}</dt>
                  <dd className="font-display text-2xl font-semibold leading-none">{s.v}</dd>
                  <dd className="text-xs font-extrabold uppercase tracking-[0.08em] mt-1 opacity-80">{s.l}</dd>
                </div>
              ))}
            </dl>
            <Link href="/lessons" className="btn btn-primary mt-8">
              See all lessons <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ol className="relative flex flex-col items-center gap-7 pt-12 pb-2 lg:pt-2" aria-label="First lessons">
            {pathLessons.map((lesson, i) => {
              const tone = NODE_TONES[i % NODE_TONES.length];
              const x = ZIGZAG[i % ZIGZAG.length];
              return (
                <li
                  key={lesson.id}
                  className="w-full flex justify-center [transform:translateX(calc(var(--x)*0.5))] sm:[transform:translateX(var(--x))]"
                  style={{ '--x': `${x}px` } as React.CSSProperties}
                >
                  <Link href={`/lessons/${lesson.id}`} className="group relative flex flex-col items-center">
                    {i === 0 && (
                      <span className="pp-float absolute -top-11 chip bg-paper border-2 border-line text-crimson-ink text-xs shadow-[0_3px_0_var(--color-line)] whitespace-nowrap">
                        Start here
                      </span>
                    )}
                    <span
                      className={`relative flex items-center justify-center w-[72px] h-[72px] rounded-full text-white font-display text-2xl font-semibold transition-transform duration-100 group-hover:-translate-y-0.5 group-active:translate-y-1.5 ${tone.bg} ${tone.bg === 'bg-sun' || tone.bg === 'bg-orange' ? '!text-ink' : ''}`}
                      style={{ boxShadow: `0 6px 0 ${tone.edge}` }}
                    >
                      {i === 0 ? <Star className="w-8 h-8 fill-current" /> : lesson.order}
                    </span>
                    <span className="mt-3 max-w-[210px] text-center">
                      <span className="block text-[15px] font-extrabold text-ink leading-tight group-hover:text-crimson-ink transition-colors">
                        {lesson.title}
                      </span>
                      <span className="block text-xs font-bold text-muted mt-0.5">
                        {lesson.level} · {lesson.estimatedMinutes} min
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
            {remaining > 0 && (
              <li className="w-full flex justify-center">
                <Link href="/lessons" className="group flex flex-col items-center">
                  <span className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-line text-muted shadow-[0_6px_0_var(--color-line-2)] group-hover:-translate-y-0.5 transition-transform">
                    <Plus className="w-8 h-8" strokeWidth={3} />
                  </span>
                  <span className="mt-3 text-[15px] font-extrabold text-muted">{remaining} more lessons</span>
                </Link>
              </li>
            )}
          </ol>
        </div>
      </section>

      {/* ── Tools bento ──────────────────────────────────────────────────── */}
      <section className="container-pp pb-20 md:pb-28">
        <h2 className="font-display text-3xl md:text-[2.6rem] font-semibold tracking-tight text-ink leading-tight mb-10 max-w-2xl text-balance">
          Everything a beginner needs, in one place
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {/* Grammar — shows a real table */}
          <Link href="/grammar" className="group md:col-span-4 rounded-[28px] bg-violet-soft p-6 md:p-8 flex flex-col md:flex-row gap-8 transition-transform hover:-translate-y-0.5">
            <div className="md:w-[45%]">
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-violet-ink">Grammar reference</h3>
              <p className="mt-3 text-[15px] text-violet-ink/80 font-semibold leading-relaxed">
                {grammarTopics.length} topics: declension tables, conjugation grids and case guides, laid out so you can find a form in seconds.
              </p>
              <span className="btn btn-sm mt-6 bg-violet text-white [--edge:var(--color-violet-edge)]">
                Browse grammar
              </span>
            </div>
            <div className="flex-1 rounded-2xl bg-paper border-2 border-violet/20 overflow-hidden self-start w-full">
              <div className="px-4 py-2.5 bg-paper border-b-2 border-violet-soft flex items-center justify-between">
                <span className="font-extrabold text-sm text-ink">być · to be</span>
                <span className="text-xs font-bold text-muted">present tense</span>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {BYC.map(([pron, form]) => (
                    <tr key={pron} className="border-t-2 border-canvas first:border-t-0">
                      <td className="px-4 py-2 font-semibold text-muted">{pron}</td>
                      <td className="px-4 py-2 polish-text text-right">{form}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Link>

          {/* Quizzes — shows a real question UI */}
          <Link href="/quizzes" className="group md:col-span-2 rounded-[28px] bg-emerald-soft p-6 md:p-8 flex flex-col transition-transform hover:-translate-y-0.5">
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-emerald-ink">{quizzes.length} quizzes</h3>
            <p className="mt-3 text-[15px] text-emerald-ink/80 font-semibold leading-relaxed">Instant feedback after every answer.</p>
            <div className="mt-6 space-y-2" aria-hidden="true">
              <p className="text-sm font-extrabold text-ink mb-3">“Thank you” in Polish?</p>
              {['Proszę', 'Dziękuję', 'Przepraszam'].map((o) => (
                <div
                  key={o}
                  className={`rounded-xl border-2 border-b-4 px-3 py-2 text-sm font-extrabold ${
                    o === 'Dziękuję' ? 'bg-paper border-emerald text-emerald-ink' : 'bg-paper border-line text-ink-2'
                  }`}
                >
                  {o}
                </div>
              ))}
            </div>
          </Link>

          {/* Pronunciation */}
          <Link href="/lessons/phonetics" className="group md:col-span-3 rounded-[28px] bg-sun-soft p-6 md:p-8 transition-transform hover:-translate-y-0.5">
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-sun-ink">Hear every word</h3>
            <p className="mt-3 text-[15px] text-sun-ink/85 font-semibold leading-relaxed max-w-sm">
              Tap the speaker on any Polish word to hear it. Start with the sounds that scare everyone: sz, cz, rz and ś.
            </p>
            <div className="mt-6 flex flex-wrap gap-2" aria-hidden="true">
              {['sz', 'cz', 'rz', 'ś', 'ć', 'ą', 'ę', 'ł'].map((s) => (
                <span key={s} className="w-12 h-12 rounded-2xl bg-paper border-2 border-b-4 border-sun/60 flex items-center justify-center font-display text-xl font-semibold text-ink">
                  {s}
                </span>
              ))}
            </div>
          </Link>

          {/* Progress */}
          <Link href="/progress" className="group md:col-span-3 rounded-[28px] bg-cobalt-soft p-6 md:p-8 transition-transform hover:-translate-y-0.5">
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-cobalt-ink">Your progress stays yours</h3>
            <p className="mt-3 text-[15px] text-cobalt-ink/85 font-semibold leading-relaxed max-w-sm">
              No account needed. Finished lessons and quiz scores are saved in your browser, so you can pick up where you left off.
            </p>
            <div className="mt-7 max-w-sm" aria-hidden="true">
              <div className="h-4 rounded-full bg-paper overflow-hidden">
                <div className="h-full w-2/5 rounded-full bg-emerald relative">
                  <span className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/35" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-canvas scallop-top pt-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-[2.6rem] font-semibold tracking-tight text-ink mb-10 text-center">
            Questions, answered
          </h2>
          <div className="space-y-3">
            {faqSchema.mainEntity.map((item, i) => (
              <details key={item.name} className="group tile px-5 md:px-6" open={i === 0}>
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none font-extrabold text-[17px] text-ink [&::-webkit-details-marker]:hidden">
                  {item.name}
                  <span className="w-8 h-8 rounded-full bg-canvas flex items-center justify-center shrink-0 transition-transform group-open:rotate-45">
                    <Plus className="w-4 h-4 text-muted" strokeWidth={3} />
                  </span>
                </summary>
                <p className="pb-5 -mt-1 text-[16px] text-ink-2 leading-relaxed">{item.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="container-pp pt-20">
        <div className="relative overflow-hidden rounded-[32px] bg-sun px-6 py-14 md:px-14 md:py-16 text-center">
          <Wycinanka className="absolute -left-16 -bottom-24 w-64 opacity-90 hidden sm:block" />
          <Wycinanka className="absolute -right-14 -top-20 w-56 opacity-90 rotate-[160deg] hidden sm:block" withStem={false} />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-ink text-balance">
              Ready for your first Polish word?
            </h2>
            <p className="mt-4 text-lg font-semibold text-sun-ink max-w-lg mx-auto">
              Free. No sign-up. No ads on learning pages. Just Polish.
            </p>
            <Link href="/lessons" className="btn btn-primary btn-lg mt-8">
              Start learning now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
