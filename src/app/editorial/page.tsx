import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Users, BookOpen, RefreshCw, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description: 'How PolishPal ensures content accuracy: our review process, sources, contributor guidelines, and commitment to corrections.',
  alternates: { canonical: '/editorial' },
};

export default function EditorialPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Editorial Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          How we create, review, and maintain the content on PolishPal.
        </p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Content sources</h2>
            </div>
            <p className="mb-3">
              The lessons and grammar references on PolishPal are based on:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>University lecture materials</strong> — The original content was extracted from 37 real
                Polish language lectures (A0–A1 level) used in an academic setting.
              </li>
              <li>
                <strong>Standard Polish language textbooks</strong> — Grammar rules and conjugation patterns are
                cross-referenced with established Polish language teaching materials.
              </li>
              <li>
                <strong>Native speaker review</strong> — A native Polish speaker reviews all content for naturalness,
                accuracy, and cultural appropriateness.
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Review process</h2>
            </div>
            <p className="mb-3">Every piece of content goes through a multi-step review:</p>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Content creation', desc: 'Lessons and grammar topics are written based on university lecture materials and structured for self-study.' },
                { step: '2', title: 'Native speaker review', desc: 'A native Polish speaker checks all Polish text for accuracy — vocabulary, grammar, pronunciation guides, and cultural notes.' },
                { step: '3', title: 'Technical review', desc: 'Quiz questions are tested for correct answers and alternative acceptable spellings, including Polish diacritics.' },
                { step: '4', title: 'Community feedback', desc: 'Published content is open to feedback via comments and GitHub issues. Corrections are applied promptly.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-700 dark:text-green-400">{item.step}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transparency & limitations</h2>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl p-5">
              <div className="space-y-3 text-sm text-amber-800 dark:text-amber-300">
                <p>
                  The creator of PolishPal is <strong>not a native Polish speaker</strong> and is <strong>not a
                  professional language educator</strong>. This project is a personal learning tool that grew into a
                  public resource.
                </p>
                <p>
                  While a native Polish speaker reviews the content, mistakes may still exist. We are transparent about
                  this limitation and actively encourage corrections from the community.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Community contributions</h2>
            </div>
            <p className="mb-3">
              PolishPal is open-source and welcomes contributions. Community-submitted content follows the same review process:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>All pull requests are reviewed before merging</li>
              <li>Grammar and vocabulary changes are verified by a native speaker when possible</li>
              <li>Contributors are credited in the project&apos;s commit history</li>
              <li>Disputed content is discussed openly in GitHub issues</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Corrections & updates</h2>
            </div>
            <p className="mb-3">
              We take accuracy seriously. If you find an error:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                <strong>Leave a comment</strong> on the lesson or grammar page where you found the mistake
              </li>
              <li>
                <strong>Open a GitHub issue</strong> at{' '}
                <a href="https://github.com/basedshiloh/Polish-Language-Learning/issues" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  our repository
                </a>
              </li>
              <li>
                <strong>Submit a pull request</strong> with the fix if you&apos;re comfortable with GitHub
              </li>
            </ul>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              All corrections are tracked in our{' '}
              <Link href="/changelog" className="text-blue-600 dark:text-blue-400 hover:underline">changelog</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Content scope</h2>
            <p>
              PolishPal focuses on <strong>A0 to A1 level</strong> Polish — absolute beginner to elementary. Content
              is designed for self-study learners preparing for basic Polish language exams or wanting to start
              communicating in everyday situations. We do not currently cover B1+ material.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
