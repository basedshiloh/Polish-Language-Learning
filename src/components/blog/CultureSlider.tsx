'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Post } from '@/lib/types';

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CultureSlider({ posts }: { posts: Post[] }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: 'left' | 'right') {
    if (!ref.current) return;
    const amount = ref.current.offsetWidth * 0.8;
    ref.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  }

  if (posts.length === 0) return null;

  return (
    <section
      className="-mx-6 md:-mx-10 px-6 md:px-10 py-10 my-10"
      style={{ background: '#242EF7' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Editorial</p>
          <h2 className="text-2xl font-bold text-white leading-tight">Culture Picks</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/blog?category=culture"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
          >
            All culture posts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider track */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group shrink-0 w-60 sm:w-72"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                sizes="288px"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
            </div>
            <p className="text-xs text-white/50 mb-1">{fmtDate(post.date)}</p>
            <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-white/80 transition-colors">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>

      {/* Mobile link */}
      <div className="sm:hidden mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <Link href="/blog?category=culture" className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-1">
          All culture posts <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
