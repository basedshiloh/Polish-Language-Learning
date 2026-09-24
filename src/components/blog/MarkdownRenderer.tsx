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
      className="group tile tile-link flex items-center gap-4 my-6 p-4 pr-5 no-underline"
    >
      <span className={`icon-badge w-12 h-12 ${isLesson ? 'bg-crimson-soft text-crimson-ink' : 'bg-violet-soft text-violet-ink'}`}>
        <Icon className="w-6 h-6" strokeWidth={2.4} />
      </span>
      <span className="flex-1 min-w-0">
        <span className={`block text-xs font-extrabold uppercase tracking-[0.1em] ${isLesson ? 'text-crimson-ink' : 'text-violet-ink'}`}>
          Free {label.toLowerCase()}
        </span>
        <span className="block text-[16px] font-extrabold text-ink leading-snug">
          {children}
        </span>
      </span>
      <span
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white transition-transform group-hover:translate-x-0.5 ${isLesson ? 'bg-crimson shadow-[0_3px_0_var(--color-crimson-edge)]' : 'bg-violet shadow-[0_3px_0_var(--color-violet-edge)]'}`}
      >
        <ArrowRight className="w-5 h-5" strokeWidth={3} />
      </span>
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
            className="font-display text-[1.65rem] md:text-[1.9rem] font-semibold leading-tight text-ink mt-14 mb-5 scroll-mt-24 text-balance"
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-display text-[1.3rem] md:text-[1.4rem] font-semibold leading-snug text-ink mt-10 mb-3">{children}</h3>
        ),
        p: ({ children, node }) => {
          const child = node?.children;
          if (child && child.length === 1 && child[0].type === 'element' && child[0].tagName === 'a') {
            const href = child[0].properties?.href as string;
            if (href?.startsWith('/lessons/') || href?.startsWith('/grammar/')) {
              return <>{children}</>;
            }
          }
          // Images render as <figure>, which is invalid inside <p> (hydration error) — use a div.
          const hasImage = child?.some((c) => c.type === 'element' && c.tagName === 'img');
          const Tag = hasImage ? 'div' : 'p';
          return <Tag className="text-[1.0625rem] md:text-[1.125rem] leading-[1.8] text-ink-2 mb-6">{children}</Tag>;
        },
        ul: ({ children }) => (
          <ul className="list-disc marker:text-crimson space-y-2 text-[1.0625rem] md:text-[1.125rem] leading-[1.75] text-ink-2 mb-6 pl-6">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal marker:font-extrabold marker:text-crimson-ink space-y-2 text-[1.0625rem] md:text-[1.125rem] leading-[1.75] text-ink-2 mb-6 pl-6">{children}</ol>
        ),
        li: ({ children }) => <li className="pl-1.5">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="my-8 rounded-3xl bg-sun-soft px-6 py-5 md:px-7 md:py-6 text-ink [&>p:last-child]:mb-0 [&>p]:text-ink">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          if (!className) {
            return (
              <code className="px-1.5 py-0.5 bg-canvas rounded-md text-[0.9em] font-mono font-semibold text-crimson-ink">
                {children}
              </code>
            );
          }
          return (
            <code className="block text-sm font-mono">{children}</code>
          );
        },
        pre: ({ children }) => (
          <pre className="bg-ink text-white rounded-2xl p-5 overflow-x-auto mb-6 text-sm">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-8 rounded-2xl border-2 border-line">
            <table className="w-full text-[15px] border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-canvas px-4 py-3 text-left font-extrabold text-ink border-b-2 border-line whitespace-nowrap">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-ink-2 border-t border-line align-top">
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
              className="font-bold text-crimson-ink underline decoration-2 decoration-crimson/30 underline-offset-[5px] hover:decoration-crimson transition-colors"
            >
              {children}
            </a>
          );
        },
        img: ({ src, alt }) => (
          <figure className="my-10">
            {typeof src === 'string' && src.startsWith('/') ? (
              <Image
                src={src}
                alt={alt || ''}
                width={896}
                height={504}
                className="rounded-3xl w-full h-auto"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 720px"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt || ''} className="rounded-3xl w-full" loading="lazy" />
            )}
            {alt && <figcaption className="text-center text-sm font-semibold text-muted mt-3 px-4">{alt}</figcaption>}
          </figure>
        ),
        hr: () => (
          <div className="flex items-center justify-center gap-2.5 my-12" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson" />
            <span className="w-2.5 h-2.5 rounded-full bg-sun" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald" />
          </div>
        ),
        strong: ({ children }) => (
          <strong className="font-extrabold text-ink">{children}</strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
