'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { slugify } from '@/lib/utils';

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
        p: ({ children }) => (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>
        ),
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
        a: ({ href, children }) => (
          <a
            href={href}
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer nofollow' : undefined}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) => (
          <figure className="my-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt || ''} className="rounded-lg w-full" loading="lazy" />
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
