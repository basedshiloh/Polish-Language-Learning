import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedRequest } from '@/lib/cms-access';

const HOST = 'www.polishpal.pl';
const SITE = `https://${HOST}`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

function getKey(): string {
  const key = process.env.INDEXNOW_KEY;
  if (!key) throw new Error('INDEXNOW_KEY env var is not set');
  return key;
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorizedRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { urls } = body as { urls?: string[] };

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: 'urls array is required' }, { status: 400 });
  }

  // Ensure all URLs are absolute and belong to this host
  const urlList = urls.map((u) =>
    u.startsWith('http') ? u : `${SITE}${u.startsWith('/') ? u : `/${u}`}`
  ).filter((u) => u.includes(HOST));

  if (urlList.length === 0) {
    return NextResponse.json({ error: 'No valid URLs for this host' }, { status: 400 });
  }

  let key: string;
  try {
    key = getKey();
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key,
        keyLocation: `${SITE}/${key}.txt`,
        urlList,
      }),
    });

    // IndexNow returns 200 or 202 on success; body is often empty
    const responseText = await res.text().catch(() => '');
    const ok = res.status === 200 || res.status === 202;

    return NextResponse.json({
      ok,
      status: res.status,
      submitted: urlList.length,
      urls: urlList,
      response: responseText || null,
    });
  } catch (e) {
    return NextResponse.json({ error: `Fetch failed: ${(e as Error).message}` }, { status: 500 });
  }
}
