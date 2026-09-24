import Link from 'next/link';
import Image from 'next/image';
import type { AdSlotData } from '@/lib/ads';
import AdHtml from './AdHtml';

function parseSize(size: string): { w: number; h: number } {
  const m = size.match(/^(\d+)x(\d+)$/);
  return m ? { w: parseInt(m[1], 10), h: parseInt(m[2], 10) } : { w: 728, h: 90 };
}

// Renders an ad slot. Slots are managed in the CMS (/polaris/ads):
// placeholder (default) → "Advertise here" box linking to /contact,
// image → linked banner, html → embedded ad-network snippet.
export default function AdSlot({ slot }: { slot: AdSlotData | undefined }) {
  if (!slot || !slot.enabled) return null;
  const { w, h } = parseSize(slot.size);

  return (
    <div className="no-print my-6 flex flex-col items-center">
      <span className="self-center text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted mb-1.5">Advertisement</span>

      {slot.type === 'image' && slot.image_url ? (
        <a href={slot.link_url || '#'} target="_blank" rel="noopener noreferrer sponsored" className="block max-w-full">
          <Image
            src={slot.image_url}
            alt={slot.label || 'Advertisement'}
            width={w}
            height={h}
            className="rounded-xl max-w-full h-auto"
          />
        </a>
      ) : slot.type === 'html' && slot.html ? (
        <AdHtml html={slot.html} maxWidth={w} />
      ) : (
        <Link
          href="/contact#advertise"
          style={{ maxWidth: w, aspectRatio: `${w} / ${h}` }}
          className="group w-full flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-line-2 bg-canvas hover:border-cobalt hover:bg-cobalt-soft transition-colors p-4 text-center"
        >
          <span className="text-sm font-bold text-muted">Your ad here · {slot.size}</span>
          <span className="text-xs font-extrabold text-cobalt-ink">Advertise on PolishPal → Contact us</span>
        </Link>
      )}
    </div>
  );
}
