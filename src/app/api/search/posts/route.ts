import { NextResponse } from 'next/server';
import { getPublishedPosts } from '@/lib/posts';

export const revalidate = 3600;

export async function GET() {
  const posts = await getPublishedPosts();
  return NextResponse.json({
    posts: posts.map((p) => ({
      title: p.title,
      excerpt: p.excerpt,
      slug: p.slug,
      tags: p.tags,
    })),
  });
}
