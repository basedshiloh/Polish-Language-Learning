'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Post } from '@/lib/types';

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const arrowBtn =
  'w-11 h-11 rounded-full bg-paper text-orange-ink flex items-center justify-center shadow-[0_3px_0_var(--color-orange-edge)] active:translate-y-[3px] active:shadow-none transition-transform';

export default function CultureSlider({ posts }: { posts: Post[] }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: 'left' | 'right') {
    if (!ref.current) return;
    const amount = ref.current.offsetWidth * 0.8;
    ref.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  }

  if (posts.length === 0) return null;

  return (
    <section className="rounded-[28px] bg-orange-soft px-5 md:px-8 py-8 md:py-10 my-12">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-orange-ink leading-tight">Culture picks</h2>
          <p className="mt-1 text-[15px] font-semibold text-orange-ink/80">Traditions, places and stories from Poland.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/blog?category=culture"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-extrabold text-orange-ink hover:gap-2.5 transition-all"
          >
            All culture posts <ArrowRight className="w-4 h-4" />
          </Link>
          <button onClick={() => scroll('left')} aria-label="Scroll left" className={arrowBtn}>
            <ChevronLeft className="w-5 h-5" strokeWidth={3} />
          </button>
          <button onClick={() => scroll('right')} aria-label="Scroll right" className={arrowBtn}>
            <ChevronRight className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mx-1 px-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group tile tile-link shrink-0 w-64 sm:w-72 overflow-hidden"
            style={{ scrollSnapAlign: 'start' }}
          >
            <span className="relative block aspect-[4/3] overflow-hidden bg-line">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="288px"
              />
            </span>
            <span className="block p-4">
              <span className="block font-extrabold text-[15px] text-ink leading-snug line-clamp-2 group-hover:text-orange-ink transition-colors">
                {post.title}
              </span>
              <span className="block text-xs font-bold text-muted mt-1.5">{fmtDate(post.date)}</span>
            </span>
          </Link>
        ))}
      </div>

      <Link href="/blog?category=culture" className="sm:hidden mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-orange-ink">
        All culture posts <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
