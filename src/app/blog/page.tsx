import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { blogCategoryStyles } from '@/data/blog';
import { getPaginatedPosts, getPublishedPosts } from '@/lib/posts';
import { getAdSlots } from '@/lib/ads';
import type { BlogCategory, Post } from '@/lib/types';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import AdSlot from '@/components/shared/AdSlot';

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

function fmtDate(d: string): string {
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

function Hero({ post }: { post: Post }) {
  const cat = blogCategoryStyles[post.category];
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
        <Image
          src={post.featuredImage}
          alt={post.featuredImageAlt}
          fill
          priority
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.text} ${cat.darkBg} ${cat.darkText}`}>
        {cat.label}
      </span>
      <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mt-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {post.title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 md:text-lg line-clamp-2">{post.excerpt}</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
        {post.author.name} · {fmtDate(post.date)} · {post.readingTime} min read
      </p>
    </Link>
  );
}

function LatestList({ posts }: { posts: Post[] }) {
  return (
    <div className="lg:border-l lg:border-gray-200 lg:dark:border-gray-800 lg:pl-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Latest</h3>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-3 py-3 first:pt-0">
            <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
              <Image src={p.featuredImage} alt={p.featuredImageAlt} fill className="object-cover" sizes="80px" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {p.title}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {p.readingTime} min · {fmtDate(p.date)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function BlogPage({ searchParams }: Props) {
  const { page, category } = await searchParams;
  const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
  const magazine = pageNum === 1 && !category;

  if (!magazine) {
    // Classic grid for category filters and page ≥ 2
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

  // ── Magazine front page ──
  const [all, ads] = await Promise.all([getPublishedPosts(), getAdSlots(['blog-top'])]);
  const hero = all[0];
  const latest = all.slice(1, 5);
  const featuredSlugs = new Set([hero?.slug, ...latest.map((p) => p.slug)]);
  const culturePicks = all.filter((p) => p.category === 'culture' && !featuredSlugs.has(p.slug)).slice(0, 3);
  const pickedSlugs = new Set([...featuredSlugs, ...culturePicks.map((p) => p.slug)]);
  const grid = all.filter((p) => !pickedSlugs.has(p.slug)).slice(0, 9);
  const totalPages = Math.ceil(all.length / 9);

  return (
    <div className="p-6 md:p-10">
      {/* Masthead */}
      <div className="border-b-2 border-gray-900 dark:border-gray-100 pb-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">The PolishPal Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Tips, deep dives, and stories about learning Polish.</p>
      </div>

      <CategoryFilters />

      {!hero ? (
        <p className="text-center py-12 text-gray-400 dark:text-gray-500">No posts yet. Check back soon!</p>
      ) : (
        <>
          {/* Hero + Latest */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2">
              <Hero post={hero} />
            </div>
            <LatestList posts={latest} />
          </div>

          <AdSlot slot={ads['blog-top']} />

          {/* Culture Picks */}
          {culturePicks.length > 0 && (
            <section className="border-y border-gray-200 dark:border-gray-800 py-8 my-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Culture Picks</h2>
                <Link href="/blog?category=culture" className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  More culture <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {culturePicks.map((post) => <BlogCard key={post.slug} post={post} />)}
              </div>
            </section>
          )}

          {/* All articles */}
          {grid.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">All Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {grid.map((post) => <BlogCard key={post.slug} post={post} />)}
              </div>
              <BlogPagination currentPage={1} totalPages={totalPages} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
