"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Share2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import { createClient } from "@/lib/supabase-browser";
import type { Post } from "@/lib/types";

const typeStyles: Record<string, { badge: string; bg: string }> = {
  collection: { badge: "Collection", bg: "bg-purple-500/20 text-purple-300" },
  review: { badge: "Review", bg: "bg-blue-500/20 text-blue-300" },
  discussion: { badge: "Discussion", bg: "bg-green-500/20 text-green-300" },
  photo: { badge: "Photo", bg: "bg-amber-500/20 text-amber-300" },
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      const { data, error } = await supabase
        .from("posts")
        .select(
          "*, profiles(*), post_images(*), likes(count), comments(count)"
        )
        .eq("id", postId)
        .single();

      if (!data || error) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setPost(data as Post);
      setLikeCount(data.likes?.[0]?.count || 0);

      if (user) {
        const { data: likeData } = await supabase
          .from("likes")
          .select("id")
          .eq("user_id", user.id)
          .eq("post_id", postId)
          .maybeSingle();
        setLiked(!!likeData);
      }

      setLoading(false);
    };

    load();
  }, [postId]);

  const handleLike = async () => {
    if (!currentUserId) {
      router.push("/login");
      return;
    }
    const supabase = createClient();
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", currentUserId)
        .eq("post_id", postId);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      await supabase
        .from("likes")
        .insert({ user_id: currentUserId, post_id: postId });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.title || "Community Post",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch {
      // cancelled
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </>
    );
  }

  if (notFound || !post) {
    return (
      <>
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="text-gray-500 mt-2">
            This post may have been removed or doesn&apos;t exist.
          </p>
          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 mt-4 text-orange-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to community
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const style = typeStyles[post.type] || typeStyles.discussion;
  const username = post.profiles?.username || "User";
  const avatarUrl = post.profiles?.avatar_url;
  const images = post.post_images || [];
  const commentsCount = post.comments?.[0]?.count || 0;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 mb-6"
          >
          <ArrowLeft className="w-4 h-4" /> Back to community
        </Link>

          {/* Post card */}
          <article className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-6">
          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/profile/${post.user_id}`}>
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={username}
                  width={48}
                  height={48}
                  className="rounded-full w-12 h-12 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            <div className="flex-1">
              <Link
                href={`/profile/${post.user_id}`}
                className="font-semibold hover:text-orange-600 transition"
              >
                {username}
              </Link>
              <p className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${style.bg}`}
            >
              {style.badge}
            </span>
          </div>

            {/* Title & content */}
            <h1 className="text-2xl font-extrabold leading-tight mb-3">
              {post.title}
            </h1>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            {/* Images */}
            {images.length > 0 && (
              <div className={`mt-4 gap-2 ${images.length === 1 ? "" : "grid grid-cols-2"}`}>
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-video rounded-xl overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm text-orange-400 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 mt-6 pt-5 border-t border-zinc-800 text-gray-400 text-sm">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition ${
                liked ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
              />
              {likeCount} {likeCount === 1 ? "like" : "likes"}
            </button>
            <span className="flex items-center gap-1.5">
              {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
            </span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-green-500 transition ml-auto"
            >
              <Share2 className="w-5 h-5" /> Share
              </button>
            </div>
          </article>

          {/* Comments */}
          <CommentSection postId={postId} />
        </div>
      </div>

      <Footer />
    </>
  );
}
