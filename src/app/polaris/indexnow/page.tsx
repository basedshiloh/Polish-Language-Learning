import { getPublishedPosts } from '@/lib/posts';
import IndexNowManager from '@/components/cms/IndexNowManager';

export const metadata = { title: 'IndexNow | PolishPal CMS' };
export const dynamic = 'force-dynamic';

export default async function IndexNowPage() {
  const posts = await getPublishedPosts();
  const blogSlugs = posts.map((p) => p.slug);
  const key = process.env.INDEXNOW_KEY || '';

  return <IndexNowManager blogSlugs={blogSlugs} indexNowKey={key} />;
}
