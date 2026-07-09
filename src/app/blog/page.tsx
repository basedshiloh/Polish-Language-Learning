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
        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-colors ${
          !activeCategory
            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
            : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500'
        }`}
      >
        All
      </Link>
      {(Object.entries(blogCategoryStyles) as [BlogCategory, typeof blogCategoryStyles[BlogCategory]][]).map(([key, style]) => (
        <Link
          key={key}
          href={`/blog?category=${key}`}
          className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-colors ${
            activeCategory === key
              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
              : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500'
          }`}
        >
          {style.label}
        </Link>
      ))}
    </div>
  );
}

// ── Hero feature ──────────────────────────────────────────────────────────────

function HeroFeature({ post }: { post: Post }) {
  const cat = blogCategoryStyles[post.category];
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[3/2] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-5">
        <Image
          src={post.featuredImage}
          alt={post.featuredImageAlt}
          fill
          priority
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 55vw"
        />
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${cat.text} ${cat.darkText}`}>
        {cat.label}
      </span>
      <h2 className="mt-1.5 text-2xl md:text-3xl lg:text-[2.2rem] font-black text-gray-900 dark:text-gray-100 leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
        {post.title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 mb-4 text-[15px]">
        {post.excerpt}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
        <span className="font-semibold text-gray-600 dark:text-gray-300">{post.author.name}</span>
        <span>·</span>
        <span>{fmtDate(post.date)}</span>
        <span>·</span>
        <Clock className="w-3 h-3" />
        <span>{post.readingTime} min</span>
      </p>
    </Link>
  );
}

// ── More Stories list (Atlantic-style — no thumbnails, pure text) ─────────────

function MoreStoriesList({ posts }: { posts: Post[] }) {
  return (
    <aside>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 pb-3 mb-1 border-b border-gray-200 dark:border-gray-700">
        More Stories
      </p>
      <ol className="divide-y divide-gray-100 dark:divide-gray-800">
        {posts.map((p, i) => {
          const cat = blogCategoryStyles[p.category];
          return (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group flex gap-3 py-4">
                <span className="text-xs font-black text-blue-600 dark:text-blue-500 tabular-nums w-5 shrink-0 pt-0.5 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1.5">
                    {p.title}
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${cat.text} ${cat.darkText}`}>
                    {cat.label}
                    <span className="text-gray-400 dark:text-gray-600 font-normal normal-case tracking-normal"> · {fmtDate(p.date)}</span>
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

// ── Category section (Atlantic: lead feature + stacked mini list) ──────────────

function CategorySection({ catKey, posts }: { catKey: BlogCategory; posts: Post[] }) {
  if (posts.length === 0) return null;
  const style = blogCategoryStyles[catKey];
  const [lead, ...rest] = posts;
  const sideItems = rest.slice(0, 5);

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3 mb-6">
        <h2 className={`text-[10px] font-black uppercase tracking-widest ${style.text} ${style.darkText}`}>
          {style.label}
        </h2>
        <Link
          href={`/blog?category=${catKey}`}
          className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          See all →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Lead feature card */}
        <Link href={`/blog/${lead.slug}`} className="group block">
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
            <Image
              src={lead.featuredImage}
              alt={lead.featuredImageAlt}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
            {lead.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 leading-relaxed">
            {lead.excerpt}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {lead.author.name} · {fmtDate(lead.date)} · {lead.readingTime} min read
          </p>
        </Link>

        {/* Stacked mini-cards */}
        {sideItems.length > 0 && (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {sideItems.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-4 py-4 first:pt-0 last:pb-0">
                <div
                  className="relative shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                  style={{ width: 88, height: 66 }}
                >
                  <Image
                    src={p.featuredImage}
                    alt={p.featuredImageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="88px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5">
                    {p.title}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {fmtDate(p.date)} · {p.readingTime} min
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPage({ searchParams }: Props) {
  const { page, category } = await searchParams;
  const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
  const magazine = pageNum === 1 && !category;

  // ── Filtered / paginated view ─────────────────────────────────────────────
  if (!magazine) {
    const { posts, currentPage, totalPages, activeCategory } = await getPaginatedPosts(pageNum, 9, category);
    return (
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10">
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-8">
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900 dark:text-gray-100 mt-1">
            {activeCategory
              ? (blogCategoryStyles[activeCategory as BlogCategory]?.label ?? 'Blog')
              : 'All Articles'}
          </h1>
          <Link href="/blog" className="text-xs text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mt-1 inline-block">
            ← Back to front page
          </Link>
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
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-500 mb-3">No posts in this category yet.</p>
            <Link href="/blog" className="text-sm font-semibold text-blue-600 hover:underline">
              View all posts →
            </Link>
          </div>
        )}
      </div>
    );
  }

  // ── Magazine front page ───────────────────────────────────────────────────
  const [all, ads] = await Promise.all([getPublishedPosts(), getAdSlots(['blog-top'])]);

  const hero = all[0];
  const moreStories = all.slice(1, 6);
  const culturePosts = all.filter((p) => p.categories.includes('culture'));

  const catOrder: BlogCategory[] = ['grammar-deep-dive', 'learning-tips', 'music', 'memes-pop-culture', 'arts', 'vocabulary', 'pronunciation'];
  const byCategory: Partial<Record<BlogCategory, Post[]>> = {};
  for (const p of all) {
    for (const cat of p.categories) {
      if (cat === 'culture') continue;
      if (!byCategory[cat as BlogCategory]) byCategory[cat as BlogCategory] = [];
      byCategory[cat as BlogCategory]!.push(p);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-8 py-8">

      {/* ── Masthead ── */}
      <header className="mb-8">
        <div className="flex items-end justify-between gap-4 pt-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-gray-100 leading-none">
            The PolishPal<br />
            <span className="text-blue-600 dark:text-blue-400">Blog</span>
          </h1>
          <p className="hidden md:block text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right shrink-0 pb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mt-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          Tips &nbsp;·&nbsp; Deep Dives &nbsp;·&nbsp; Culture &nbsp;·&nbsp; Stories
        </p>
      </header>

      <CategoryFilters />

      {!hero ? (
        <p className="text-center py-16 text-gray-400 dark:text-gray-500">No posts yet. Check back soon!</p>
      ) : (
        <>
          {/* ── Hero: big feature + More Stories list ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 mb-12 pb-12 border-b border-gray-100 dark:border-gray-800">
            <HeroFeature post={hero} />
            <div className="hidden lg:block">
              <MoreStoriesList posts={moreStories} />
            </div>

            {/* Mobile: compact story list below hero */}
            <div className="lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {moreStories.slice(0, 3).map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-3 py-3 first:pt-0">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                    <Image
                      src={p.featuredImage}
                      alt={p.featuredImageAlt}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {p.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Ad banner ── */}
          <AdSlot slot={ads['blog-top']} />

          {/* ── Culture Picks slider ── */}
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
