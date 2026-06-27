'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { MessageSquare, Send, User, Reply, X } from 'lucide-react';
import { getComments, addComment, containsUrl, type Comment } from '@/lib/supabase';

interface CommentSectionProps {
  pageId: string;
  pageType: 'lesson' | 'grammar' | 'blog';
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function stripUrls(text: string): string {
  return text.replace(/(?:https?:\/\/|www\.)[^\s]+/gi, '[link removed]');
}

function buildThread(comments: Comment[]): { roots: Comment[]; replies: Map<string, Comment[]> } {
  const roots: Comment[] = [];
  const replies = new Map<string, Comment[]>();

  for (const c of comments) {
    if (c.parent_id) {
      const existing = replies.get(c.parent_id) || [];
      existing.push(c);
      replies.set(c.parent_id, existing);
    } else {
      roots.push(c);
    }
  }

  return { roots, replies };
}

function CommentBubble({
  comment,
  replies,
  allReplies,
  onReply,
  depth = 0,
}: {
  comment: Comment;
  replies: Comment[];
  allReplies: Map<string, Comment[]>;
  onReply: (c: Comment) => void;
  depth?: number;
}) {
  return (
    <div className={depth > 0 ? 'ml-8 border-l-2 border-gray-100 dark:border-gray-800 pl-4' : ''}>
      <div className="flex gap-3 py-2">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
            {comment.author_name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{comment.author_name}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(comment.created_at)}</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line break-words">
            {stripUrls(comment.content)}
          </p>
          {depth < 2 && (
            <button
              onClick={() => onReply(comment)}
              className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 mt-1 transition-colors"
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
          )}
        </div>
      </div>

      {replies.map((r) => (
        <CommentBubble
          key={r.id}
          comment={r}
          replies={allReplies.get(r.id) || []}
          allReplies={allReplies}
          onReply={onReply}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export default function CommentSection({ pageId, pageType }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

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

    if (containsUrl(trimContent) || containsUrl(trimName)) {
      setError('Links and URLs are not allowed in comments.');
      return;
    }

    setSubmitting(true);
    localStorage.setItem('polish-pal-comment-name', trimName);

    try {
      const comment = await addComment(pageId, pageType, trimName, trimContent, replyTo?.id);
      if (comment) {
        setComments((prev) => [...prev, comment]);
        setContent('');
        setReplyTo(null);
      } else {
        setError('Failed to post comment. Please try again.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to post comment.';
      setError(msg);
    }
    setSubmitting(false);
  }, [name, content, pageId, pageType, replyTo]);

  const { roots, replies } = buildThread(comments);

  return (
    <div className="no-print mt-10 border-t border-gray-200 dark:border-gray-800 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          {replyTo && (
            <div className="flex items-center justify-between mb-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 min-w-0">
                <Reply className="w-3.5 h-3.5 shrink-0" />
                <span>Replying to <strong>{replyTo.author_name}</strong></span>
                <span className="text-blue-400 dark:text-blue-500 truncate">&mdash; {replyTo.content.slice(0, 60)}{replyTo.content.length > 60 ? '...' : ''}</span>
              </div>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="p-0.5 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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
            placeholder={replyTo ? `Reply to ${replyTo.author_name}...` : 'Share your thoughts, ask a question, or leave a tip for other learners...'}
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
              {submitting ? 'Posting...' : replyTo ? 'Reply' : 'Post'}
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
      ) : roots.length > 0 ? (
        <div className="space-y-1">
          {roots.map((c) => (
            <CommentBubble
              key={c.id}
              comment={c}
              replies={replies.get(c.id) || []}
              allReplies={replies}
              onReply={setReplyTo}
            />
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
