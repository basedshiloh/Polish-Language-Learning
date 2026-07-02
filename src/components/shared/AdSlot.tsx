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
      <span className="self-center text-[9px] uppercase tracking-widest text-gray-300 dark:text-gray-600 mb-1">Advertisement</span>

      {slot.type === 'image' && slot.image_url ? (
        <a href={slot.link_url || '#'} target="_blank" rel="noopener noreferrer sponsored" className="block max-w-full">
          <Image
            src={slot.image_url}
            alt={slot.label || 'Advertisement'}
            width={w}
            height={h}
            className="rounded-lg max-w-full h-auto"
          />
        </a>
      ) : slot.type === 'html' && slot.html ? (
        <AdHtml html={slot.html} maxWidth={w} />
      ) : (
        <Link
          href="/contact#advertise"
          style={{ maxWidth: w, aspectRatio: `${w} / ${h}` }}
          className="w-full flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors p-4"
        >
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500">Your ad here · {slot.size}</span>
          <span className="text-xs text-blue-500 dark:text-blue-400">Advertise on PolishPal → Contact us</span>
        </Link>
      )}
    </div>
  );
}
