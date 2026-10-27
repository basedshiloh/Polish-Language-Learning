import { revalidatePath } from 'next/cache';

// Shared by the CMS API and the scheduled-publishing cron so both publish the same way.

export function revalidateBlog(slug?: string) {
  revalidatePath('/blog');
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
