'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Pencil, Trash2, ExternalLink, Search } from 'lucide-react';
import type { Post } from '@/lib/types';
import { blogCategoryStyles } from '@/data/blog';

type Sort = 'recent' | 'oldest' | 'title' | 'status';

export default function PostsList({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>('recent');
  const [query, setQuery] = useState('');

  const shown = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = q ? posts.filter((p) => p.title.toLowerCase().includes(q) || p.slug.includes(q)) : [...posts];
    const t = (p: Post) => new Date(p.updatedDate || p.date).getTime();
    if (sort === 'recent') list.sort((a, b) => t(b) - t(a));
    else if (sort === 'oldest') list.sort((a, b) => t(a) - t(b));
    else if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'status') list.sort((a, b) => a.status.localeCompare(b.status) || t(b) - t(a));
    return list;
  }, [posts, query, sort]);

  async function action(body: Record<string, unknown>) {
    setBusy(String(body.id));
    await fetch('/api/cms/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setBusy(null);
    setConfirmDelete(null);
    router.refresh();
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Posts</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500">{posts.length} total</p>
          </div>
          <Link href="/polaris/posts/new" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            <PlusCircle className="w-4 h-4" /> New post
          </Link>
        </div>

        {/* Search + sort */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg outline-none focus:border-blue-400 text-gray-900 dark:text-gray-100"
            />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 outline-none text-gray-700 dark:text-gray-300">
            <option value="recent">Most recent</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title A–Z</option>
            <option value="status">Status</option>
          </select>
        </div>

        {shown.length === 0 ? (
          <p className="text-center py-12 text-gray-400 dark:text-gray-500">{posts.length === 0 ? 'No posts yet. Create your first one.' : 'No posts match your search.'}</p>
        ) : (
          <div className="space-y-2">
            {shown.map((p) => {
              const cat = blogCategoryStyles[p.category];
              return (
                <div key={p.id} className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                        {p.status}
                      </span>
                      {cat && <span className="text-xs text-gray-400 dark:text-gray-500">{cat.label}</span>}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">/blog/{p.slug}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {p.status === 'published' && (
                      <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" title="View" className="p-2 rounded text-gray-400 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <Link href={`/polaris/posts/${p.id}`} title="Edit" className="p-2 rounded text-gray-400 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    {confirmDelete === p.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => action({ action: 'delete', id: p.id, slug: p.slug })} disabled={busy === p.id} className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Confirm</button>
                        <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 text-xs text-gray-500">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(p.id)} title="Delete" className="p-2 rounded text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
