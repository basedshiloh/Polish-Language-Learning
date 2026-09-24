import { Heart, BookOpen, ExternalLink, Users, AlertCircle, Globe } from 'lucide-react';
import Wycinanka from '@/components/shared/Wycinanka';

const h2 = 'text-2xl md:text-[1.75rem] font-bold leading-tight';
const link = 'font-bold text-cobalt-ink underline decoration-2 underline-offset-4 decoration-cobalt/30 hover:decoration-cobalt transition-colors';

export default function AboutPage() {
  return (
    <div>
      {/* Header band */}
      <div className="relative overflow-hidden bg-canvas border-b-2 border-line">
        <div className="container-pp py-12 md:py-20">
          <div className="max-w-3xl mx-auto relative">
            <div className="md:pr-44">
              <h1 className="text-4xl md:text-5xl font-bold">
                About PolishPal
              </h1>
              <p className="text-muted text-lg mt-4">
                The story behind this project and why it exists.
              </p>
            </div>
            <Wycinanka className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-40 h-auto pp-float [--r:6deg]" />
          </div>
        </div>
      </div>

      <div className="container-pp py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-14 text-[17px] md:text-lg leading-relaxed text-ink-2">

          {/* Origin story */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="icon-badge w-10 h-10 rounded-xl bg-cobalt-soft text-cobalt-ink">
                <BookOpen className="w-5 h-5" strokeWidth={2.4} />
              </span>
              <h2 className={h2}>How it started</h2>
            </div>
            <div className="space-y-5">
              <p className="text-xl md:text-[1.35rem] leading-relaxed text-ink font-semibold">
                PolishPal started as a very personal project. I had a Polish language exam coming up, and I needed
                a way to study — something structured, visual, and easy to come back to. I couldn&apos;t find a
                website that had everything in one place, so I built one for myself.
              </p>
              <p>
                It started as a simple study tool with my notes, vocabulary tables, and grammar references.
                But as I kept building, I thought: <em className="text-ink">if this is helping me, maybe it could help someone else too.</em>
              </p>
              <p>
                I&apos;ve seen so many people trying to learn Polish but struggling to find good, free resources.
                Most courses are either too expensive, too scattered, or don&apos;t explain things in a way that
                clicks for beginners. So I decided to make PolishPal public.
              </p>
            </div>
          </section>

          {/* Wife's contribution */}
          <section className="rounded-3xl bg-fuchsia-soft p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="icon-badge w-10 h-10 rounded-xl bg-fuchsia text-white">
                <Heart className="w-5 h-5" strokeWidth={2.4} fill="currentColor" />
              </span>
              <h2 className={h2}>A little help from my wife</h2>
            </div>
            <div className="space-y-4">
              <p>
                My wife is Polish, and she&apos;s been an incredible help with this project. She reviews the
                content, catches my mistakes, and makes sure everything is accurate. Without her, this website
                would be full of errors — and trust me, there were plenty in the early versions.
              </p>
              <p>
                She&apos;s the reason the pronunciation guides actually sound right and the grammar explanations
                make sense to native speakers, not just to learners guessing their way through.
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="rounded-3xl bg-sun-soft p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="icon-badge w-10 h-10 rounded-xl bg-sun text-ink">
                <AlertCircle className="w-5 h-5" strokeWidth={2.4} />
              </span>
              <h2 className={h2}>A honest disclaimer</h2>
            </div>
            <div className="space-y-4 text-base md:text-[17px] text-sun-ink font-semibold">
              <p>
                I am <strong className="font-extrabold">not Polish</strong> and I am <strong className="font-extrabold">not a language educator</strong>. I&apos;m just
                someone who fell in love with Polish culture and decided to learn the language. This website is
                built from my own study materials and university lecture notes.
              </p>
              <p>
                If you spot any mistakes — whether it&apos;s a wrong declension, a typo, or something that
                just doesn&apos;t sound natural — <strong className="font-extrabold">please let me know</strong>. You can open an issue or
                submit a pull request on GitHub. This is a community effort, and every correction makes PolishPal
                better for everyone.
              </p>
            </div>
          </section>

          {/* Why Polish */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="icon-badge w-10 h-10 rounded-xl bg-violet-soft text-violet-ink">
                <Globe className="w-5 h-5" strokeWidth={2.4} />
              </span>
              <h2 className={h2}>Why Polish?</h2>
            </div>
            <div className="space-y-5">
              <p>
                Polish is a beautiful language with a rich history and culture behind it. Yes, it&apos;s
                challenging — the cases, the pronunciation, the consonant clusters — but that&apos;s what
                makes it rewarding. Every small win feels like a real achievement.
              </p>
              <p>
                I love Polish culture — the food, the traditions, the warmth of the people. Learning the language
                is my way of connecting more deeply with it. And I hope this website helps you do the same.
              </p>
            </div>
          </section>

          {/* Open source / contribute */}
          <section className="tile p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="icon-badge w-10 h-10 rounded-xl bg-emerald-soft text-emerald-ink">
                <Users className="w-5 h-5" strokeWidth={2.4} />
              </span>
              <h2 className={h2}>Contribute</h2>
            </div>
            <p>
              PolishPal is completely free and open-source. There are no ads, no paywalls, no premium tiers.
              If you find a mistake, want to add content, or have ideas for improvement, you&apos;re welcome
              to contribute on GitHub.
            </p>
            <a
              href="https://github.com/basedshiloh/Polish-Language-Learning"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary mt-6"
            >
              <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
              View on GitHub
            </a>
          </section>

          {/* Mission */}
          <section className="text-center pt-6">
            <Wycinanka withStem={false} className="w-16 h-auto mx-auto mb-5" />
            <p className="font-display text-2xl md:text-3xl font-semibold text-ink leading-snug max-w-xl mx-auto mb-3">
              Education is free and should be accessible to everyone.
            </p>
            <p className="text-base text-muted">
              Licensed under{' '}
              <a
                href="https://creativecommons.org/publicdomain/zero/1.0/"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                CC0 1.0 Universal
              </a>
              {' '}— dedicated to the public domain.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
