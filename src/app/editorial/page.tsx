import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Users, BookOpen, RefreshCw, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description: 'How PolishPal ensures content accuracy: our review process, sources, contributor guidelines, and commitment to corrections.',
  alternates: { canonical: '/editorial' },
};

const h2 = 'text-2xl md:text-[1.75rem] font-bold leading-tight';
const link = 'font-bold text-cobalt-ink underline decoration-2 underline-offset-4 decoration-cobalt/30 hover:decoration-cobalt transition-colors';
const list = 'tile px-6 py-5 pl-10 md:pl-11 list-disc marker:text-crimson space-y-2.5';

function SectionHeading({ icon: Icon, tone, children }: { icon: typeof BookOpen; tone: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className={`icon-badge w-10 h-10 rounded-xl ${tone}`}>
        <Icon className="w-5 h-5" strokeWidth={2.4} />
      </span>
      <h2 className={h2}>{children}</h2>
    </div>
  );
}

export default function EditorialPage() {
  return (
    <div>
      <div className="bg-canvas border-b-2 border-line">
        <div className="container-pp py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold">Editorial Policy</h1>
            <p className="text-muted text-lg mt-4">
              How we create, review, and maintain the content on PolishPal.
            </p>
          </div>
        </div>
      </div>

      <div className="container-pp py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-14 text-[17px] md:text-lg leading-relaxed text-ink-2">
          <section>
            <SectionHeading icon={BookOpen} tone="bg-crimson-soft text-crimson-ink">Content sources</SectionHeading>
            <p className="mb-5">
              The lessons and grammar references on PolishPal are based on:
            </p>
            <ul className={list}>
              <li>
                <strong className="text-ink">University lecture materials</strong> — The original content was extracted from 37 real
                Polish language lectures (A0–A1 level) used in an academic setting.
              </li>
              <li>
                <strong className="text-ink">Standard Polish language textbooks</strong> — Grammar rules and conjugation patterns are
                cross-referenced with established Polish language teaching materials.
              </li>
              <li>
                <strong className="text-ink">Native speaker review</strong> — A native Polish speaker reviews all content for naturalness,
                accuracy, and cultural appropriateness.
              </li>
            </ul>
          </section>

          <section>
            <SectionHeading icon={CheckCircle2} tone="bg-emerald-soft text-emerald-ink">Review process</SectionHeading>
            <p className="mb-6">Every piece of content goes through a multi-step review:</p>
            <div className="relative">
              <span className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-line" aria-hidden="true" />
              <ol className="relative space-y-6">
                {[
                  { step: '1', title: 'Content creation', desc: 'Lessons and grammar topics are written based on university lecture materials and structured for self-study.' },
                  { step: '2', title: 'Native speaker review', desc: 'A native Polish speaker checks all Polish text for accuracy — vocabulary, grammar, pronunciation guides, and cultural notes.' },
                  { step: '3', title: 'Technical review', desc: 'Quiz questions are tested for correct answers and alternative acceptable spellings, including Polish diacritics.' },
                  { step: '4', title: 'Community feedback', desc: 'Published content is open to feedback via comments and GitHub issues. Corrections are applied promptly.' },
                ].map((item) => (
                  <li key={item.step} className="relative flex gap-4">
                    <span className="relative z-10 w-10 h-10 rounded-full bg-emerald text-white font-display font-bold text-lg flex items-center justify-center shrink-0 shadow-[0_3px_0_var(--color-emerald-edge)]">
                      {item.step}
                    </span>
                    <div className="pt-1.5">
                      <p className="font-extrabold text-ink">{item.title}</p>
                      <p className="text-base text-muted mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section>
            <SectionHeading icon={AlertTriangle} tone="bg-sun-soft text-sun-ink">Transparency & limitations</SectionHeading>
            <div className="rounded-3xl bg-sun-soft p-6 md:p-7 space-y-4 text-sun-ink font-semibold">
              <p>
                The creator of PolishPal is <strong className="font-extrabold">not a native Polish speaker</strong> and is <strong className="font-extrabold">not a
                professional language educator</strong>. This project is a personal learning tool that grew into a
                public resource.
              </p>
              <p>
                While a native Polish speaker reviews the content, mistakes may still exist. We are transparent about
                this limitation and actively encourage corrections from the community.
              </p>
            </div>
          </section>

          <section>
            <SectionHeading icon={Users} tone="bg-violet-soft text-violet-ink">Community contributions</SectionHeading>
            <p className="mb-5">
              PolishPal is open-source and welcomes contributions. Community-submitted content follows the same review process:
            </p>
            <ul className={list}>
              <li>All pull requests are reviewed before merging</li>
              <li>Grammar and vocabulary changes are verified by a native speaker when possible</li>
              <li>Contributors are credited in the project&apos;s commit history</li>
              <li>Disputed content is discussed openly in GitHub issues</li>
            </ul>
          </section>

          <section>
            <SectionHeading icon={RefreshCw} tone="bg-cobalt-soft text-cobalt-ink">Corrections & updates</SectionHeading>
            <p className="mb-5">
              We take accuracy seriously. If you find an error:
            </p>
            <ul className={list}>
              <li>
                <strong className="text-ink">Leave a comment</strong> on the lesson or grammar page where you found the mistake
              </li>
              <li>
                <strong className="text-ink">Open a GitHub issue</strong> at{' '}
                <a href="https://github.com/basedshiloh/Polish-Language-Learning/issues" target="_blank" rel="noopener noreferrer" className={link}>
                  our repository
                </a>
              </li>
              <li>
                <strong className="text-ink">Submit a pull request</strong> with the fix if you&apos;re comfortable with GitHub
              </li>
            </ul>
            <p className="mt-5 text-base text-muted">
              All corrections are tracked in our{' '}
              <Link href="/changelog" className={link}>changelog</Link>.
            </p>
          </section>

          <section className="tile p-6 md:p-8">
            <h2 className={`${h2} mb-4`}>Content scope</h2>
            <p>
              PolishPal focuses on <strong className="text-ink">A0 to A1 level</strong> Polish — absolute beginner to elementary. Content
              is designed for self-study learners preparing for basic Polish language exams or wanting to start
              communicating in everyday situations. We do not currently cover B1+ material.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
