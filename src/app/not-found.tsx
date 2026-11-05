import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, BookOpen, Table2, Brain, Newspaper, ArrowRight } from 'lucide-react';
import Wycinanka from '@/components/shared/Wycinanka';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

const links = [
  { href: '/lessons', label: 'Lessons', desc: '16 structured lessons', icon: BookOpen, tone: 'bg-crimson-soft text-crimson-ink' },
  { href: '/grammar', label: 'Grammar', desc: 'Visual reference tables', icon: Table2, tone: 'bg-violet-soft text-violet-ink' },
  { href: '/quizzes', label: 'Quizzes', desc: 'Test your knowledge', icon: Brain, tone: 'bg-emerald-soft text-emerald-ink' },
  { href: '/blog', label: 'Blog', desc: 'Tips & deep dives', icon: Newspaper, tone: 'bg-orange-soft text-orange-ink' },
];

export default function NotFound() {
  return (
    <div className="container-pp py-12 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-display font-bold text-ink leading-none">
          <span className="sr-only">404</span>
          <span aria-hidden="true" className="inline-flex items-center justify-center gap-1 sm:gap-2 text-[7rem] sm:text-[9rem] md:text-[10rem] tracking-tight">
            <span className="text-crimson">4</span>
            <Wycinanka withStem={false} className="w-[6.5rem] sm:w-[8.5rem] md:w-[9.5rem] h-auto pp-float [--r:-8deg]" />
            <span className="text-crimson">4</span>
          </span>
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mt-4">
          Strona nie znaleziona
        </h1>
        <p className="text-muted text-lg mt-3 max-w-lg mx-auto">
          Page not found — this link took a wrong turn. <span className="whitespace-nowrap polish-text">Nic nie szkodzi!</span> (No worries!)
          Let&apos;s get you back on track.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10 text-left">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="group tile tile-link flex items-center gap-4 p-4"
              >
                <span className={`icon-badge ${l.tone}`}>
                  <Icon className="w-5 h-5" strokeWidth={2.4} />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-extrabold text-ink leading-tight">{l.label}</span>
                  <span className="block text-sm text-muted truncate mt-0.5">{l.desc}</span>
                </span>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-ink group-hover:translate-x-0.5 transition-all ml-auto shrink-0" strokeWidth={2.5} />
              </Link>
            );
          })}
        </div>

        <Link href="/" className="btn btn-primary btn-lg mt-10">
          <Home className="w-5 h-5" strokeWidth={2.5} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
