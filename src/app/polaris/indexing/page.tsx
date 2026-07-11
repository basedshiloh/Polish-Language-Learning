import { getPublishedPosts } from '@/lib/posts';
import IndexingChecker from '@/components/cms/IndexingChecker';

export const metadata = { title: 'Indexing Checker | PolishPal CMS' };
export const dynamic = 'force-dynamic';

export default async function IndexingPage() {
  const posts = await getPublishedPosts();
  const blogSlugs = posts.map((p) => p.slug);
  const configured = !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  return <IndexingChecker blogSlugs={blogSlugs} configured={configured} />;
}
