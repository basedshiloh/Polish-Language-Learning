import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { blogCategoryStyles } from '@/data/blog';
import { getPaginatedPosts, getPublishedPosts } from '@/lib/posts';
import { getAdSlots } from '@/lib/ads';
import type { BlogCategory, Post } from '@/lib/types';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import CultureSlider from '@/components/blog/CultureSlider';
import AdSlot from '@/components/shared/AdSlot';

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CategoryFilters({ activeCategory }: { activeCategory?: string }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        href="/blog"
        className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${
          !activeCategory
            ? 'bg-blue-600 text-white font-medium'
            : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        All
      </Link>
      {(Object.entries(blogCategoryStyles) as [BlogCategory, typeof blogCategoryStyles[BlogCategory]][]).map(([key, style]) => (
        <Link
          key={key}
          href={`/blog?category=${key}`}
          className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${
            activeCategory === key
              ? 'bg-blue-600 text-white font-medium'
              : `${style.bg} ${style.text} ${style.darkBg} ${style.darkText} hover:opacity-80`
          }`}
        >
          {style.label}
        </Link>
      ))}
    </div>
  );
}

// ── Newspaper sub-components ─────────────────────────────────────────────────

function RecentList({ posts }: { posts: Post[] }) {
  return (
    <aside className="hidden lg:block">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 pb-2 border-b border-gray-200 dark:border-gray-800">
        Recent Posts
      </h3>
      <ol className="divide-y divide-gray-100 dark:divide-gray-800">
        {posts.map((p, i) => (
          <li key={p.slug} className="py-3 first:pt-0">
            <Link href={`/blog/${p.slug}`} className="group block">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-500 mr-1">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mt-0.5">
                {p.title}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> {p.readingTime} min · {fmtDate(p.date)}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function HeroStory({ post }: { post: Post }) {
  const cat = blogCategoryStyles[post.category];
  return (
    <article className="lg:border-x lg:border-gray-200 lg:dark:border-gray-800 lg:px-6">
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
          <Image
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            fill
            priority
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cat.bg} ${cat.text} ${cat.darkBg} ${cat.darkText}`}>
            {cat.label}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Editor&apos;s Pick
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100 leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
          {post.title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-3">
          {post.excerpt}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <span className="font-medium text-gray-600 dark:text-gray-300">{post.author.name}</span>
          <span>·</span>
          <span>{fmtDate(post.date)}</span>
          <span>·</span>
          <Clock className="w-3 h-3" />
          <span>{post.readingTime} min read</span>
        </p>
      </Link>
    </article>
  );
}

function SideStories({ posts }: { posts: Post[] }) {
  return (
    <aside className="hidden lg:block divide-y divide-gray-100 dark:divide-gray-800">
      {posts.map((p) => (
        <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-3 py-3 first:pt-0">
          <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
            <Image src={p.featuredImage} alt={p.featuredImageAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="80px" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
              {p.title}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> {p.readingTime} min · {fmtDate(p.date)}
            </p>
          </div>
        </Link>
      ))}
    </aside>
  );
}

function CategorySection({ catKey, posts }: { catKey: BlogCategory; posts: Post[] }) {
  if (posts.length === 0) return null;
  const style = blogCategoryStyles[catKey];
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-black uppercase tracking-wider text-gray-900 dark:text-gray-100 pb-1 border-b-2 border-gray-300 dark:border-gray-700 pr-4">
          {style.label}
        </h2>
        <Link
          href={`/blog?category=${catKey}`}
          className={`text-xs font-medium ${style.text} ${style.darkText} hover:underline`}
        >
          All {style.label} →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.slice(0, 3).map((p) => <BlogCard key={p.slug} post={p} />)}
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPage({ searchParams }: Props) {
  const { page, category } = await searchParams;
  const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
  const magazine = pageNum === 1 && !category;

  if (!magazine) {
    const { posts, currentPage, totalPages, activeCategory } = await getPaginatedPosts(pageNum, 9, category);
    return (
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Blog</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Tips, deep dives, and stories about learning Polish.</p>
        </div>
        <CategoryFilters activeCategory={activeCategory} />
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
            </div>
            <BlogPagination currentPage={currentPage} totalPages={totalPages} category={activeCategory} />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-500">No posts in this category yet.</p>
            <Link href="/blog" className="text-sm text-blue-600 hover:underline mt-2 inline-block">View all posts</Link>
          </div>
        )}
      </div>
    );
  }

  // ── Magazine front page ──────────────────────────────────────────────────
  const [all, ads] = await Promise.all([getPublishedPosts(), getAdSlots(['blog-top'])]);

  const hero = all[0];
  const sideStories = all.slice(1, 4);          // right column: 3 stories
  const recentList = all.slice(0, 7);            // left column: top 7 (including hero)
  const culturePosts = all.filter((p) => p.category === 'culture');

  // Remaining posts for category sections (exclude hero + side, skip culture — covered by slider)
  const topSlugs = new Set([hero?.slug, ...sideStories.map((p) => p.slug)]);
  const remaining = all.filter((p) => !topSlugs.has(p.slug) && p.category !== 'culture');

  // Group by category in a defined display order
  const catOrder: BlogCategory[] = ['grammar-deep-dive', 'learning-tips', 'vocabulary', 'pronunciation'];
  const byCategory: Partial<Record<BlogCategory, Post[]>> = {};
  for (const p of remaining) {
    if (!byCategory[p.category as BlogCategory]) byCategory[p.category as BlogCategory] = [];
    byCategory[p.category as BlogCategory]!.push(p);
  }

  return (
    <div className="p-6 md:p-10">
      {/* ── Masthead ── */}
      <div className="mb-6">
        <div className="flex items-end justify-between pb-3 border-b-2 border-gray-300 dark:border-gray-700">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-gray-100 leading-none">
              The PolishPal Blog
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest">
              Tips, deep dives &amp; stories about learning Polish
            </p>
          </div>
          <p className="hidden sm:block text-xs text-gray-400 dark:text-gray-500 text-right shrink-0 ml-4 pb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-0.5 mt-0.5">
          <div className="h-0.5 flex-1 bg-gray-300 dark:bg-gray-700" />
          <div className="h-0.5 flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      <CategoryFilters />

      {!hero ? (
        <p className="text-center py-12 text-gray-400 dark:text-gray-500">No posts yet. Check back soon!</p>
      ) : (
        <>
          {/* ── 3-column newspaper grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] gap-6 mb-10 pb-10 border-b border-gray-200 dark:border-gray-800">
            <RecentList posts={recentList} />
            <HeroStory post={hero} />
            <SideStories posts={sideStories} />

            {/* Mobile: show side stories below hero */}
            <div className="lg:hidden col-span-1 divide-y divide-gray-100 dark:divide-gray-800">
              {sideStories.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-3 py-3 first:pt-0">
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                    <Image src={p.featuredImage} alt={p.featuredImageAlt} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {p.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{fmtDate(p.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Ad banner ── */}
          <AdSlot slot={ads['blog-top']} />

          {/* ── Culture Picks slider (all culture posts, auto) ── */}
          <CultureSlider posts={culturePosts} />

          {/* ── Category sections ── */}
          {catOrder.map((key) => (
            <CategorySection key={key} catKey={key} posts={byCategory[key] ?? []} />
          ))}
        </>
      )}
    </div>
  );
}
