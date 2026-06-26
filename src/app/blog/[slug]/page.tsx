import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { blogPosts, getRelatedPosts, blogCategoryStyles } from '@/data/blog';
import { getBlogContent, extractHeadings } from '@/lib/blog';
import AuthorBox from '@/components/blog/AuthorBox';
import SummaryBox from '@/components/blog/SummaryBox';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import RelatedPosts from '@/components/blog/RelatedPosts';
import TableOfContents from '@/components/layout/TableOfContents';
import CommentSection from '@/components/shared/CommentSection';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug && p.published);
  if (!post) notFound();

  const content = getBlogContent(post.slug);
  const headings = extractHeadings(content);
  const related = getRelatedPosts(post.slug, post.category, 3);
  const cat = blogCategoryStyles[post.category];

  return (
    <div className="p-6 md:p-10">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors"
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
            width={896}
            height={448}
            priority
            fetchPriority="high"
            className="w-full h-auto rounded-xl my-6"
            sizes="(max-width: 1024px) 100vw, 896px"
          />

          <SummaryBox items={post.summary} />

          <article>
            <MarkdownRenderer content={content} />
          </article>

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

        <TableOfContents items={headings} />
      </div>
    </div>
  );
}
