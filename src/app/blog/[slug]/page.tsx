import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { blogCategoryStyles } from '@/data/blog';
import { getPostBySlug, getRelatedPosts } from '@/lib/posts';
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
  const [related, ads] = await Promise.all([
    getRelatedPosts(post.slug, post.category, 3),
    getAdSlots(['post-before-content', 'post-sidebar', 'post-after-content']),
  ]);
  const cat = blogCategoryStyles[post.category];

  // Split at the first H2 so the mobile TOC sits after the intro paragraphs.
  const firstH2 = content.search(/^##\s/m);
  const intro = firstH2 > 0 ? content.slice(0, firstH2) : '';
  const rest = firstH2 > 0 ? content.slice(firstH2) : content;

  return (
    <div className="p-6 md:p-10">
      <div className="flex gap-8 xl:gap-10 justify-center">

        {/* ── Left sticky ad sidebar ── */}
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-20">
            <AdSlot slot={ads['post-sidebar']} />
          </div>
        </aside>

        {/* ── Main article — hugs both sidebars ── */}
        <div className="w-full max-w-2xl min-w-0">
            <Link
              href="/blog"
              className="no-print inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <div className="mb-2">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.text} ${cat.darkBg} ${cat.darkText}`}>
                {cat.label}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-3">
              {post.title}
            </h1>

            <AuthorBox
              author={post.author}
              date={post.date}
              readingTime={post.readingTime}
              updatedDate={post.updatedDate}
            />

            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt}
              width={672}
              height={378}
              priority
              fetchPriority="high"
              className="w-full h-auto rounded-2xl my-6"
              sizes="(max-width: 1280px) 100vw, 672px"
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
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <RelatedPosts posts={related} />

            <CommentSection pageId={`blog-${post.slug}`} pageType="blog" />
        </div>

        {/* ── Right TOC ── */}
        <TableOfContents items={headings} />

      </div>
    </div>
  );
}
