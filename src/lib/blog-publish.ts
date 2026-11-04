import { revalidatePath, revalidateTag } from 'next/cache';
import { POSTS_TAG } from '@/lib/posts';

// Shared by the CMS API and the scheduled-publishing cron so both publish the same way.

export function revalidateBlog(slug?: string) {
  // Expire the cached listing immediately so a publish shows on /blog at once.
  revalidateTag(POSTS_TAG, { expire: 0 });
  revalidatePath('/blog');
  revalidatePath('/blog/rss.xml');
  revalidatePath('/sitemap.xml');
  if (slug) revalidatePath(`/blog/${slug}`);
}

// Fire-and-forget callers can ignore the promise; the cron awaits it so the ping
// completes before the function exits.
export function submitToIndexNow(slug: string): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return Promise.resolve();
  const url = `https://www.polishpal.pl/blog/${slug}`;
  return fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'www.polishpal.pl',
      key,
      keyLocation: `https://www.polishpal.pl/${key}.txt`,
      urlList: [url],
    }),
  }).then(() => {}, () => {});
}
