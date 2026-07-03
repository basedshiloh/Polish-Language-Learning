'use client';

import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { BookOpen, Table2, ArrowRight } from 'lucide-react';
import { slugify } from '@/lib/utils';

function InternalCard({ href, children }: { href: string; children: React.ReactNode }) {
  const isLesson = href.startsWith('/lessons/');
  const Icon = isLesson ? BookOpen : Table2;
  const label = isLesson ? 'Lesson' : 'Grammar';

  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 my-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md transition-all no-underline ${
        isLesson
          ? 'hover:border-blue-300 dark:hover:border-blue-700'
          : 'hover:border-purple-300 dark:hover:border-purple-700'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
        isLesson
          ? 'bg-blue-100 dark:bg-blue-900/40'
          : 'bg-purple-100 dark:bg-purple-900/40'
      }`}>
        <Icon className={`w-5 h-5 ${
          isLesson ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${
          isLesson ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
        }`}>
          {label}
        </span>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
          {children}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors shrink-0" />
    </Link>
  );
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h2: ({ children }) => (
          <h2
            id={slugify(String(children))}
            className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4 scroll-mt-8"
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">{children}</h3>
        ),
        p: ({ children, node }) => {
          const child = node?.children;
          if (child && child.length === 1 && child[0].type === 'element' && child[0].tagName === 'a') {
            const href = child[0].properties?.href as string;
            if (href?.startsWith('/lessons/') || href?.startsWith('/grammar/')) {
              return <>{children}</>;
            }
          }
          return <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>;
        },
        ul: ({ children }) => (
          <ul className="list-disc space-y-1 text-gray-700 dark:text-gray-300 mb-4 ml-6">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal space-y-1 text-gray-700 dark:text-gray-300 mb-4 ml-6">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-400 dark:border-blue-600 pl-4 py-2 my-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-r-lg">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          if (!className) {
            return (
              <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-pink-600 dark:text-pink-400">
                {children}
              </code>
            );
          }
          return (
            <code className="block text-sm font-mono">{children}</code>
          );
        },
        pre: ({ children }) => (
          <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4 text-sm">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-gray-100 dark:bg-gray-800 px-3 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            {children}
          </td>
        ),
        a: ({ href, title, children }) => {
          if (href?.startsWith('/lessons/') || href?.startsWith('/grammar/')) {
            return <InternalCard href={href}>{children}</InternalCard>;
          }
          const isExternal = href?.startsWith('http');
          // External links are dofollow by default.
          // To mark a link nofollow: [text](https://example.com "nofollow")
          // The signal word is stripped from the rendered title attribute.
          const nofollow = typeof title === 'string' && /nofollow/i.test(title);
          const cleanTitle = typeof title === 'string' && /^(dofollow|nofollow)$/i.test(title.trim())
            ? undefined
            : title;
          return (
            <a
              href={href}
              title={cleanTitle}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? (nofollow ? 'noopener noreferrer nofollow' : 'noopener noreferrer') : undefined}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {children}
            </a>
          );
        },
        img: ({ src, alt }) => (
          <figure className="my-6">
            {typeof src === 'string' && src.startsWith('/') ? (
              <Image
                src={src}
                alt={alt || ''}
                width={896}
                height={504}
                className="rounded-lg w-full h-auto"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt || ''} className="rounded-lg w-full" loading="lazy" />
            )}
            {alt && <figcaption className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">{alt}</figcaption>}
          </figure>
        ),
        hr: () => <hr className="my-8 border-gray-200 dark:border-gray-800" />,
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
