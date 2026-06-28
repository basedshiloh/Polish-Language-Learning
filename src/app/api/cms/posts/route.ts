import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminClient } from '@/lib/posts';
import { isAuthorizedRequest } from '@/lib/cms-access';
import { slugify } from '@/lib/utils';

function wordCount(md: string): number {
  return md.trim().split(/\s+/).filter(Boolean).length;
}

function revalidateBlog(slug?: string) {
  revalidatePath('/blog');
  revalidatePath('/sitemap.xml');
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorizedRequest(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { action } = body;
  const supabase = adminClient();

  if (action === 'delete') {
    const { id, slug } = body;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidateBlog(slug);
    return NextResponse.json({ ok: true });
  }

  if (action === 'set-status') {
    const { id, status, slug } = body;
    const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === 'published') patch.published_at = new Date().toISOString();
    const { error } = await supabase.from('posts').update(patch).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidateBlog(slug);
    return NextResponse.json({ ok: true });
  }

  if (action === 'save') {
    const p = body.post as Record<string, unknown>;
    const title = String(p.title || '').trim();
    const slug = String(p.slug || '').trim() || slugify(title);
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

    const content = String(p.content || '');
    const status = p.status === 'published' ? 'published' : 'draft';

    const row: Record<string, unknown> = {
      slug,
      title,
      excerpt: String(p.excerpt || ''),
      meta_description: String(p.metaDescription || p.excerpt || ''),
      focus_keyword: String(p.focusKeyword || ''),
      category: String(p.category || 'learning-tips'),
      author_name: String(p.authorName || 'PolishPal Contributor'),
      author_bio: String(p.authorBio || ''),
      content,
      featured_image: String(p.featuredImage || ''),
      featured_image_alt: String(p.featuredImageAlt || ''),
      summary: Array.isArray(p.summary) ? p.summary : [],
      tags: Array.isArray(p.tags) ? p.tags : [],
      reading_time: Math.max(1, Math.round(wordCount(content) / 200)),
      status,
      updated_at: new Date().toISOString(),
    };

    const id = p.id ? String(p.id) : '';

    if (id) {
      // Preserve published_at unless transitioning to published for the first time
      if (status === 'published') {
        const { data: existing } = await supabase.from('posts').select('published_at').eq('id', id).maybeSingle();
        if (!existing?.published_at) row.published_at = new Date().toISOString();
      }
      const { data, error } = await supabase.from('posts').update(row).eq('id', id).select('id, slug').single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      revalidateBlog(slug);
      return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
    } else {
      if (status === 'published') row.published_at = new Date().toISOString();
      const { data, error } = await supabase.from('posts').insert(row).select('id, slug').single();
      if (error) {
        const msg = error.message.includes('duplicate') ? 'A post with that slug already exists.' : error.message;
        return NextResponse.json({ error: msg }, { status: 500 });
      }
      revalidateBlog(slug);
      return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
    }
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
