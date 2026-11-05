import type { Post } from '@/lib/types';
import BlogCard from './BlogCard';

export default function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-6">Keep reading</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
