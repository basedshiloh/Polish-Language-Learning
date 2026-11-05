import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BlogPagination({
  currentPage,
  totalPages,
  category,
}: {
  currentPage: number;
  totalPages: number;
  category?: string;
}) {
  if (totalPages <= 1) return null;

  function href(page: number) {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (category) params.set('category', category);
    const qs = params.toString();
    return qs ? `/blog?${qs}` : '/blog';
  }

  const pageCls = 'w-11 h-11 flex items-center justify-center rounded-2xl text-[15px] font-extrabold transition-colors';

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 mt-12" aria-label="Blog pagination">
      {currentPage > 1 ? (
        <Link href={href(currentPage - 1)} className="btn btn-secondary btn-sm" aria-label="Previous page">
          <ChevronLeft className="w-4 h-4" strokeWidth={3} /> Prev
        </Link>
      ) : (
        <span className="btn btn-secondary btn-sm" aria-disabled="true">
          <ChevronLeft className="w-4 h-4" strokeWidth={3} /> Prev
        </span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={href(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`${pageCls} ${
            page === currentPage
              ? 'bg-crimson text-white shadow-[0_3px_0_var(--color-crimson-edge)]'
              : 'text-ink-2 hover:bg-canvas'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link href={href(currentPage + 1)} className="btn btn-secondary btn-sm" aria-label="Next page">
          Next <ChevronRight className="w-4 h-4" strokeWidth={3} />
        </Link>
      ) : (
        <span className="btn btn-secondary btn-sm" aria-disabled="true">
          Next <ChevronRight className="w-4 h-4" strokeWidth={3} />
        </span>
      )}
    </nav>
  );
}
