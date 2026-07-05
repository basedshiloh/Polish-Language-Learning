import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/posts';
import { saveBackup } from '@/lib/backup';

// Called by Vercel Cron daily at 02:00 UTC (see vercel.json).
// Protect with CRON_SECRET env var set in Vercel dashboard.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization') || '';
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const supabase = adminClient();
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const path = await saveBackup('scheduled', 'full', posts, supabase);
  return NextResponse.json({ ok: true, path, count: posts?.length ?? 0, ts: new Date().toISOString() });
}
