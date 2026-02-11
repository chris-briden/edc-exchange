"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PenSquare, Filter, Heart, MessageCircle, Share2 } from "lucide-react";
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

const typeStyles: Record<string, { badge: string; bg: string }> = {
  collection: { badge: "Collection", bg: "bg-purple-100 text-purple-700" },
  review: { badge: "Review", bg: "bg-blue-100 text-blue-700" },
  discussion: { badge: "Discussion", bg: "bg-green-100 text-green-700" },
  photo: { badge: "Photo", bg: "bg-amber-100 text-amber-700" },
};

function DbPostCard({ post }: { post: Post }) {
  const style = typeStyles[post.type] || typeStyles.discussion;
  const firstImage = post.post_images?.[0]?.url;

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
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
            {post.profiles?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">
            {post.profiles?.username || "Unknown"}
          </p>
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

      <h3 className="font-bold text-lg leading-snug mb-2">{post.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{post.content}</p>

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
        <button className="flex items-center gap-1.5 hover:text-red-500 transition">
          <Heart className="w-4 h-4" />
          <span>{post.likes?.[0]?.count || 0}</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-500 transition">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments?.[0]?.count || 0}</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-green-500 transition ml-auto">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}

export default function CommunityPage() {
  const [active, setActive] = useState("All");
  const [dbPosts, setDbPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("posts")
      .select(
        "*, profiles(*), post_images(*), likes(count), comments(count)"
      )
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDbPosts(data as Post[]);
        }
        setLoaded(true);
      });
  }, []);

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

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
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

        {/* Posts feed */}
        <div className="space-y-4">
          {hasDbData
            ? filteredDb.map((post) => (
                <DbPostCard key={post.id} post={post} />
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
