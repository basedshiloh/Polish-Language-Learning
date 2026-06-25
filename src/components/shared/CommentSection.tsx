'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { getComments, addComment, type Comment } from '@/lib/supabase';

interface CommentSectionProps {
  pageId: string;
  pageType: 'lesson' | 'grammar';
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function CommentSection({ pageId, pageType }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('polish-pal-comment-name');
    if (savedName) setName(savedName);

    getComments(pageId)
      .then(setComments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pageId]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const trimName = name.trim();
    const trimContent = content.trim();

    if (!trimName) { setError('Please enter your name.'); return; }
    if (trimName.length > 50) { setError('Name must be under 50 characters.'); return; }
    if (!trimContent) { setError('Please write a comment.'); return; }
    if (trimContent.length > 2000) { setError('Comment must be under 2000 characters.'); return; }

    setSubmitting(true);
    localStorage.setItem('polish-pal-comment-name', trimName);

    try {
      const comment = await addComment(pageId, pageType, trimName, trimContent);
      if (comment) {
        setComments((prev) => [comment, ...prev]);
        setContent('');
      } else {
        setError('Failed to post comment. Please try again.');
      }
    } catch {
      setError('Failed to post comment. Please try again.');
    }
    setSubmitting(false);
  }, [name, content, pageId, pageType]);

  return (
    <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              className="flex-1 text-sm bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, ask a question, or leave a tip for other learners..."
            rows={3}
            maxLength={2000}
            className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-3 outline-none resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 border border-gray-100 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-600 transition-colors"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {content.length}/2000
            </span>
            <button
              type="submit"
              disabled={submitting || !content.trim() || !name.trim()}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  {c.author_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{c.author_name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
}
