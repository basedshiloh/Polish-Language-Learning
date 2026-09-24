'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { MessageSquare, Send, User, Reply, X, AlertCircle } from 'lucide-react';
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

const AVATAR_TONES = [
  'bg-crimson-soft text-crimson-ink',
  'bg-cobalt-soft text-cobalt-ink',
  'bg-emerald-soft text-emerald-ink',
  'bg-sun-soft text-sun-ink',
  'bg-violet-soft text-violet-ink',
  'bg-orange-soft text-orange-ink',
  'bg-teal-soft text-teal-ink',
  'bg-fuchsia-soft text-fuchsia-ink',
];

function avatarTone(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 1000003;
  return AVATAR_TONES[h % AVATAR_TONES.length];
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
    <div className={depth > 0 ? 'ml-5 sm:ml-6 border-l-2 border-line pl-4 sm:pl-5' : ''}>
      <div className="flex gap-3 py-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${avatarTone(comment.author_name)}`}>
          <span className="font-display text-base font-bold">
            {comment.author_name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[15px] font-extrabold text-ink">{comment.author_name}</span>
            <span className="text-xs font-semibold text-faint">{timeAgo(comment.created_at)}</span>
          </div>
          <p className="text-[15px] leading-relaxed text-ink-2 mt-1 whitespace-pre-line break-words">
            {stripUrls(comment.content)}
          </p>
          {depth < 2 && (
            <button
              onClick={() => onReply(comment)}
              className="inline-flex items-center gap-1 -ml-2 mt-1 px-2 py-1 rounded-lg text-xs font-extrabold uppercase tracking-[0.06em] text-muted hover:text-cobalt-ink hover:bg-cobalt-soft transition-colors"
            >
              <Reply className="w-3.5 h-3.5" strokeWidth={2.5} />
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
    <div className="no-print mt-12 border-t-2 border-line pt-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="icon-badge w-10 h-10 rounded-xl bg-cobalt-soft text-cobalt-ink">
          <MessageSquare className="w-5 h-5" strokeWidth={2.4} />
        </span>
        <h3 className="text-2xl font-bold">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="tile p-4 sm:p-5">
          {replyTo && (
            <div className="pp-pop flex items-center justify-between gap-2 mb-3 pl-3 pr-1.5 py-2 bg-cobalt-soft rounded-xl">
              <div className="flex items-center gap-2 text-sm text-cobalt-ink min-w-0">
                <Reply className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                <span className="shrink-0">Replying to <strong className="font-extrabold">{replyTo.author_name}</strong></span>
                <span className="opacity-70 truncate">&mdash; {replyTo.content.slice(0, 60)}{replyTo.content.length > 60 ? '...' : ''}</span>
              </div>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                aria-label="Cancel reply"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-cobalt-ink hover:bg-paper transition-colors shrink-0"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          )}
          <div className="relative mb-3">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" strokeWidth={2.5} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              aria-label="Your name"
              maxLength={50}
              className="w-full h-12 rounded-2xl border-2 border-line bg-canvas pl-11 pr-4 text-[15px] font-semibold text-ink outline-none focus:border-cobalt focus:bg-paper transition-colors placeholder:text-faint"
            />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={replyTo ? `Reply to ${replyTo.author_name}...` : 'Share your thoughts, ask a question, or leave a tip for other learners...'}
            rows={3}
            maxLength={2000}
            aria-label="Comment"
            className="w-full rounded-2xl border-2 border-line bg-canvas px-4 py-3 text-[15px] font-semibold leading-relaxed text-ink outline-none resize-none focus:border-cobalt focus:bg-paper transition-colors placeholder:text-faint"
          />
          {error && (
            <p className="pp-pop flex items-start gap-2 text-sm font-bold text-crimson-ink bg-crimson-soft rounded-xl px-3 py-2 mt-2" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2.5} />
              {error}
            </p>
          )}
          <div className="flex items-center justify-between gap-3 mt-3">
            <span className="text-xs font-bold text-faint tabular-nums">
              {content.length}/2000
            </span>
            <button
              type="submit"
              disabled={submitting || !content.trim() || !name.trim()}
              className="btn btn-primary btn-sm"
            >
              <Send className="w-4 h-4" strokeWidth={2.5} />
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
              <div className="w-10 h-10 bg-canvas rounded-full" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-canvas rounded-full w-24" />
                <div className="h-3 bg-canvas rounded-full w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : roots.length > 0 ? (
        <div className="divide-y-2 divide-line">
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
        <div className="rounded-3xl bg-canvas px-6 py-8 text-center">
          <span className="icon-badge w-12 h-12 rounded-2xl bg-paper text-cobalt-ink mx-auto mb-3">
            <MessageSquare className="w-6 h-6" strokeWidth={2.4} />
          </span>
          <p className="text-[15px] font-bold text-muted">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
}
