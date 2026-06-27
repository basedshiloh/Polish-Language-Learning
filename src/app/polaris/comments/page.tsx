'use client';

import { useState, useCallback, useEffect } from 'react';
import { Eye, EyeOff, Trash2, MessageSquare, RefreshCw, ChevronLeft, ChevronRight, CornerDownRight } from 'lucide-react';

interface Comment {
  id: string;
  page_id: string;
  page_type: string;
  author_name: string;
  content: string;
  created_at: string;
  hidden: boolean;
  parent_id: string | null;
}

interface Stats {
  total: number;
  hidden: number;
  visible: number;
  uniquePages: number;
}

const PAGE_SIZE = 20;

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function pageLabel(pageId: string): string {
  return pageId
    .replace(/^(lesson|grammar|blog)-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const api = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch('/api/polaris', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  }, []);

  const refresh = useCallback(async (currentFilter: string, currentPage: number) => {
    setLoading(true);
    const [commentsData, statsData] = await Promise.all([
      currentFilter === 'all'
        ? api({ action: 'list-all', limit: PAGE_SIZE, offset: currentPage * PAGE_SIZE })
        : api({ action: 'list-filtered', hidden: currentFilter === 'hidden', limit: PAGE_SIZE, offset: currentPage * PAGE_SIZE }),
      api({ action: 'stats' }),
    ]);
    setComments(commentsData.comments || []);
    setTotal(commentsData.total || 0);
    if (!statsData.error) setStats(statsData);
    setLoading(false);
  }, [api]);

  useEffect(() => { refresh(filter, page); }, [page, filter, refresh]);

  const handleAction = async (commentId: string, action: 'hide' | 'unhide' | 'delete') => {
    setActionLoading(commentId);
    await api({ action, commentId });
    setDeleteConfirm(null);
    await refresh(filter, page);
    setActionLoading(null);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Comments</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500">Moderate community comments</p>
          </div>
          <button
            onClick={() => refresh(filter, page)}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total', value: stats.total, color: 'text-blue-600' },
              { label: 'Visible', value: stats.visible, color: 'text-green-600' },
              { label: 'Hidden', value: stats.hidden, color: 'text-red-500' },
              { label: 'Pages', value: stats.uniquePages, color: 'text-purple-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs text-gray-400 dark:text-gray-500">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {(['all', 'visible', 'hidden'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(0); }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === f
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">Loading...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No comments found
            </div>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className={`bg-white dark:bg-gray-900 rounded-lg border p-4 transition-colors ${
                  c.hidden ? 'border-red-200 dark:border-red-900/50 opacity-60' : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {c.parent_id && <CornerDownRight className="w-3.5 h-3.5 text-blue-400" />}
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{c.author_name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(c.created_at)}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">{pageLabel(c.page_id)}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-600">{c.page_type}</span>
                      {c.parent_id && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">Reply</span>}
                      {c.hidden && <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium">Hidden</span>}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">{c.content}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {c.hidden ? (
                      <button onClick={() => handleAction(c.id, 'unhide')} disabled={actionLoading === c.id} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors" title="Show comment">
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => handleAction(c.id, 'hide')} disabled={actionLoading === c.id} className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors" title="Hide comment">
                        <EyeOff className="w-4 h-4" />
                      </button>
                    )}
                    {deleteConfirm === c.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleAction(c.id, 'delete')} disabled={actionLoading === c.id} className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Confirm</button>
                        <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(c.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Delete permanently">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
