import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { blogCategoryStyles } from '@/data/blog';
import { getPaginatedPosts, getPublishedPosts, getHighlightedPosts } from '@/lib/posts';
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
  const base = 'chip text-[13px] px-4 py-2 border-2 transition-colors';
  return (
    <nav aria-label="Blog topics" className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
      <ul className="flex sm:flex-wrap gap-2 w-max sm:w-auto pb-1">
        <li>
          <Link
            href="/blog"
            aria-current={!activeCategory ? 'page' : undefined}
            className={`${base} ${!activeCategory ? 'bg-ink text-white border-ink' : 'bg-paper text-ink-2 border-line hover:border-line-2'}`}
          >
            All
          </Link>
        </li>
        {(Object.entries(blogCategoryStyles) as [BlogCategory, typeof blogCategoryStyles[BlogCategory]][]).map(([key, style]) => {
          const active = activeCategory === key;
          return (
            <li key={key}>
              <Link
                href={`/blog?category=${key}`}
                aria-current={active ? 'page' : undefined}
                className={`${base} ${active ? `${style.bg} ${style.text} ${style.border}` : 'bg-paper text-ink-2 border-line hover:border-line-2'}`}
              >
                <span className={`w-2 h-2 rounded-full ${style.solid}`} />
                {style.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ── Hero feature ──────────────────────────────────────────────────────────────

function HeroFeature({ post }: { post: Post }) {
  const cat = blogCategoryStyles[post.category];
  return (
    <Link href={`/blog/${post.slug}`} className="group tile tile-link overflow-hidden flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-line">
        <Image
          src={post.featuredImage}
          alt={post.featuredImageAlt}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>
      <div className="p-6 md:p-8">
        {cat && <span className={`chip mb-3 ${cat.bg} ${cat.text}`}>{cat.label}</span>}
        <h2 className="font-display text-[1.75rem] md:text-[2.3rem] font-semibold leading-[1.12] tracking-tight text-ink group-hover:text-crimson-ink transition-colors text-balance">
          {post.title}
        </h2>
        <p className="mt-3 text-[16px] text-muted leading-relaxed line-clamp-3">{post.excerpt}</p>
        <p className="mt-5 text-sm font-bold text-faint flex flex-wrap items-center gap-1.5">
          <span className="text-ink-2">{post.author.name}</span>
          <span aria-hidden="true">·</span>
          <span>{fmtDate(post.date)}</span>
          <span aria-hidden="true">·</span>
          <Clock className="w-3.5 h-3.5" />
          <span>{post.readingTime} min read</span>
        </p>
      </div>
    </Link>
  );
}

// ── Latest list beside the hero ───────────────────────────────────────────────

function LatestList({ posts }: { posts: Post[] }) {
  return (
    <aside aria-label="Latest stories">
      <h2 className="font-display text-xl font-semibold text-ink mb-4">Latest stories</h2>
      <ol className="flex flex-col gap-3">
        {posts.map((p) => {
          const cat = blogCategoryStyles[p.category];
          return (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group tile tile-link flex gap-3.5 p-3 pr-4 items-center">
                <span className="relative w-20 h-16 rounded-xl overflow-hidden bg-line shrink-0">
                  <Image src={p.featuredImage} alt={p.featuredImageAlt} fill className="object-cover" sizes="80px" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-extrabold text-ink leading-snug line-clamp-2 group-hover:text-crimson-ink transition-colors">
                    {p.title}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-xs font-bold text-faint">
                    {cat && <span className={`w-2 h-2 rounded-full ${cat.solid}`} />}
                    {cat?.label} · {fmtDate(p.date)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

// ── Category section: lead feature + stacked list ─────────────────────────────

function CategorySection({ catKey, posts }: { catKey: BlogCategory; posts: Post[] }) {
  if (posts.length === 0) return null;
  const style = blogCategoryStyles[catKey];
  const [lead, ...rest] = posts;
  const sideItems = rest.slice(0, 4);

  return (
    <section className="mb-16" aria-labelledby={`cat-${catKey}`}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 id={`cat-${catKey}`} className="flex items-center gap-3 font-display text-2xl md:text-[1.9rem] font-semibold text-ink">
          <span className={`w-4 h-4 rounded-md rotate-45 ${style.solid}`} aria-hidden="true" />
          {style.label}
        </h2>
        <Link
          href={`/blog?category=${catKey}`}
          className={`inline-flex items-center gap-1.5 text-sm font-extrabold ${style.text} hover:gap-2.5 transition-all shrink-0`}
        >
          See all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <Link href={`/blog/${lead.slug}`} className="group tile tile-link overflow-hidden block">
          <span className="relative block aspect-[16/10] overflow-hidden bg-line">
            <Image
              src={lead.featuredImage}
              alt={lead.featuredImageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </span>
          <span className="block p-5">
            <span className="block font-display text-xl font-semibold leading-snug text-ink group-hover:text-crimson-ink transition-colors line-clamp-2">
              {lead.title}
            </span>
            <span className="block mt-2 text-[15px] text-muted leading-relaxed line-clamp-2">{lead.excerpt}</span>
            <span className="block mt-3 text-xs font-bold text-faint">
              {fmtDate(lead.date)} · {lead.readingTime} min read
            </span>
          </span>
        </Link>

        {sideItems.length > 0 && (
          <ul className="flex flex-col gap-3">
            {sideItems.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group flex gap-4 p-2 -m-2 rounded-2xl hover:bg-canvas transition-colors items-center">
                  <span className="relative shrink-0 rounded-xl overflow-hidden bg-line w-[88px] h-[68px]">
                    <Image src={p.featuredImage} alt={p.featuredImageAlt} fill className="object-cover" sizes="88px" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-extrabold text-ink leading-snug line-clamp-2 group-hover:text-crimson-ink transition-colors">
                      {p.title}
                    </span>
                    <span className="block text-xs font-bold text-faint mt-1">
                      {fmtDate(p.date)} · {p.readingTime} min
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ── Editor's Picks ─────────────────────────────────────────────────────────────

function HighlightedSection({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="mb-16" aria-labelledby="editors-picks">
      <h2 id="editors-picks" className="font-display text-2xl md:text-[1.9rem] font-semibold text-ink mb-6">
        Editor&apos;s picks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((p) => <BlogCard key={p.slug} post={p} />)}
      </div>
    </section>
  );
}

// ── Sidebar ad placeholder (shows when no slot configured in CMS) ─────────────

function SidebarAdBox({ slot }: { slot: Parameters<typeof AdSlot>[0]['slot'] }) {
  if (slot?.enabled) return <AdSlot slot={slot} />;
  return (
    <Link
      href="/contact#advertise"
      className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-line bg-canvas p-4 text-center transition-colors hover:border-line-2"
      style={{ minHeight: 200 }}
    >
      <span className="text-xs font-bold text-faint">Ad space</span>
      <span className="text-[11px] font-semibold text-faint">Advertise here</span>
    </Link>
  );
}

function BlogSidebar({ slot }: { slot: Parameters<typeof AdSlot>[0]['slot'] }) {
  return (
    <aside className="hidden 2xl:block w-[160px] shrink-0 pt-[25vh]">
      <div className="sticky top-[30vh]">
        <SidebarAdBox slot={slot} />
      </div>
    </aside>
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
    const ads = await getAdSlots(['blog-sidebar-left', 'blog-sidebar-right']);
    const style = activeCategory ? blogCategoryStyles[activeCategory as BlogCategory] : undefined;
    return (
      <div className="flex gap-6 2xl:gap-8 justify-center py-10 md:py-14">
        <BlogSidebar slot={ads['blog-sidebar-left']} />
        <div className="w-full max-w-6xl min-w-0 px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink transition-colors mb-4">
              ← Blog front page
            </Link>
            <h1 className="flex items-center gap-3 font-display text-4xl md:text-5xl font-semibold tracking-tight text-ink">
              {style && <span className={`w-5 h-5 rounded-md rotate-45 ${style.solid}`} aria-hidden="true" />}
              {style?.label ?? 'All articles'}
            </h1>
          </header>
          <div className="mb-10">
            <CategoryFilters activeCategory={activeCategory} />
          </div>
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
              </div>
              <BlogPagination currentPage={currentPage} totalPages={totalPages} category={activeCategory} />
            </>
          ) : (
            <div className="tile text-center py-16 px-6">
              <p className="font-display text-2xl font-semibold text-ink mb-2">Nothing here yet</p>
              <p className="text-muted mb-6">No posts in this topic so far. Try another one.</p>
              <Link href="/blog" className="btn btn-primary btn-sm">View all posts</Link>
            </div>
          )}
        </div>
        <BlogSidebar slot={ads['blog-sidebar-right']} />
      </div>
    );
  }

  // ── Magazine front page ───────────────────────────────────────────────────
  const [all, highlighted, ads] = await Promise.all([
    getPublishedPosts(),
    getHighlightedPosts(),
    getAdSlots(['blog-top', 'blog-sidebar-left', 'blog-sidebar-right']),
  ]);

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
    <div className="flex gap-6 2xl:gap-8 justify-center py-10 md:py-14">
      <BlogSidebar slot={ads['blog-sidebar-left']} />

      <div className="w-full max-w-6xl min-w-0 px-4 sm:px-6 lg:px-8">

        {/* ── Masthead ── */}
        <header className="mb-8 md:mb-10">
          <h1 className="font-display text-[2.8rem] leading-none sm:text-6xl lg:text-7xl font-semibold tracking-[-0.02em] text-ink">
            The PolishPal <span className="text-crimson">Blog</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted max-w-2xl">
            Polish culture, words and grammar, explained by people who love the language.
          </p>
        </header>

        <div className="mb-10">
          <CategoryFilters />
        </div>

        {!hero ? (
          <div className="tile text-center py-16 px-6">
            <p className="font-display text-2xl font-semibold text-ink">No posts yet</p>
            <p className="text-muted mt-2">Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-6 lg:gap-8 mb-14">
              <HeroFeature post={hero} />
              <LatestList posts={moreStories} />
            </div>

            <AdSlot slot={ads['blog-top']} />

            <CultureSlider posts={culturePosts} />

            <HighlightedSection posts={highlighted} />

            {catOrder.map((key) => (
              <CategorySection key={key} catKey={key} posts={byCategory[key] ?? []} />
            ))}
          </>
        )}
      </div>

      <BlogSidebar slot={ads['blog-sidebar-right']} />
    </div>
  );
}
