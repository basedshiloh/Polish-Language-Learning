import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MessageSquare, Bug, Lightbulb, BookOpen, Megaphone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with PolishPal — report bugs, suggest improvements, or ask questions via GitHub Issues.',
  alternates: { canonical: '/contact' },
};

const channels = [
  {
    icon: Bug,
    title: 'Report a Bug or Mistake',
    description: 'Found a typo, wrong translation, or broken feature? Open an issue and we\'ll fix it.',
    href: 'https://github.com/basedshiloh/Polish-Language-Learning/issues/new?labels=bug&template=bug_report.md',
    label: 'Report a bug',
    color: 'red',
  },
  {
    icon: Lightbulb,
    title: 'Suggest an Improvement',
    description: 'Have an idea for a new lesson, feature, or improvement? We\'d love to hear it.',
    href: 'https://github.com/basedshiloh/Polish-Language-Learning/issues/new?labels=enhancement&template=feature_request.md',
    label: 'Suggest a feature',
    color: 'amber',
  },
  {
    icon: MessageSquare,
    title: 'Ask a Question',
    description: 'Confused about Polish grammar? Need help using the site? Start a discussion.',
    href: 'https://github.com/basedshiloh/Polish-Language-Learning/discussions',
    label: 'Start a discussion',
    color: 'blue',
  },
  {
    icon: BookOpen,
    title: 'Contribute Content',
    description: 'Want to add a lesson, fix a grammar explanation, or translate content? Pull requests are welcome.',
    href: 'https://github.com/basedshiloh/Polish-Language-Learning/pulls',
    label: 'Open a pull request',
    color: 'green',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', border: 'hover:border-red-200 dark:hover:border-red-800' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'hover:border-amber-200 dark:hover:border-amber-800' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'hover:border-blue-200 dark:hover:border-blue-800' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'hover:border-green-200 dark:hover:border-green-800' },
};

export default function ContactPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Contact</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          PolishPal is an open-source project. The best way to reach us is through GitHub — every report, suggestion,
          and question helps make this resource better for everyone.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {channels.map((ch) => {
            const c = colorMap[ch.color];
            const Icon = ch.icon;
            return (
              <a
                key={ch.title}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-md transition-all ${c.border}`}
              >
                <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{ch.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{ch.description}</p>
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${c.text}`}>
                  {ch.label}
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </a>
            );
          })}
        </div>

        {/* Advertising & sponsorship — the ad-slot placeholders link here */}
        <section id="advertise" className="mb-10 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-6 scroll-mt-8">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Advertising &amp; Sponsorship</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Want to advertise on PolishPal or sponsor the project? We offer banner slots on the blog and inside
            articles (728×90 and 300×250), sponsored content, and partnership options. Reach a growing audience
            of Polish learners — email us and we&apos;ll get back to you with details.
          </p>
          <a
            href="mailto:0xshilloh@gmail.com?subject=PolishPal%20Advertising%20Inquiry"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            0xshilloh@gmail.com
          </a>
        </section>

        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Why GitHub?</h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              As an open-source project, we use GitHub for all communication because it keeps everything transparent
              and traceable. Anyone can see reported issues, track their resolution, and contribute fixes.
            </p>
            <p>
              If you&apos;re not familiar with GitHub, don&apos;t worry — you can also leave a comment on any lesson
              or blog post page directly on the website, and we&apos;ll see it through our moderation dashboard.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
