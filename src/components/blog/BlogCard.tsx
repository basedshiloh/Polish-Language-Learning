import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar } from 'lucide-react';
import type { Post } from '@/lib/types';
import { blogCategoryStyles } from '@/data/blog';

export default function BlogCard({ post }: { post: Post }) {
  const cat = blogCategoryStyles[post.category];

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all overflow-hidden flex flex-col">
      <Link href={`/blog/${post.slug}`} className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800 block">
        <Image
          src={post.featuredImage}
          alt={post.featuredImageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <Link
            href={`/blog?category=${post.category}`}
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full hover:opacity-80 transition-opacity ${cat.bg} ${cat.text} ${cat.darkBg} ${cat.darkText}`}
          >
            {cat.label}
          </Link>
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Calendar className="w-3 h-3" />
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>

        <Link href={`/blog/${post.slug}`} className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
        </Link>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
              {post.author.avatar ? (
                <Image src={post.author.avatar} alt={post.author.name} width={24} height={24} className="w-4 h-4 object-contain" />
              ) : (
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{post.author.name.charAt(0)}</span>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Clock className="w-3 h-3" />
            {post.readingTime} min
          </div>
        </div>
      </div>
    </div>
  );
}
