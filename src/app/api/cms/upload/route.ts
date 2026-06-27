import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { adminClient } from '@/lib/posts';
import { SESSION_COOKIE, isValidToken } from '@/lib/cms-auth';
import { slugify } from '@/lib/utils';

const BUCKET = 'blog-images';

export async function POST(req: NextRequest) {
  if (!isValidToken(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let webp: Buffer;
  try {
    webp = await sharp(inputBuffer).resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  } catch {
    return NextResponse.json({ error: 'Could not process image' }, { status: 400 });
  }

  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image';
  const path = `${base}-${Date.now()}.webp`;

  const supabase = adminClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, webp, {
    contentType: 'image/webp',
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
