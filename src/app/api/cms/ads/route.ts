import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminClient, getPublishedPosts } from '@/lib/posts';
import { isAuthorizedRequest } from '@/lib/cms-access';

const TYPES = ['placeholder', 'image', 'html'];

export async function POST(req: NextRequest) {
  if (!(await isAuthorizedRequest(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const supabase = adminClient();

  if (body.action === 'list') {
    const { data, error } = await supabase.from('ad_slots').select('*').order('slot_key');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ slots: data });
  }

  if (body.action === 'save') {
    const s = body.slot as Record<string, unknown>;
    const patch = {
      type: TYPES.includes(String(s.type)) ? String(s.type) : 'placeholder',
      image_url: String(s.image_url || ''),
      link_url: String(s.link_url || ''),
      html: String(s.html || ''),
      size: /^\d+x\d+$/.test(String(s.size)) ? String(s.size) : '728x90',
      enabled: s.enabled !== false,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('ad_slots').update(patch).eq('id', String(s.id));
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Ads render on the blog list and every post — refresh them.
    revalidatePath('/blog');
    const posts = await getPublishedPosts();
    for (const p of posts) revalidatePath(`/blog/${p.slug}`);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
