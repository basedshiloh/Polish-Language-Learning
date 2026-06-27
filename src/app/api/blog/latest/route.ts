import { getPublishedPosts } from '@/lib/posts';

export const revalidate = 600;

export async function GET() {
  const posts = await getPublishedPosts();
  const latest = posts.slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    featuredImage: p.featuredImage,
    featuredImageAlt: p.featuredImageAlt,
    category: p.category,
    date: p.date,
    readingTime: p.readingTime,
  }));
  return Response.json({ posts: latest });
}
