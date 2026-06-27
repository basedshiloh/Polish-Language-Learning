import { getAllPostsAdmin } from '@/lib/posts';
import PostsList from '@/components/cms/PostsList';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const posts = await getAllPostsAdmin();
  return <PostsList posts={posts} />;
}
