import { getPostByIdAdmin, getAllPostsAdmin } from '@/lib/posts';
import { buildInternalLinkIndex } from '@/lib/internal-links';
import PostEditor from '@/components/cms/PostEditor';

export const dynamic = 'force-dynamic';

export default async function PostEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';

  const [post, allPosts] = await Promise.all([
    isNew ? Promise.resolve(null) : getPostByIdAdmin(id),
    getAllPostsAdmin(),
  ]);

  const extraPosts = allPosts
    .filter((p) => p.id !== id)
    .map((p) => ({ title: p.title, slug: p.slug, tags: p.tags }));
  const linkIndex = buildInternalLinkIndex(extraPosts);

  return <PostEditor initial={post} linkIndex={linkIndex} />;
}
