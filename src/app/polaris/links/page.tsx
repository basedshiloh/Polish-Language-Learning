import { getPublishedPosts } from '@/lib/posts';
import { buildInternalLinkIndex } from '@/lib/internal-links';
import LinkIndexBrowser from '@/components/cms/LinkIndexBrowser';

export const dynamic = 'force-dynamic';

export default async function LinksPage() {
  const posts = await getPublishedPosts();
  const index = buildInternalLinkIndex(posts.map((p) => ({ title: p.title, slug: p.slug, tags: p.tags })));
  return <LinkIndexBrowser index={index} />;
}
