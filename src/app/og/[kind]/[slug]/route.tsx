/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- satori renders <img> into a PNG; these are not DOM images. */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import sharp from 'sharp';
import { ZUBEK_SVG, type ZubekPose } from '@/components/mascot/zubek-svgs';
import {
  STATIC_CARD_PARAMS, blogCard, grammarCard, lessonCard, pageCard, quizCard,
  type Card, type CardArt, type CardKind,
} from '@/lib/og/cards';
import { getPostBySlug, getPostListing } from '@/lib/posts';
import { SITE_URL } from '@/lib/seo';

// /og/<kind>/<slug>.jpg: the 1200x630 share card for one page (see lib/og/cards.ts).
// Lessons, grammar, quizzes, static pages and existing posts are prerendered at
// build; newer posts render on first request and are cached. revalidateBlog()
// expires a post's card when the post is saved.

export const revalidate = 86400;
export const dynamicParams = true;

const W = 1200;
const H = 630;

const C = {
  ink: '#1E2132', ink2: '#3A3F55', muted: '#646A82', paper: '#FFFFFF', canvas: '#F6F7FA',
  crimson: '#D91F3B', crimsonInk: '#A3142B', crimsonSoft: '#FFE8EC', sun: '#FFC21A', sunSoft: '#FFF4D6',
  cobalt: '#2F5BEA', line: '#E6E8EF',
};

export async function generateStaticParams() {
  const posts = await getPostListing().catch(() => []);
  return [
    ...STATIC_CARD_PARAMS.map((p) => ({ kind: p.kind, slug: `${p.slug}.jpg` })),
    ...posts.map((p) => ({ kind: 'blog', slug: `${p.slug}.jpg` })),
  ];
}

async function cardFor(kind: string, slug: string): Promise<Card | null> {
  switch (kind as CardKind) {
    case 'page': return pageCard(slug);
    case 'lesson': return lessonCard(slug);
    case 'grammar': return grammarCard(slug);
    case 'quiz': return quizCard(slug);
    case 'blog': {
      const post = await getPostBySlug(slug);
      return post ? blogCard(post) : null;
    }
    default: return null;
  }
}

// ── Assets ────────────────────────────────────────────────────────────────────

const asset = (name: string) => readFile(join(process.cwd(), 'src/assets/og', name));
let fontsP: Promise<{ name: string; data: Buffer; weight: 600 | 700 | 800; style: 'normal' }[]> | null = null;
const fonts = () =>
  (fontsP ??= Promise.all([
    asset('Fredoka-SemiBold.ttf').then((data) => ({ name: 'Fredoka', data, weight: 600 as const, style: 'normal' as const })),
    asset('Nunito-Bold.ttf').then((data) => ({ name: 'Nunito', data, weight: 700 as const, style: 'normal' as const })),
    asset('Nunito-ExtraBold.ttf').then((data) => ({ name: 'Nunito', data, weight: 800 as const, style: 'normal' as const })),
  ]));

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

/** The pose as a still image: drop the hidden expression variants (resvg has no animation state). */
function zubekUri(pose: ZubekPose) {
  const still = ZUBEK_SVG[pose].replace(/<g[^>]*visibility="hidden"[^>]*>(?:(?!<\/g>).)*?<\/g>/g, '');
  return svgUri(still);
}

const LOGO = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#D91F3B"><path d="M256 88 308 162 376 120V216C376 282 328 320 256 320S136 282 136 216V120L204 162Z"/><path d="M232 304H280V360C310 326 348 326 376 330 370 388 324 424 256 424S142 388 136 330C164 326 202 326 232 360Z"/></svg>',
);

/** Blog photo as a JPEG data URI: read from public/ at build, fetched from the site for newer posts. */
async function photoUri(src: string): Promise<string | null> {
  try {
    let buf: Buffer;
    if (src.startsWith('/')) {
      buf = await readFile(join(process.cwd(), 'public', src)).catch(async () => {
        const res = await fetch(new URL(src, SITE_URL));
        if (!res.ok) throw new Error(`photo ${res.status}`);
        return Buffer.from(await res.arrayBuffer());
      });
    } else {
      const res = await fetch(src);
      if (!res.ok) return null;
      buf = Buffer.from(await res.arrayBuffer());
    }
    const jpg = await sharp(buf).resize(760, 860, { fit: 'cover', position: 'attention' }).jpeg({ quality: 82 }).toBuffer();
    return `data:image/jpeg;base64,${jpg.toString('base64')}`;
  } catch {
    return null;
  }
}

const clip = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n - 1).replace(/[\s,;:.]+\S*$/, '')}…`);
const titleSize = (t: string) => (t.length <= 26 ? 66 : t.length <= 44 ? 58 : t.length <= 64 ? 50 : 44);

// ── Right-hand "print" ────────────────────────────────────────────────────────

function Print({ art, photo }: { art: CardArt; photo: string | null }) {
  const frame = {
    position: 'absolute' as const, top: 30, right: 56, width: 400, height: 440, padding: 14,
    borderRadius: 34, background: C.paper, transform: 'rotate(3deg)', display: 'flex',
    boxShadow: '0 30px 60px -24px rgba(30,33,50,0.45), 0 0 0 2px rgba(30,33,50,0.06)',
  };
  if (art.type === 'photo') {
    return (
      <div style={frame}>
        {photo
          ? <img src={photo} width={372} height={412} style={{ borderRadius: 24, objectFit: 'cover' }} />
          : <div style={{ display: 'flex', width: 372, height: 412, borderRadius: 24, background: C.crimsonSoft }} />}
      </div>
    );
  }
  const inner = { display: 'flex', flexDirection: 'column' as const, width: 372, height: 412, borderRadius: 24, background: C.canvas, padding: '26px 26px 22px' };
  if (art.type === 'phrases') {
    return (
      <div style={frame}>
        <div style={inner}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: 'Fredoka', fontSize: 24, color: C.ink }}>{clip(art.heading, 22)}</span>
            <span style={{ display: 'flex', flexShrink: 0, whiteSpace: 'nowrap', marginLeft: 10, padding: '5px 12px', borderRadius: 999, background: C.crimsonSoft, color: C.crimsonInk, fontSize: 16, fontWeight: 800 }}>{art.chip}</span>
          </div>
          {art.rows.map((r) => (
            <div key={r.pl} style={{ display: 'flex', flexDirection: 'column', padding: '12px 0', borderTop: `2px solid ${C.line}` }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: C.crimsonInk }}>{clip(r.pl, 24)}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: C.muted }}>{clip(r.en, 30)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (art.type === 'word') {
    return (
      <div style={frame}>
        <div style={{ ...inner, background: C.sunSoft }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: C.ink2, letterSpacing: 1 }}>{art.small.toUpperCase()}</span>
          <span style={{ marginTop: 10, fontFamily: 'Fredoka', fontSize: art.big.length > 18 ? 40 : 50, lineHeight: 1.05, color: C.crimson }}>{clip(art.big, 34)}</span>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 22 }}>
            {art.rows.map((r) => (
              <span key={r} style={{ fontSize: 22, fontWeight: 800, color: C.ink, padding: '8px 0', borderTop: '2px solid rgba(30,33,50,0.08)' }}>{clip(r, 28)}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={frame}>
      <div style={{ ...inner, alignItems: 'flex-start' }}>
        <span style={{ fontFamily: 'Fredoka', fontSize: 120, lineHeight: 1, color: C.crimson }}>{art.count}</span>
        <span style={{ fontFamily: 'Fredoka', fontSize: 34, color: C.ink, marginTop: 4 }}>questions</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', alignSelf: 'stretch', marginTop: 22 }}>
          {art.chips.map((c) => (
            <span key={c} style={{ display: 'flex', marginTop: 10, padding: '7px 16px', borderRadius: 999, background: C.paper, border: `2px solid ${C.line}`, fontSize: 19, fontWeight: 800, color: C.ink2 }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function GET(_req: Request, { params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug: file } = await params;
  if (!file.endsWith('.jpg')) return new Response('Not found', { status: 404 });
  const card = await cardFor(kind, file.slice(0, -4));
  if (!card) return new Response('Not found', { status: 404 });

  const photo = card.art.type === 'photo' ? await photoUri(card.art.src) : null;
  const address = `polishpal.pl${card.path === '/' ? '' : card.path}`;

  const png = new ImageResponse(
    (
      <div
        style={{
          width: W, height: H, display: 'flex', position: 'relative', fontFamily: 'Nunito', color: C.ink,
          // Fade to a transparent version of the same colour: satori's `transparent` is black.
          background: 'radial-gradient(60% 80% at 95% 105%, rgba(255,194,26,0.38), rgba(255,194,26,0) 62%), radial-gradient(55% 60% at 0% 0%, rgba(255,232,236,1), rgba(255,232,236,0) 72%), #FFFFFF',
        }}
      >
        {/* Left: brand, kicker, title, line, address */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 660, height: H, padding: '52px 40px 52px 60px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={LOGO} width={58} height={58} />
            <span style={{ marginLeft: 12, fontFamily: 'Fredoka', fontSize: 38, color: C.ink }}>Polish</span>
            <span style={{ fontFamily: 'Fredoka', fontSize: 38, color: C.crimson }}>Pal</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignSelf: 'flex-start', alignItems: 'center', padding: '8px 18px 8px 14px', borderRadius: 999, background: C.crimsonSoft, color: C.crimsonInk, fontSize: 22, fontWeight: 800, marginBottom: 18 }}>
              <div style={{ display: 'flex', width: 11, height: 11, borderRadius: 99, background: C.crimson, marginRight: 10 }} />
              {clip(card.kicker, 34)}
            </div>
            <span style={{ fontFamily: 'Fredoka', fontSize: titleSize(card.title), lineHeight: 1.06, letterSpacing: -0.5, color: C.ink }}>{clip(card.title, 78)}</span>
            <span style={{ marginTop: 16, fontSize: 24, lineHeight: 1.38, fontWeight: 700, color: C.muted }}>{clip(card.line, 118)}</span>
          </div>
          <div style={{ display: 'flex', alignSelf: 'flex-start', padding: '10px 22px', borderRadius: 999, background: C.ink, color: C.paper, fontSize: 21, fontWeight: 800, boxShadow: `0 5px 0 ${C.crimson}` }}>
            {clip(address, 46)}
          </div>
        </div>

        {/* Right: the print, Żubek in front, a few papercut sparks */}
        <div style={{ display: 'flex', position: 'relative', width: W - 660, height: H }}>
          <Print art={card.art} photo={photo} />
          <img src={zubekUri(card.pose)} width={230} height={276} style={{ position: 'absolute', left: -34, bottom: 10 }} />
          <div style={{ display: 'flex', position: 'absolute', top: 64, left: 22, width: 18, height: 18, borderRadius: 4, background: C.sun, transform: 'rotate(45deg)' }} />
          <div style={{ display: 'flex', position: 'absolute', bottom: 120, right: 26, width: 14, height: 14, borderRadius: 3, background: C.cobalt, transform: 'rotate(45deg)' }} />
          <div style={{ display: 'flex', position: 'absolute', top: 18, right: 120, width: 12, height: 12, borderRadius: 3, background: C.crimson, transform: 'rotate(45deg)' }} />
        </div>
      </div>
    ),
    { width: W, height: H, fonts: await fonts() },
  );

  const jpg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400',
    },
  });
}
