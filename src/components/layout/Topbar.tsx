'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  BookOpen, Table2, Brain, BarChart3,
  ChevronDown, Menu, X, ArrowRight, Clock,
  Info, Mail, History, FileText, Search,
} from 'lucide-react';
import SearchBox from '@/components/layout/SearchBox';
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
  { label: 'Lessons', href: '/lessons', icon: BookOpen, desc: 'Structured A0 → A1 course', tone: 'bg-crimson-soft text-crimson-ink' },
  { label: 'Grammar', href: '/grammar', icon: Table2, desc: 'Cases, verbs & tables', tone: 'bg-violet-soft text-violet-ink' },
  { label: 'Quizzes', href: '/quizzes', icon: Brain, desc: 'Test what you know', tone: 'bg-emerald-soft text-emerald-ink' },
  { label: 'My Progress', href: '/progress', icon: BarChart3, desc: 'Saved in your browser', tone: 'bg-sun-soft text-sun-ink' },
];

const BLOG_CATS: BlogCategory[] = [
  'culture', 'learning-tips', 'grammar-deep-dive', 'vocabulary', 'pronunciation', 'music', 'memes-pop-culture', 'arts',
];

const ABOUT_ITEMS = [
  { label: 'About PolishPal', href: '/about', icon: Info },
  { label: 'Contact', href: '/contact', icon: Mail },
  { label: 'Changelog', href: '/changelog', icon: History },
  { label: 'Editorial Policy', href: '/editorial', icon: FileText },
];

type MenuKey = 'learn' | 'blog' | 'about';

const panel = 'absolute top-full left-0 mt-3 tile shadow-[0_18px_40px_-18px_rgba(30,33,50,0.25)] z-50 pp-pop origin-top-left';

export default function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>('learn');
  const [posts, setPosts] = useState<LatestPost[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(null); setMobileOpen(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setSearchOpen(false); setOpen(null); setMobileOpen(false); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

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

  function toggleMenu(key: MenuKey) {
    if (key === 'blog') loadPosts();
    setOpen((prev) => (prev === key ? null : key));
  }

  const isLearnActive = ['/lessons', '/grammar', '/quizzes', '/progress'].some((p) => pathname.startsWith(p));
  const isBlogActive = pathname.startsWith('/blog');
  const isAboutActive = ['/about', '/contact', '/changelog', '/editorial'].some((p) => pathname.startsWith(p));

  function navBtn(key: MenuKey, active: boolean) {
    return `flex items-center gap-1 px-3.5 py-2 rounded-xl text-[13px] font-extrabold uppercase tracking-[0.08em] transition-colors ${
      open === key || active
        ? 'text-crimson-ink bg-crimson-soft'
        : 'text-muted hover:text-ink hover:bg-canvas'
    }`;
  }

  return (
    <>
      <header className="no-print sticky top-0 z-40 bg-paper/95 backdrop-blur-md border-b-2 border-line">
        <div className="container-pp">
          <div className="flex items-center h-[68px] gap-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-3" aria-label="PolishPal home">
              <Image src="/logo.svg" alt="" width={36} height={36} className="rounded-[10px]" priority />
              <span className="font-display font-semibold text-[22px] tracking-tight text-ink">
                Polish<span className="text-crimson">Pal</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav ref={navRef} className="hidden md:flex items-center gap-1 flex-1" aria-label="Main">

              {/* Learn */}
              <div className="relative">
                <button onClick={() => toggleMenu('learn')} className={navBtn('learn', isLearnActive)} aria-expanded={open === 'learn'}>
                  Learn
                  <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${open === 'learn' ? 'rotate-180' : ''}`} />
                </button>

                {open === 'learn' && (
                  <div className={`${panel} w-[440px] p-3`}>
                    <div className="grid grid-cols-2 gap-1">
                      {LEARN_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.href} href={item.href} onClick={() => setOpen(null)}
                            className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-canvas transition-colors"
                          >
                            <span className={`icon-badge w-10 h-10 rounded-xl ${item.tone}`}>
                              <Icon className="w-5 h-5" strokeWidth={2.4} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[15px] font-extrabold text-ink leading-tight">{item.label}</span>
                              <span className="block text-xs text-muted mt-0.5 leading-tight">{item.desc}</span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                    <Link href="/lessons" onClick={() => setOpen(null)} className="btn btn-primary btn-sm w-full mt-3">
                      Start lesson 1 <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Blog */}
              <div className="relative">
                <button onClick={() => toggleMenu('blog')} className={navBtn('blog', isBlogActive)} aria-expanded={open === 'blog'}>
                  Blog
                  <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${open === 'blog' ? 'rotate-180' : ''}`} />
                </button>

                {open === 'blog' && (
                  <div className={`${panel} w-[560px] p-5`}>
                    <div className="grid grid-cols-[1fr_1.5fr] gap-6">
                      <div>
                        <p className="eyebrow mb-3">Topics</p>
                        <div className="flex flex-col gap-0.5">
                          {BLOG_CATS.map((key) => {
                            const c = blogCategoryStyles[key];
                            return (
                              <Link key={key} href={`/blog?category=${key}`} onClick={() => setOpen(null)}
                                className="flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-lg text-sm font-bold text-ink-2 hover:bg-canvas transition-colors"
                              >
                                <span className={`w-2.5 h-2.5 rounded-full ${c.solid}`} />
                                {c.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="eyebrow mb-3">Latest</p>
                        {posts.length > 0 ? (
                          <div className="space-y-3">
                            {posts.map((p) => (
                              <Link key={p.slug} href={`/blog/${p.slug}`} onClick={() => setOpen(null)}
                                className="group flex gap-3 items-start"
                              >
                                <span className="relative w-16 h-12 rounded-xl overflow-hidden bg-canvas shrink-0">
                                  <Image src={p.featuredImage} alt={p.featuredImageAlt} fill className="object-cover" sizes="64px" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-[13px] font-bold text-ink leading-snug line-clamp-2 group-hover:text-crimson-ink transition-colors">{p.title}</span>
                                  <span className="text-[11px] text-faint mt-0.5 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />{p.readingTime} min read
                                  </span>
                                </span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-16 h-12 rounded-xl bg-canvas shrink-0" />
                                <div className="flex-1 space-y-1.5 pt-1">
                                  <div className="h-2.5 bg-canvas rounded-full w-full" />
                                  <div className="h-2.5 bg-canvas rounded-full w-3/4" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <Link href="/blog" onClick={() => setOpen(null)}
                          className="inline-flex items-center gap-1 text-[13px] font-extrabold text-crimson-ink mt-4 hover:gap-2 transition-all"
                        >
                          All articles <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* About */}
              <div className="relative">
                <button onClick={() => toggleMenu('about')} className={navBtn('about', isAboutActive)} aria-expanded={open === 'about'}>
                  About
                  <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${open === 'about' ? 'rotate-180' : ''}`} />
                </button>

                {open === 'about' && (
                  <div className={`${panel} w-56 p-2`}>
                    {ABOUT_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setOpen(null)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-ink-2 hover:bg-canvas hover:text-ink transition-colors"
                        >
                          <Icon className="w-4 h-4 shrink-0 text-muted" />
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
                onClick={() => setSearchOpen(true)}
                title="Search (⌘K)"
                className="hidden sm:flex items-center gap-2 h-10 pl-3 pr-2 rounded-xl border-2 border-line text-muted hover:border-line-2 hover:text-ink transition-colors"
                aria-label="Open search"
              >
                <Search className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-sm font-semibold hidden lg:inline">Search</span>
                <kbd className="hidden lg:inline text-[10px] font-bold text-faint border border-line rounded-md px-1.5 py-0.5">⌘K</kbd>
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl text-muted hover:bg-canvas transition-colors"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" strokeWidth={2.5} />
              </button>

              <Link href="/lessons" className="hidden md:inline-flex btn btn-primary btn-sm">
                Start free
              </Link>

              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border-2 border-line text-ink hover:bg-canvas transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Search modal ── */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px]"
            onClick={() => setSearchOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4" role="dialog" aria-modal="true" aria-label="Search">
            <div className="tile p-4 sm:p-5 shadow-2xl pp-pop">
              <div className="flex items-center justify-between mb-3">
                <span className="eyebrow">Search PolishPal</span>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-canvas transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
              <SearchBox />
            </div>
          </div>
        </>
      )}

      {/* ── Mobile overlay ── */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`md:hidden fixed inset-0 z-50 bg-ink/50 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />

      {/* ── Mobile drawer ── */}
      <aside
        className={`md:hidden fixed top-0 right-0 z-50 h-dvh w-[340px] max-w-[92vw] bg-paper overflow-y-auto transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        inert={!mobileOpen}
      >
        <div className="flex items-center justify-between px-5 h-[68px] border-b-2 border-line">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <Image src="/logo.svg" alt="" width={32} height={32} className="rounded-[9px]" />
            <span className="font-display font-semibold text-xl text-ink">Polish<span className="text-crimson">Pal</span></span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl text-muted hover:bg-canvas transition-colors" aria-label="Close menu">
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-5 pt-5 pb-3">
          <Link href="/lessons" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full">
            Start learning free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <nav className="px-3 pb-8" aria-label="Mobile">
          {/* Learn */}
          <button
            onClick={() => setMobileSection(mobileSection === 'learn' ? null : 'learn')}
            className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted"
            aria-expanded={mobileSection === 'learn'}
          >
            Learn
            <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${mobileSection === 'learn' ? 'rotate-180' : ''}`} />
          </button>
          {mobileSection === 'learn' && (
            <div className="grid grid-cols-2 gap-2 px-2 pb-3">
              {LEARN_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className="tile tile-link flex flex-col gap-2 p-3"
                  >
                    <span className={`icon-badge w-9 h-9 rounded-xl ${item.tone}`}>
                      <Icon className="w-[18px] h-[18px]" strokeWidth={2.4} />
                    </span>
                    <span className="text-sm font-extrabold text-ink leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Blog */}
          <button
            onClick={() => setMobileSection(mobileSection === 'blog' ? null : 'blog')}
            className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted"
            aria-expanded={mobileSection === 'blog'}
          >
            Blog
            <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${mobileSection === 'blog' ? 'rotate-180' : ''}`} />
          </button>
          {mobileSection === 'blog' && (
            <div className="px-2 pb-3 flex flex-wrap gap-2">
              <Link href="/blog" onClick={() => setMobileOpen(false)} className="chip bg-ink text-white">All articles</Link>
              {BLOG_CATS.map((key) => {
                const c = blogCategoryStyles[key];
                return (
                  <Link key={key} href={`/blog?category=${key}`} onClick={() => setMobileOpen(false)} className={`chip ${c.bg} ${c.text}`}>
                    {c.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* About */}
          <button
            onClick={() => setMobileSection(mobileSection === 'about' ? null : 'about')}
            className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-[13px] font-extrabold uppercase tracking-[0.08em] text-muted"
            aria-expanded={mobileSection === 'about'}
          >
            About
            <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${mobileSection === 'about' ? 'rotate-180' : ''}`} />
          </button>
          {mobileSection === 'about' && (
            <div className="pb-2">
              {ABOUT_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-bold text-ink-2 hover:bg-canvas transition-colors"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-muted" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
