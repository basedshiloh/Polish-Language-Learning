import Image from 'next/image';
import { BookOpen, ExternalLink } from 'lucide-react';
import { withAmazonTag } from '@/lib/affiliate';
import { amazonAsin, amazonProducts } from '@/data/amazon-products';

// Product card for a standalone Amazon link in post markdown.
// The whole card is one link, so it is easy to tap on a phone.
export default function AmazonCard({ href, text }: { href: string; text: string }) {
  const asin = amazonAsin(href);
  const product = asin ? amazonProducts[asin] : undefined;
  const title = product?.title ?? text;

  return (
    <a
      href={withAmazonTag(href)}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label={`${title}${product ? ` by ${product.author}` : ''}, view on Amazon (opens in a new tab)`}
      className="group tile tile-link not-prose flex items-center gap-4 sm:gap-5 my-8 p-4 sm:p-5 no-underline bg-sun-soft/40"
    >
      {product?.image ? (
        <Image
          src={product.image}
          alt=""
          width={240}
          height={360}
          loading="lazy"
          sizes="96px"
          className="w-[72px] sm:w-[92px] h-auto shrink-0 rounded-md shadow-[0_4px_12px_rgba(30,33,50,0.18)] bg-line"
        />
      ) : (
        <span aria-hidden="true" className="icon-badge w-[72px] h-[100px] shrink-0 bg-sun-soft text-sun-ink">
          <BookOpen className="w-7 h-7" strokeWidth={2.2} />
        </span>
      )}

      <span className="flex-1 min-w-0">
        <span className="block text-[11px] font-extrabold uppercase tracking-[0.08em] text-sun-ink">
          Recommended read
        </span>
        <span className="mt-1 block text-[17px] sm:text-[18px] font-extrabold text-ink leading-snug">
          {title}
        </span>
        {product && (
          <span className="mt-0.5 block text-[15px] font-semibold text-ink-2">{product.author}</span>
        )}
        {product?.note && (
          <span className="mt-0.5 block text-[13px] font-semibold text-muted leading-snug">{product.note}</span>
        )}
        <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="btn btn-sun btn-sm">
            View on Amazon
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.6} aria-hidden="true" />
          </span>
          <span className="text-[12px] font-semibold text-muted">Affiliate link</span>
        </span>
      </span>
    </a>
  );
}
