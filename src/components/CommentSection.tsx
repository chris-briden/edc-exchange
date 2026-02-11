"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import type { Comment } from "@/lib/types";

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
      })
      .select("*, profiles(*)")
      .single();

    if (!error && data) {
      setComments((prev) => [...prev, data as Comment]);
      setNewComment("");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comment list */}
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Link href={`/profile/${comment.user_id}`} className="shrink-0">
              {comment.profiles?.avatar_url ? (
                <Image
                  src={comment.profiles.avatar_url}
                  alt={comment.profiles.username || ""}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {comment.profiles?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </Link>
            <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
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
              <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
            </div>
          </div>
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
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!userId || submitting || !newComment.trim()}
          className="px-4 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
