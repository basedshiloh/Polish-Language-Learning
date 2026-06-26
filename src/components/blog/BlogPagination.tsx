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

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Blog pagination">
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-600">
          <ChevronLeft className="w-4 h-4" />
          Prev
        </span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={href(page)}
          className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-600">
          Next
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
