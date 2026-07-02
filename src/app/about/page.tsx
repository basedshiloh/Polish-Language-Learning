import { Heart, BookOpen, ExternalLink, Users, AlertCircle, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          About PolishPal
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10">
          The story behind this project and why it exists.
        </p>

        {/* Origin story */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">How it started</h2>
          </div>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              PolishPal started as a very personal project. I had a Polish language exam coming up, and I needed
              a way to study — something structured, visual, and easy to come back to. I couldn&apos;t find a
              website that had everything in one place, so I built one for myself.
            </p>
            <p>
              It started as a simple study tool with my notes, vocabulary tables, and grammar references.
              But as I kept building, I thought: <em>if this is helping me, maybe it could help someone else too.</em>
            </p>
            <p>
              I&apos;ve seen so many people trying to learn Polish but struggling to find good, free resources.
              Most courses are either too expensive, too scattered, or don&apos;t explain things in a way that
              clicks for beginners. So I decided to make PolishPal public.
            </p>
          </div>
        </section>

        {/* Wife's contribution */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">A little help from my wife</h2>
          </div>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
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
        <section className="mb-10 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-200">A honest disclaimer</h2>
          </div>
          <div className="space-y-3 text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            <p>
              I am <strong>not Polish</strong> and I am <strong>not a language educator</strong>. I&apos;m just
              someone who fell in love with Polish culture and decided to learn the language. This website is
              built from my own study materials and university lecture notes.
            </p>
            <p>
              If you spot any mistakes — whether it&apos;s a wrong declension, a typo, or something that
              just doesn&apos;t sound natural — <strong>please let me know</strong>. You can open an issue or
              submit a pull request on GitHub. This is a community effort, and every correction makes PolishPal
              better for everyone.
            </p>
          </div>
        </section>

        {/* Why Polish */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Why Polish?</h2>
          </div>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
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
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contribute</h2>
          </div>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              PolishPal is completely free and open-source. There are no ads, no paywalls, no premium tiers.
              If you find a mistake, want to add content, or have ideas for improvement, you&apos;re welcome
              to contribute on GitHub.
            </p>
          </div>
          <a
            href="https://github.com/basedshiloh/Polish-Language-Learning"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on GitHub
          </a>
        </section>

        {/* Mission */}
        <section className="text-center py-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Education is free and should be accessible to everyone.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Licensed under{' '}
            <a
              href="https://creativecommons.org/publicdomain/zero/1.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              CC0 1.0 Universal
            </a>
            {' '}— dedicated to the public domain.
          </p>
        </section>
      </div>
    </div>
  );
}
