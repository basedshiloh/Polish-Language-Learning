import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/posts';
import { isAuthorizedRequest } from '@/lib/cms-access';
import { revalidateBlog, submitToIndexNow } from '@/lib/blog-publish';
import schedule from '@/data/scheduled-posts.json';

// Scheduled publishing. The CMS has no publish-at field, so drafts listed in
// src/data/scheduled-posts.json are flipped to published once their publishAt passes.
// Called by Vercel Cron daily at 07:00 UTC (see vercel.json); safe to run any number of
// times — only drafts that are due get published.
//
// A post is held back if any image it references (featured + /blog/*.webp in the body)
// isn't live as a valid WebP, since images deploy via git and the post via the DB.
//
// Auth: Vercel Cron (Bearer CRON_SECRET when set) or a CMS session/API key.
// `?dryRun=1` (CMS auth only) reports what would happen without publishing;
// add `&now=<ISO date>` to preview a future run.

const SITE = 'https://www.polishpal.pl';

interface ScheduledPost {
  slug: string;
  publishAt: string;
}

function isCronRequest(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (secret) return req.headers.get('authorization') === `Bearer ${secret}`;
  return (req.headers.get('user-agent') || '').includes('vercel-cron');
}

function referencedImages(featured: string, content: string): string[] {
  const inline = [...content.matchAll(/!\[[^\]]*\]\((\/blog\/[^)\s]+)\)/g)].map((m) => m[1]);
  return [...new Set([featured, ...inline].filter((p) => p && p.startsWith('/')))];
}

async function imageProblem(path: string): Promise<string | null> {
  try {
    const res = await fetch(SITE + path, { cache: 'no-store' });
    if (!res.ok) return `HTTP ${res.status}`;
    const f = Buffer.from(await res.arrayBuffer());
    if (path.endsWith('.webp')) {
      if (f.subarray(8, 12).toString('latin1') !== 'WEBP') return 'not a WebP';
      if (f.readUInt32LE(4) + 8 !== f.length) return 'corrupt WebP';
    }
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : 'fetch failed';
  }
}

export async function GET(req: NextRequest) {
  const cmsAuthed = await isAuthorizedRequest(req);
  if (!cmsAuthed && !isCronRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const dryRun = cmsAuthed && req.nextUrl.searchParams.get('dryRun') === '1';

  // Dry runs may pretend it's a later time (`&now=<ISO>`) to preview a future publish.
  const pretendNow = dryRun ? Date.parse(req.nextUrl.searchParams.get('now') || '') : NaN;
  const now = Number.isNaN(pretendNow) ? Date.now() : pretendNow;
  const due = (schedule as ScheduledPost[]).filter((p) => Date.parse(p.publishAt) <= now);
  if (due.length === 0) {
    return NextResponse.json({ ok: true, dryRun, due: 0, published: [], held: [], skipped: [] });
  }

  const supabase = adminClient();
  const { data: rows, error } = await supabase
    .from('posts')
    .select('id, slug, status, featured_image, content')
    .in('slug', due.map((p) => p.slug));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const published: string[] = [];
  const held: { slug: string; problems: string[] }[] = [];
  const skipped: { slug: string; reason: string }[] = [];

  for (const entry of due) {
    const row = rows?.find((r) => r.slug === entry.slug);
    if (!row) {
      skipped.push({ slug: entry.slug, reason: 'no post with this slug' });
      continue;
    }
    if (row.status !== 'draft') {
      skipped.push({ slug: entry.slug, reason: `status is ${row.status}` });
      continue;
    }

    const problems: string[] = [];
    for (const img of referencedImages(row.featured_image || '', row.content || '')) {
      const problem = await imageProblem(img);
      if (problem) problems.push(`${img}: ${problem}`);
    }
    if (problems.length) {
      held.push({ slug: entry.slug, problems });
      continue;
    }

    if (dryRun) {
      published.push(entry.slug);
      continue;
    }

    const ts = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('posts')
      .update({ status: 'published', published_at: ts, updated_at: ts })
      .eq('id', row.id)
      .eq('status', 'draft');
    if (updateError) {
      held.push({ slug: entry.slug, problems: [updateError.message] });
      continue;
    }
    revalidateBlog(entry.slug);
    await submitToIndexNow(entry.slug);
    published.push(entry.slug);
  }

  const result = { ok: true, dryRun, due: due.length, published, held, skipped, ts: new Date().toISOString() };
  console.log('[publish-scheduled]', JSON.stringify(result));
  return NextResponse.json(result);
}
