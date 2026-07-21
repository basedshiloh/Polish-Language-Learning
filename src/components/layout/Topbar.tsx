'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  BookOpen, Table2, Brain, BarChart3,
  ChevronDown, Menu, X, ArrowRight,
  Sun, Moon, Monitor, Clock,
  Info, Mail, History, FileText,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { blogCategoryStyles } from '@/data/blog';
import type { BlogCategory } from '@/lib/types';

interface LatestPost {
  slug: string;
  title: string;
  featuredImage: string;
  featuredImageAlt: string;
  readingTime: number;
}

const LEARN_ITEMS = [
  { label: 'Lessons', href: '/lessons', icon: BookOpen, desc: 'Structured A0 → A1 course' },
  { label: 'Grammar Reference', href: '/grammar', icon: Table2, desc: 'Cases, verbs & tables' },
  { label: 'Quizzes', href: '/quizzes', icon: Brain, desc: 'Test your knowledge' },
  { label: 'My Progress', href: '/progress', icon: BarChart3, desc: 'Track your learning' },
];

const BLOG_CATS: BlogCategory[] = [
  'learning-tips', 'grammar-deep-dive', 'culture', 'vocabulary', 'pronunciation', 'music',
];

const ABOUT_ITEMS = [
  { label: 'About PolishPal', href: '/about', icon: Info },
  { label: 'Contact', href: '/contact', icon: Mail },
  { label: 'Changelog', href: '/changelog', icon: History },
  { label: 'Editorial Policy', href: '/editorial', icon: FileText },
];

const THEME_ORDER = ['light', 'dark', 'system'] as const;
const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor } as const;

type MenuKey = 'learn' | 'blog' | 'about';

export default function Topbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [posts, setPosts] = useState<LatestPost[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(null); setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const loadPosts = useCallback(() => {
    if (postsLoaded) return;
    setPostsLoaded(true);
    fetch('/api/blog/latest?limit=3')
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .catch(() => {});
  }, [postsLoaded]);

  const nextTheme = THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length];
  const ThemeIcon = THEME_ICONS[theme];

  function toggleMenu(key: MenuKey) {
    if (key === 'blog') loadPosts();
    setOpen((prev) => (prev === key ? null : key));
  }

  const isLearnActive = ['/lessons', '/grammar', '/quizzes', '/progress'].some((p) => pathname.startsWith(p));
  const isBlogActive = pathname.startsWith('/blog');

  return (
    <>
      <header className="no-print sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-2">
              <Image src="/logo.svg" alt="PolishPal" width={32} height={32} className="rounded-lg" priority />
              <span className="font-bold text-[17px] text-gray-900 dark:text-gray-100">PolishPal</span>
            </Link>

            {/* Desktop nav */}
            <nav ref={navRef} className="hidden md:flex items-center gap-0.5 flex-1">

              {/* Learn mega menu */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('learn')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    open === 'learn' || isLearnActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Learn
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open === 'learn' ? 'rotate-180' : ''}`} />
                </button>

                {open === 'learn' && (
                  <div className="absolute top-full left-0 mt-2 w-[420px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 z-50">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-1">Learn Polish — A0 to A1</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {LEARN_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.href} href={item.href} onClick={() => setOpen(null)}
                            className="group flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                              <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">{item.label}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Blog mega menu */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('blog')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    open === 'blog' || isBlogActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Blog
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open === 'blog' ? 'rotate-180' : ''}`} />
                </button>

                {open === 'blog' && (
                  <div className="absolute top-full left-0 mt-2 w-[520px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-5 z-50">
                    <div className="grid grid-cols-[1fr_1.6fr] gap-6">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Categories</p>
                        <div className="space-y-0.5">
                          {BLOG_CATS.map((key) => (
                            <Link key={key} href={`/blog?category=${key}`} onClick={() => setOpen(null)}
                              className="block py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {blogCategoryStyles[key].label}
                            </Link>
                          ))}
                        </div>
                        <Link href="/blog" onClick={() => setOpen(null)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mt-3 hover:underline"
                        >
                          All posts <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Latest</p>
                        {posts.length > 0 ? (
                          <div className="space-y-3">
                            {posts.map((p) => (
                              <Link key={p.slug} href={`/blog/${p.slug}`} onClick={() => setOpen(null)}
                                className="group flex gap-3 items-start"
                              >
                                <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                                  <Image src={p.featuredImage} alt={p.featuredImageAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="56px" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.title}</p>
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" />{p.readingTime} min
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-14 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0" />
                                <div className="flex-1 space-y-1.5 pt-0.5">
                                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* About dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('about')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    open === 'about'
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  About
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open === 'about' ? 'rotate-180' : ''}`} />
                </button>

                {open === 'about' && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 p-1.5 z-50">
                    {ABOUT_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setOpen(null)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setTheme(nextTheme)}
                title={`Switch theme (${theme})`}
                className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ThemeIcon className="w-4 h-4" />
              </button>

              <Link
                href="/lessons"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                Start for Free <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`md:hidden fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />

      {/* ── Mobile drawer ── */}
      <aside
        className={`md:hidden fixed top-0 right-0 z-50 h-screen w-80 max-w-[90vw] bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-100 dark:border-gray-800 overflow-y-auto transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <Image src="/logo.svg" alt="PolishPal" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-gray-900 dark:text-gray-100">PolishPal</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 pt-4 pb-2">
          <Link
            href="/lessons"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Start Learning for Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <nav className="px-3 py-2 space-y-0.5">
          {/* Learn */}
          <div>
            <button
              onClick={() => setMobileSection(mobileSection === 'learn' ? null : 'learn')}
              className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Learn
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${mobileSection === 'learn' ? 'rotate-180' : ''}`} />
            </button>
            {mobileSection === 'learn' && (
              <div className="pb-1 space-y-0.5">
                {LEARN_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 pl-5 pr-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Blog */}
          <div>
            <button
              onClick={() => setMobileSection(mobileSection === 'blog' ? null : 'blog')}
              className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Blog
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${mobileSection === 'blog' ? 'rotate-180' : ''}`} />
            </button>
            {mobileSection === 'blog' && (
              <div className="pb-1 space-y-0.5">
                <Link href="/blog" onClick={() => setMobileOpen(false)}
                  className="flex items-center pl-5 pr-3 py-2.5 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  All Posts →
                </Link>
                {BLOG_CATS.map((key) => (
                  <Link key={key} href={`/blog?category=${key}`} onClick={() => setMobileOpen(false)}
                    className="flex items-center pl-5 pr-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {blogCategoryStyles[key].label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* About */}
          <div>
            <button
              onClick={() => setMobileSection(mobileSection === 'about' ? null : 'about')}
              className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              About
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${mobileSection === 'about' ? 'rotate-180' : ''}`} />
            </button>
            {mobileSection === 'about' && (
              <div className="pb-1 space-y-0.5">
                {ABOUT_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 pl-5 pr-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
