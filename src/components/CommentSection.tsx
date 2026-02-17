"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, Loader2, Reply } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import type { Comment } from "@/lib/types";

function CommentItem({
  comment,
  replies,
  userId,
  onReplySubmit,
}: {
  comment: Comment;
  replies: Comment[];
  userId: string | null;
  onReplySubmit: (parentId: string, content: string) => Promise<void>;
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || submitting) return;
    setSubmitting(true);
    await onReplySubmit(comment.id, replyText.trim());
    setReplyText("");
    setShowReplyInput(false);
    setSubmitting(false);
  };

  return (
    <div>
      <div className="flex gap-3">
        <Link href={`/profile/${comment.user_id}`} className="shrink-0">
          {comment.profiles?.avatar_url ? (
            <Image
              src={comment.profiles.avatar_url}
              alt={comment.profiles.username || ""}
              width={36}
              height={36}
              className="rounded-full w-9 h-9 object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
              {comment.profiles?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </Link>
        <div className="flex-1">
          <div className="bg-zinc-800 rounded-xl px-4 py-3">
            <div className="flex items-baseline gap-2">
              <Link
                href={`/profile/${comment.user_id}`}
                className="font-semibold text-sm hover:text-orange-600 transition"
              >
                {comment.profiles?.username || "User"}
              </Link>
              <span className="text-xs text-gray-400">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
          </div>
          {userId && (
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1 mt-1 ml-2 text-xs text-gray-400 hover:text-orange-600 transition"
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
          )}
          {showReplyInput && (
            <form onSubmit={handleReply} className="flex gap-2 mt-2 ml-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={submitting || !replyText.trim()}
                className="px-3 py-2 rounded-lg bg-orange-700 text-white text-sm font-semibold hover:bg-orange-600 shadow-lg shadow-orange-900/50 transition disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-12 mt-3 space-y-3 border-l-2 border-zinc-700 pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <Link href={`/profile/${reply.user_id}`} className="shrink-0">
                {reply.profiles?.avatar_url ? (
                  <Image
                    src={reply.profiles.avatar_url}
                    alt={reply.profiles.username || ""}
                    width={28}
                    height={28}
                    className="rounded-full w-7 h-7 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                    {reply.profiles?.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </Link>
              <div className="flex-1 bg-zinc-800 rounded-xl px-3 py-2">
                <div className="flex items-baseline gap-2">
                  <Link
                    href={`/profile/${reply.user_id}`}
                    className="font-semibold text-xs hover:text-orange-600 transition"
                  >
                    {reply.profiles?.username || "User"}
                  </Link>
                  <span className="text-[10px] text-gray-400">
                    {new Date(reply.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({
  itemId,
  postId,
}: {
  itemId?: string;
  postId?: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });

    let query = supabase
      .from("comments")
      .select("*, profiles(*)")
      .order("created_at", { ascending: true });

    if (itemId) query = query.eq("item_id", itemId);
    if (postId) query = query.eq("post_id", postId);

    query.then(({ data }) => {
      if (data) setComments(data as Comment[]);
      setLoading(false);
    });
  }, [itemId, postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        item_id: itemId || null,
        post_id: postId || null,
        content: newComment.trim(),
        parent_id: null,
      })
      .select("*, profiles(*)")
      .single();

    if (!error && data) {
      setComments((prev) => [...prev, data as Comment]);
      setNewComment("");
    }
    setSubmitting(false);
  };

  const handleReplySubmit = async (parentId: string, content: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        item_id: itemId || null,
        post_id: postId || null,
        content,
        parent_id: parentId,
      })
      .select("*, profiles(*)")
      .single();

    if (!error && data) {
      setComments((prev) => [...prev, data as Comment]);
    }
  };

  // Separate top-level comments and replies
  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesByParent = comments.reduce(
    (acc, c) => {
      if (c.parent_id) {
        if (!acc[c.parent_id]) acc[c.parent_id] = [];
        acc[c.parent_id].push(c);
      }
      return acc;
    },
    {} as Record<string, Comment[]>
  );

  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comment list */}
      <div className="space-y-4 mb-6">
        {topLevel.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={repliesByParent[comment.id] || []}
            userId={userId}
            onReplySubmit={handleReplySubmit}
          />
        ))}

        {!loading && comments.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No comments yet. Be the first!
          </p>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={userId ? "Write a comment..." : "Sign in to comment"}
          disabled={!userId}
          className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-zinc-800 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!userId || submitting || !newComment.trim()}
          className="px-4 py-2.5 rounded-xl bg-orange-700 text-white font-semibold hover:bg-orange-600 shadow-lg shadow-orange-900/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
