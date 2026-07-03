import Image from 'next/image';
import type { BlogAuthor } from '@/lib/types';

export default function AuthorBox({
  author,
  date,
  readingTime,
  updatedDate,
}: {
  author: BlogAuthor;
  date: string;
  readingTime: number;
  updatedDate?: string;
}) {
  const formatted = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const updated = updatedDate
    ? new Date(updatedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="w-12 h-12 rounded-full bg-white border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
        {author.avatar ? (
          <Image src={author.avatar} alt={author.name} width={48} height={48} className="w-9 h-9 object-contain" />
        ) : (
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{author.name.charAt(0)}</span>
        )}
      </div>
      <div>
        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{author.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{author.bio}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
          <time dateTime={date}>{formatted}</time>
          <span>·</span>
          <span>{readingTime} min read</span>
          {updated && (
            <>
              <span>·</span>
              <span>Updated {updated}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
