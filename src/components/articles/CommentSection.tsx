'use client';

import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/use-session';
import { formatDate } from '@/lib/utils';
import { MessageCircle, Trash2, Reply, Send } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string | null; username: string | null; image: string | null };
  replies?: Comment[];
}

function Avatar({ user }: { user: Comment['author'] }) {
  if (user.image) return <img src={user.image} alt="" className="w-8 h-8 rounded-full object-cover" />;
  return (
    <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold text-white">
      {user.name?.[0] || '?'}
    </div>
  );
}

function CommentItem({
  comment,
  articleId,
  onDelete,
  onReplyPosted,
}: {
  comment: Comment;
  articleId: string;
  onDelete: (id: string) => void;
  onReplyPosted: (parentId: string, reply: Comment) => void;
}) {
  const { user } = useCurrentUser();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const postReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyText, parentId: comment.id }),
      });
      const data = await res.json();
      if (data.success) {
        onReplyPosted(comment.id, data.data);
        setReplyText('');
        setShowReply(false);
      } else {
        toast.error(data.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <div className="shrink-0">
        <Avatar user={comment.author} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-surface-lighter rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/profile/${comment.author.username}`}
              className="font-medium text-sm hover:text-brand-400 transition-colors"
            >
              {comment.author.name}
            </Link>
            <span className="text-text-muted text-xs">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-text-secondary whitespace-pre-wrap break-words">{comment.content}</p>
        </div>

        <div className="flex items-center gap-3 mt-1 px-2">
          {user && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-brand-400 transition-colors"
            >
              <Reply size={12} /> Reply
            </button>
          )}
          {user?.id === comment.author.id && (
            <button
              onClick={() => onDelete(comment.id)}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>

        {showReply && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && postReply()}
              placeholder="Write a reply..."
              className="input-field text-sm flex-1"
              autoFocus
            />
            <button
              onClick={postReply}
              disabled={submitting || !replyText.trim()}
              className="btn-primary text-sm px-3"
            >
              <Send size={14} />
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-neutral-800 pl-4">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <div className="shrink-0">
                  <Avatar user={reply.author} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-surface-lighter rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/profile/${reply.author.username}`}
                        className="font-medium text-sm hover:text-brand-400 transition-colors"
                      >
                        {reply.author.name}
                      </Link>
                      <span className="text-text-muted text-xs">{formatDate(reply.createdAt)}</span>
                    </div>
                    <p className="text-sm text-text-secondary whitespace-pre-wrap break-words">{reply.content}</p>
                  </div>
                  {user?.id === reply.author.id && (
                    <div className="mt-1 px-2">
                      <button
                        onClick={() => onDelete(reply.id)}
                        className="flex items-center gap-1 text-xs text-text-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommentSection({ articleId }: { articleId: string }) {
  const { user } = useCurrentUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/articles/${articleId}/comments`)
      .then((r) => r.json())
      .then((d) => {
        setComments(d.data || []);
        setLoading(false);
      });
  }, [articleId]);

  const postComment = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [data.data, ...prev]);
        setText('');
        toast.success('Comment posted!');
      } else {
        toast.error(data.error || 'Failed to post');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (id: string) => {
    const articleIdFromComment = articleId;
    const res = await fetch(`/api/articles/${articleIdFromComment}/comments/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setComments((prev) =>
        prev
          .filter((c) => c.id !== id)
          .map((c) => ({ ...c, replies: (c.replies || []).filter((r) => r.id !== id) }))
      );
      toast.success('Deleted');
    }
  };

  const handleReplyPosted = (parentId: string, reply: Comment) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId ? { ...c, replies: [...(c.replies || []), reply] } : c
      )
    );
  };

  const totalCount = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);

  return (
    <section className="mt-12 pt-8 border-t border-neutral-800">
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-6">
        <MessageCircle size={18} className="text-brand-400" />
        Comments {totalCount > 0 && <span className="text-text-muted font-normal text-sm">({totalCount})</span>}
      </h2>

      {user ? (
        <div className="flex gap-3 mb-8">
          <div className="shrink-0">
            {user.image ? (
              <img src={user.image} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold text-white">
                {user.name?.[0] || '?'}
              </div>
            )}
          </div>
          <div className="flex-1 flex gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.metaKey && postComment()}
              placeholder="Share your thoughts..."
              rows={2}
              className="input-field text-sm flex-1 resize-none"
            />
            <button
              onClick={postComment}
              disabled={submitting || !text.trim()}
              className="btn-primary text-sm px-4 self-end"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-surface-lighter rounded-xl text-center">
          <p className="text-text-secondary text-sm">
            <Link href="/login" className="text-brand-400 hover:underline">Sign in</Link> to leave a comment
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-neutral-800 shrink-0" />
              <div className="flex-1 bg-neutral-800 rounded-xl h-16" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              onDelete={deleteComment}
              onReplyPosted={handleReplyPosted}
            />
          ))}
        </div>
      )}
    </section>
  );
}
