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

const colorMap: Record<string, { badge: string; text: string }> = {
  red: { badge: 'bg-crimson-soft text-crimson-ink', text: 'text-crimson-ink' },
  amber: { badge: 'bg-sun-soft text-sun-ink', text: 'text-sun-ink' },
  blue: { badge: 'bg-cobalt-soft text-cobalt-ink', text: 'text-cobalt-ink' },
  green: { badge: 'bg-emerald-soft text-emerald-ink', text: 'text-emerald-ink' },
};

export default function ContactPage() {
  return (
    <div>
      <div className="bg-canvas border-b-2 border-line">
        <div className="container-pp py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold">Contact</h1>
            <p className="text-muted text-lg mt-4">
              PolishPal is an open-source project. The best way to reach us is through GitHub — every report, suggestion,
              and question helps make this resource better for everyone.
            </p>
          </div>
        </div>
      </div>

      <div className="container-pp py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="tile divide-y-2 divide-line overflow-hidden">
            {channels.map((ch) => {
              const c = colorMap[ch.color];
              const Icon = ch.icon;
              return (
                <a
                  key={ch.title}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-5 md:p-6 hover:bg-canvas transition-colors"
                >
                  <span className={`icon-badge ${c.badge}`}>
                    <Icon className="w-5 h-5" strokeWidth={2.4} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold leading-tight">{ch.title}</h2>
                    <p className="text-base text-muted mt-1">{ch.description}</p>
                    <span className={`inline-flex items-center gap-1.5 mt-3 text-sm font-extrabold uppercase tracking-[0.06em] ${c.text} group-hover:gap-2.5 transition-all`}>
                      {ch.label}
                      <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.6} />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Advertising & sponsorship — the ad-slot placeholders link here */}
          <section id="advertise" className="rounded-3xl bg-cobalt-soft p-6 md:p-8 scroll-mt-24">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <span className="icon-badge bg-cobalt text-white">
                <Megaphone className="w-6 h-6" strokeWidth={2.4} />
              </span>
              <div className="min-w-0">
                <h2 className="text-2xl font-bold leading-tight mb-3">Advertising &amp; Sponsorship</h2>
                <p className="text-[17px] text-ink-2 leading-relaxed mb-6">
                  Want to advertise on PolishPal or sponsor the project? We offer banner slots on the blog and inside
                  articles (728×90 and 300×250), sponsored content, and partnership options. Reach a growing audience
                  of Polish learners — email us and we&apos;ll get back to you with details.
                </p>
                <a
                  href="mailto:0xshilloh@gmail.com?subject=PolishPal%20Advertising%20Inquiry"
                  className="btn btn-cobalt normal-case tracking-normal max-w-full"
                >
                  <Mail className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                  <span className="truncate">0xshilloh@gmail.com</span>
                </a>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-canvas p-6 md:p-8">
            <h2 className="text-2xl font-bold leading-tight mb-4">Why GitHub?</h2>
            <div className="space-y-4 text-[17px] text-ink-2 leading-relaxed">
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
    </div>
  );
}
