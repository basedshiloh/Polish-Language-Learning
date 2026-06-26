import Link from 'next/link';
import { getPaginatedPosts, blogCategoryStyles } from '@/data/blog';
import type { BlogCategory } from '@/lib/types';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { page, category } = await searchParams;
  const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
  const { posts, currentPage, totalPages, activeCategory } = getPaginatedPosts(pageNum, 9, category);

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Tips, deep dives, and stories about learning Polish.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/blog"
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
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
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeCategory === key
                ? 'bg-blue-600 text-white font-medium'
                : `${style.bg} ${style.text} ${style.darkBg} ${style.darkText} hover:opacity-80`
            }`}
          >
            {style.label}
          </Link>
        ))}
      </div>

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          <BlogPagination currentPage={currentPage} totalPages={totalPages} category={activeCategory} />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 dark:text-gray-500">No posts in this category yet.</p>
          <Link href="/blog" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            View all posts
          </Link>
        </div>
      )}
    </div>
  );
}
