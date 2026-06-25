import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

function isAuthorized(request: NextRequest): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const auth = request.headers.get('x-admin-token');
  return auth === password;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { action, commentId, limit = 50, offset = 0 } = body;
  const supabase = getAdminClient();

  if (action === 'list-all') {
    const { data, count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ comments: data, total: count });
  }

  if (action === 'list-filtered') {
    const hidden = body.hidden === true;
    const { data, count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact' })
      .eq('hidden', hidden)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ comments: data, total: count });
  }

  if (action === 'hide' && commentId) {
    const { error } = await supabase
      .from('comments')
      .update({ hidden: true })
      .eq('id', commentId);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  }

  if (action === 'unhide' && commentId) {
    const { error } = await supabase
      .from('comments')
      .update({ hidden: false })
      .eq('id', commentId);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  }

  if (action === 'delete' && commentId) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  }

  if (action === 'stats') {
    const { count: total } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true });

    const { count: hidden } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('hidden', true);

    const { data: pages } = await supabase
      .from('comments')
      .select('page_id');

    const uniquePages = new Set((pages || []).map((p: { page_id: string }) => p.page_id)).size;

    return Response.json({
      total: total || 0,
      hidden: hidden || 0,
      visible: (total || 0) - (hidden || 0),
      uniquePages,
    });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
}
