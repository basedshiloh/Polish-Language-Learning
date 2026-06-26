import { getPaginatedPosts } from '@/data/blog';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
  const { posts, currentPage, totalPages } = getPaginatedPosts(pageNum, 9);

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Tips, deep dives, and stories about learning Polish.
        </p>
      </div>

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          <BlogPagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 dark:text-gray-500">No blog posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
