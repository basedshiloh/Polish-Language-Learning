import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { blogCategoryStyles } from '@/data/blog';
import { getPostBySlug, getRelatedPosts, getHighlightedPosts } from '@/lib/posts';
import { extractHeadings } from '@/lib/blog';
import { getAdSlots } from '@/lib/ads';
import AuthorBox from '@/components/blog/AuthorBox';
import SummaryBox from '@/components/blog/SummaryBox';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import MobileToc from '@/components/blog/MobileToc';
import RelatedPosts from '@/components/blog/RelatedPosts';
import TableOfContents from '@/components/layout/TableOfContents';
import CommentSection from '@/components/shared/CommentSection';
import AdSlot from '@/components/shared/AdSlot';
import Wycinanka from '@/components/shared/Wycinanka';
import { lessons } from '@/data/lessons';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const content = post.content;
  const headings = extractHeadings(content);
  const [related, ads, highlighted] = await Promise.all([
    getRelatedPosts(post.slug, post.category, 3),
    getAdSlots(['post-before-content', 'post-sidebar', 'post-after-content']),
    getHighlightedPosts(),
  ]);
  const sideHighlights = highlighted.filter((p) => p.slug !== post.slug).slice(0, 4);
  const cat = blogCategoryStyles[post.category];

  // Split at the first H2 so the mobile TOC sits after the intro paragraphs.
  const firstH2 = content.search(/^##\s/m);
  const intro = firstH2 > 0 ? content.slice(0, firstH2) : '';
  const rest = firstH2 > 0 ? content.slice(firstH2) : content;

  return (
    <div className="px-4 sm:px-6 pt-8 md:pt-12 pb-8">
      <div className="flex gap-8 justify-center max-w-[1152px] mx-auto">

        {/* ── Left sticky ad sidebar ── */}
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-24">
            <AdSlot slot={ads['post-sidebar']} />
          </div>
        </aside>

        {/* ── Main article column ── */}
        <div className="w-full max-w-[680px] min-w-0">
          <nav aria-label="Breadcrumb" className="no-print mb-6">
            <ol className="flex items-center flex-wrap gap-1.5 text-sm font-bold text-muted">
              <li><Link href="/blog" className="hover:text-ink transition-colors">Blog</Link></li>
              {cat && (
                <>
                  <li aria-hidden="true"><ChevronRight className="w-4 h-4 text-muted" /></li>
                  <li>
                    <Link href={`/blog?category=${post.category}`} className={`chip ${cat.bg} ${cat.text} hover:brightness-95`}>
                      {cat.label}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>

          <header>
            <h1 className="font-display text-[2.1rem] leading-[1.1] sm:text-[2.6rem] md:text-5xl font-semibold tracking-[-0.015em] text-ink text-balance">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-lg md:text-xl text-muted leading-relaxed">{post.excerpt}</p>
            )}
            <div className="mt-6">
              <AuthorBox
                author={post.author}
                date={post.date}
                readingTime={post.readingTime}
                updatedDate={post.updatedDate}
              />
            </div>
          </header>

          <Image
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            width={720}
            height={405}
            priority
            fetchPriority="high"
            className="w-full h-auto rounded-3xl my-8 bg-line"
            sizes="(max-width: 740px) 100vw, 680px"
          />

          <SummaryBox items={post.summary} />

          <AdSlot slot={ads['post-before-content']} />

          <article>
            {intro ? (
              <>
                <MarkdownRenderer content={intro} />
                <MobileToc items={headings} />
                <MarkdownRenderer content={rest} />
              </>
            ) : (
              <MarkdownRenderer content={rest} />
            )}
          </article>

          <AdSlot slot={ads['post-after-content']} />

          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-10" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag} className="chip bg-canvas text-muted normal-case tracking-normal font-bold text-[13px]">
                  #{tag}
                </li>
              ))}
            </ul>
          )}

          {/* ── Course funnel ── */}
          <aside className="no-print relative overflow-hidden mt-12 rounded-[28px] bg-crimson text-white px-6 py-8 md:px-9 md:py-10">
            <Wycinanka className="absolute -right-10 -bottom-16 w-48 md:w-56 opacity-95 pointer-events-none" />
            <div className="relative max-w-md">
              <p className="font-display text-2xl md:text-3xl font-semibold leading-tight text-white">
                Want to actually speak Polish?
              </p>
              <p className="mt-3 text-[16px] font-semibold text-white leading-relaxed">
                PolishPal&apos;s free course takes you from zero to A1 in {lessons.length} short lessons. No sign-up, no paywall.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/lessons" className="btn btn-white">Start lesson 1</Link>
                <Link href="/grammar" className="btn bg-transparent text-white border-white/60 [--edge:rgba(0,0,0,0.2)] hover:bg-white/10">
                  Browse grammar
                </Link>
              </div>
            </div>
          </aside>

          <RelatedPosts posts={related} />

          <CommentSection pageId={`blog-${post.slug}`} pageType="blog" />
        </div>

        {/* ── Right TOC + Editor's Picks ── */}
        <TableOfContents items={headings}>
          {sideHighlights.length > 0 && (
            <div className="mt-8">
              <p className="font-display text-lg font-semibold text-ink mb-3">Editor&apos;s picks</p>
              <div className="space-y-3">
                {sideHighlights.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-3 items-start">
                    <span className="relative w-14 h-11 rounded-xl overflow-hidden bg-line shrink-0">
                      <Image src={p.featuredImage} alt={p.featuredImageAlt} fill className="object-cover" sizes="56px" />
                    </span>
                    <span className="text-[13px] font-bold text-ink-2 leading-snug line-clamp-2 group-hover:text-crimson-ink transition-colors">
                      {p.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </TableOfContents>

      </div>
    </div>
  );
}
