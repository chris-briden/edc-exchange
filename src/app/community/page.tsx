"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  PenSquare,
  Filter,
  Heart,
  MessageCircle,
  Share2,
  ArrowUpDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommunityPostCard from "@/components/CommunityPostCard";
import { communityPosts } from "@/lib/data";
import { createClient } from "@/lib/supabase-browser";
import type { Post } from "@/lib/types";

const filters = ["All", "Collections", "Reviews", "Discussions", "Photos"];
const filterMap: Record<string, string | null> = {
  All: null,
  Collections: "collection",
  Reviews: "review",
  Discussions: "discussion",
  Photos: "photo",
};

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Most Popular", value: "popular" },
  { label: "Most Discussed", value: "discussed" },
];

const typeStyles: Record<string, { badge: string; bg: string }> = {
  collection: { badge: "Collection", bg: "bg-purple-100 text-purple-700" },
  review: { badge: "Review", bg: "bg-blue-100 text-blue-700" },
  discussion: { badge: "Discussion", bg: "bg-green-100 text-green-700" },
  photo: { badge: "Photo", bg: "bg-amber-100 text-amber-700" },
};

function DbPostCard({
  post,
  currentUserId,
}: {
  post: Post;
  currentUserId: string | null;
}) {
  const style = typeStyles[post.type] || typeStyles.discussion;
  const firstImage = post.post_images?.[0]?.url;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.[0]?.count || 0);

  useEffect(() => {
    if (!currentUserId) return;
    const supabase = createClient();
    supabase
      .from("likes")
      .select("id")
      .eq("user_id", currentUserId)
      .eq("post_id", post.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setLiked(true);
      });
  }, [currentUserId, post.id]);

  const toggleLike = async () => {
    if (!currentUserId) {
      window.location.href = "/login";
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
        .eq("post_id", post.id);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      await supabase
        .from("likes")
        .insert({ user_id: currentUserId, post_id: post.id });
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        {post.profiles?.avatar_url ? (
          <Image
            src={post.profiles.avatar_url}
            alt={post.profiles.username || ""}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
            {post.profiles?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Link
            href={`/profile/${post.user_id}`}
            className="font-semibold text-sm hover:text-orange-600 transition"
          >
            {post.profiles?.username || "Unknown"}
          </Link>
          <p className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg}`}
        >
          {style.badge}
        </span>
      </div>

      <Link href={`/community/${post.id}`} className="block">
        <h3 className="font-bold text-lg leading-snug mb-2 hover:text-orange-600 transition">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {post.content}
        </p>

        {/* Post image */}
        {firstImage && (
          <div className="mt-3 relative aspect-video rounded-xl overflow-hidden">
            <Image
              src={firstImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </Link>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-orange-600 font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 text-gray-500 text-sm">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 transition ${
            liked ? "text-red-500" : "hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          <span>{likeCount}</span>
        </button>
        <Link
          href={`/community/${post.id}`}
          className="flex items-center gap-1.5 hover:text-blue-500 transition"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments?.[0]?.count || 0}</span>
        </Link>
        <button className="flex items-center gap-1.5 hover:text-green-500 transition ml-auto">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}

function CommunityPageInner() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const initialFilter = filterParam
    ? Object.entries(filterMap).find(([, v]) => v === filterParam)?.[0] || "All"
    : "All";
  const [active, setActive] = useState(initialFilter);
  const [sortBy, setSortBy] = useState("newest");
  const [dbPosts, setDbPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    const supabase = createClient();

    const { data } = await supabase
      .from("posts")
      .select(
        "*, profiles(*), post_images(*), likes(count), comments(count)"
      )
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      let posts = data as Post[];

      // Client-side sorting for popular/discussed since Supabase
      // can't order by aggregate count joins easily
      if (sortBy === "popular") {
        posts.sort(
          (a, b) =>
            (b.likes?.[0]?.count || 0) - (a.likes?.[0]?.count || 0)
        );
      } else if (sortBy === "discussed") {
        posts.sort(
          (a, b) =>
            (b.comments?.[0]?.count || 0) - (a.comments?.[0]?.count || 0)
        );
      }

      setDbPosts(posts);
    }
    setLoaded(true);
  }, [sortBy]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const hasDbData = dbPosts.length > 0;

  const filteredDb =
    filterMap[active] === null
      ? dbPosts
      : dbPosts.filter((p) => p.type === filterMap[active]);

  const filteredMock =
    filterMap[active] === null
      ? communityPosts
      : communityPosts.filter((p) => p.type === filterMap[active]);

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Community</h1>
            <p className="text-gray-500 mt-1">
              Share your carry, read reviews, and join the conversation.
            </p>
          </div>
          <Link
            href="/posts/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition"
          >
            <PenSquare className="w-4 h-4" />
            New Post
          </Link>
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  active === f
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts feed */}
        <div className="space-y-4">
          {hasDbData
            ? filteredDb.map((post) => (
                <DbPostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUserId}
                />
              ))
            : filteredMock.map((post) => (
                <CommunityPostCard key={post.id} post={post} />
              ))}
        </div>

        {loaded &&
          (hasDbData ? filteredDb : filteredMock).length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">
                No posts yet in this category
              </p>
              <p className="text-sm mt-1">Be the first to share!</p>
            </div>
          )}
      </div>

      <Footer />
    </>
  );
}

export default function CommunityPage() {
  return (
    <Suspense>
      <CommunityPageInner />
    </Suspense>
  );
}
