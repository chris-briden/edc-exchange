"use client";

import { useState } from "react";
import Link from "next/link";
import { PenSquare, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommunityPostCard from "@/components/CommunityPostCard";
import { communityPosts } from "@/lib/data";

const filters = ["All", "Collections", "Reviews", "Discussions", "Photos"];
const filterMap: Record<string, string | null> = {
  All: null,
  Collections: "collection",
  Reviews: "review",
  Discussions: "discussion",
  Photos: "photo",
};

export default function CommunityPage() {
  const [active, setActive] = useState("All");

  const filtered =
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
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition">
            <PenSquare className="w-4 h-4" />
            New Post
          </button>
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
          {filtered.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No posts yet in this category</p>
            <p className="text-sm mt-1">Be the first to share!</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
