'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Brain, Flame, ArrowRight, Trophy, Table2, Sparkles, Clock, Newspaper } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { lessons } from '@/data/lessons';
import { quizzes } from '@/data/quizzes';
import { grammarTopics } from '@/data/grammar';
import { blogCategoryStyles } from '@/data/blog';
import ProgressBar from '@/components/shared/ProgressBar';
import PageSidebar, { SidebarCard } from '@/components/layout/PageSidebar';

interface LatestPost {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  category: keyof typeof blogCategoryStyles;
  date: string;
  readingTime: number;
}

const dailyPhrases = [
  { polish: 'Dzień dobry!', english: 'Good day!' },
  { polish: 'Jak się masz?', english: 'How are you?' },
  { polish: 'Nie rozumiem.', english: "I don't understand." },
  { polish: 'Proszę powtórzyć.', english: 'Please repeat.' },
  { polish: 'Ile to kosztuje?', english: 'How much does it cost?' },
  { polish: 'Poproszę kawę.', english: "I'd like a coffee." },
  { polish: 'Bardzo dziękuję!', english: 'Thank you very much!' },
  { polish: 'Przepraszam.', english: "I'm sorry. / Excuse me." },
  { polish: 'Gdzie jest toaleta?', english: 'Where is the toilet?' },
  { polish: 'Która jest godzina?', english: 'What time is it?' },
  { polish: 'Smacznego!', english: 'Bon appétit!' },
  { polish: 'Na zdrowie!', english: 'Cheers! / Bless you!' },
  { polish: 'Mówię trochę po polsku.', english: 'I speak a little Polish.' },
  { polish: 'Chcę iść do domu.', english: 'I want to go home.' },
  { polish: 'Lubię polską kuchnię.', english: 'I like Polish cuisine.' },
];

export default function Dashboard() {
  const { progress, mounted, getOverallCompletion } = useProgress();
  const [todayPhrases, setTodayPhrases] = useState<typeof dailyPhrases>([]);
  const [latestPosts, setLatestPosts] = useState<LatestPost[]>([]);

  useEffect(() => {
    const dayIndex = new Date().getDate() % dailyPhrases.length;
    setTodayPhrases([
      dailyPhrases[dayIndex],
      dailyPhrases[(dayIndex + 5) % dailyPhrases.length],
      dailyPhrases[(dayIndex + 10) % dailyPhrases.length],
    ]);

    fetch('/api/blog/latest')
      .then((r) => r.json())
      .then((d) => setLatestPosts(d.posts || []))
      .catch(() => {});
  }, []);

  if (!mounted) {
    return (
      <div className="p-6 md:p-10 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-96 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const { completed, total, percentage } = getOverallCompletion();
  const streak = progress.streak.current;

  const recentAttempts = Object.values(progress.quizAttempts)
    .flat()
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 3);

  const nextLesson = lessons.find((l) => !progress.lessonProgress[l.id]?.completed);

  return (
    <div className="p-6 md:p-10">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Dzień dobry! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Ready to practice your Polish today?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lessons</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{completed}/{total}</p>
                </div>
              </div>
              <ProgressBar value={completed} max={total} size="sm" />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Streak</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{streak} {streak === 1 ? 'day' : 'days'}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Keep learning daily!</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{percentage}%</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Overall completion</p>
            </div>
          </div>

          {nextLesson && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
              <p className="text-blue-200 text-sm font-medium mb-1">Continue Learning</p>
              <h2 className="text-xl font-bold mb-2">{nextLesson.title}</h2>
              <p className="text-blue-100 text-sm mb-4">{nextLesson.description}</p>
              <Link
                href={`/lessons/${nextLesson.id}`}
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                Start Lesson <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Quiz Scores</h3>
              {recentAttempts.length > 0 ? (
                <div className="space-y-3">
                  {recentAttempts.map((attempt, i) => {
                    const quiz = quizzes.find((q) => q.id === attempt.quizId);
                    const scoreColor = attempt.score >= 80 ? 'text-green-600' : attempt.score >= 60 ? 'text-amber-600' : 'text-red-500';
                    return (
                      <div key={i} className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{quiz?.title || 'Quiz'}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(attempt.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-lg font-bold ${scoreColor}`}>{attempt.score}%</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-100 dark:border-gray-800 text-center">
                  <Brain className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">No quizzes taken yet</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/lessons"
                  className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Browse Lessons</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{total} lessons available</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />
                </Link>
                <Link
                  href="/grammar"
                  className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800 hover:border-purple-200 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Table2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Grammar Reference</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{grammarTopics.length} topics with tables</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />
                </Link>
                <Link
                  href="/quizzes"
                  className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Take a Quiz</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{quizzes.length} quizzes available</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />
                </Link>
              </div>
            </div>
          </div>

          {/* Latest from the blog */}
          {latestPosts.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-blue-600" />
                  Latest from the Blog
                </h3>
                <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestPosts.map((post) => {
                  const cat = blogCategoryStyles[post.category];
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={post.featuredImage}
                          alt={post.featuredImageAlt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        {cat && (
                          <span className={`self-start text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${cat.bg} ${cat.text} ${cat.darkBg} ${cat.darkText}`}>
                            {cat.label}
                          </span>
                        )}
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                          {post.title}
                        </p>
                        <div className="mt-auto flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                          <Clock className="w-3 h-3" />
                          {post.readingTime} min read
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <PageSidebar>
          <SidebarCard title="Daily Phrases" accent="blue">
            <div className="space-y-3">
              {todayPhrases.map((p, i) => (
                <div key={i}>
                  <p className="font-semibold text-blue-800 dark:text-blue-300 text-sm">{p.polish}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{p.english}</p>
                </div>
              ))}
            </div>
          </SidebarCard>

          <SidebarCard title="Quick Review" accent="green">
            <div className="space-y-2">
              <Link href="/grammar/znac-wiedziec-umiec" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                znać vs wiedzieć vs umieć
              </Link>
              <Link href="/grammar/three-conjugations" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                3 Conjugation patterns
              </Link>
              <Link href="/grammar/cases-overview" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                The 4 Cases overview
              </Link>
              <Link href="/grammar/telling-time" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
                Telling the time
              </Link>
            </div>
          </SidebarCard>
        </PageSidebar>
      </div>
    </div>
  );
}
