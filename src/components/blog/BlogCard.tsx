import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { Post } from '@/lib/types';
import { blogCategoryStyles } from '@/data/blog';

export default function BlogCard({ post }: { post: Post }) {
  const cat = blogCategoryStyles[post.category];

  return (
    <article className="group tile tile-link relative overflow-hidden flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-line">
        <Image
          src={post.featuredImage}
          alt={post.featuredImageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {cat && (
          <Link
            href={`/blog?category=${post.category}`}
            className={`chip self-start mb-3 relative z-10 hover:brightness-95 ${cat.bg} ${cat.text}`}
          >
            {cat.label}
          </Link>
        )}

        <h3 className="font-display text-[1.2rem] font-semibold leading-snug text-ink group-hover:text-crimson-ink transition-colors line-clamp-2">
          {/* Stretched link: the whole card is clickable, category chip stays its own link */}
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-[15px] text-muted leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        <p className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-bold text-muted">
          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          <span aria-hidden="true">·</span>
          <Clock className="w-3.5 h-3.5" />
          {post.readingTime} min read
        </p>
      </div>
    </article>
  );
}
