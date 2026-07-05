import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminClient } from '@/lib/posts';
import { isAuthorizedRequest } from '@/lib/cms-access';
import { saveBackup, listBackups, downloadBackup } from '@/lib/backup';
import type { BackupType } from '@/lib/backup';

export async function POST(req: NextRequest) {
  if (!(await isAuthorizedRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;
  const supabase = adminClient();

  if (action === 'list') {
    const backups = await listBackups(supabase, body.type as BackupType | undefined);
    return NextResponse.json({ backups });
  }

  if (action === 'full-backup') {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const path = await saveBackup('manual', 'full', posts, supabase);
    return NextResponse.json({ ok: true, path, count: posts?.length ?? 0 });
  }

  if (action === 'restore') {
    const { path } = body as { path?: string };
    if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 });

    const snapshot = await downloadBackup(path, supabase);
    if (!snapshot) return NextResponse.json({ error: 'Backup not found or unreadable' }, { status: 404 });

    const posts = Array.isArray(snapshot) ? snapshot : [snapshot];
    const errors: string[] = [];

    for (const post of posts) {
      const { error } = await supabase
        .from('posts')
        .upsert(post as Record<string, unknown>, { onConflict: 'slug' });
      if (error) errors.push(`${(post as Record<string,string>).slug}: ${error.message}`);
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join('; ') }, { status: 500 });
    }

    revalidatePath('/blog');
    revalidatePath('/sitemap.xml');
    for (const post of posts) {
      const slug = (post as Record<string, string>).slug;
      if (slug) revalidatePath(`/blog/${slug}`);
    }

    return NextResponse.json({ ok: true, restored: posts.length });
  }

  if (action === 'download') {
    const { path } = body as { path?: string };
    if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 });
    const snapshot = await downloadBackup(path, supabase);
    if (!snapshot) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ snapshot });
  }

  if (action === 'delete') {
    const { path } = body as { path?: string };
    if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 });
    const { error } = await supabase.storage.from('post-backups').remove([path]);
    return NextResponse.json({ ok: !error, error: error?.message });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
