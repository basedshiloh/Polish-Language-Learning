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
    <div className="flex items-center gap-3.5 py-2">
      <div className="w-12 h-12 rounded-2xl bg-paper border-2 border-line flex items-center justify-center shrink-0 overflow-hidden">
        {author.avatar ? (
          <Image src={author.avatar} alt="" width={48} height={48} className="w-8 h-8 object-contain rounded-lg" />
        ) : (
          <span className="font-display text-xl font-semibold text-crimson">{author.name.charAt(0)}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-extrabold text-ink text-[15px] leading-tight">{author.name}</p>
        {author.bio && <p className="text-sm text-muted leading-snug mt-0.5">{author.bio}</p>}
        <p className="flex items-center gap-x-2 gap-y-0.5 mt-1 text-sm font-semibold text-muted flex-wrap">
          <time dateTime={date}>{formatted}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTime} min read</span>
          {updated && (
            <>
              <span aria-hidden="true">·</span>
              <span>Updated {updated}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
