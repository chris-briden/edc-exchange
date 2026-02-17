"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Users,
  PocketKnife,
  Flashlight,
  PenTool,
  Wrench,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import ItemCard from "@/components/ItemCard";
import DbItemCard from "@/components/DbItemCard";
import CommunityPostCard from "@/components/CommunityPostCard";
import { categories as mockCategories, edcItems, communityPosts } from "@/lib/data";
import { createClient } from "@/lib/supabase-browser";
import type { Item, Post, Category as DbCategory } from "@/lib/types";

type DbCategoryWithCount = DbCategory & { items: { count: number }[] };

export default function Home() {
  const [dbCategories, setDbCategories] = useState<DbCategoryWithCount[]>([]);
  const [dbItems, setDbItems] = useState<Item[]>([]);
  const [dbPosts, setDbPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    Promise.all([
      supabase
        .from("categories")
        .select("*, items(count)")
        .order("name"),
      supabase
        .from("items")
        .select("*, profiles(*), categories(*), item_images(*)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("posts")
        .select("*, profiles(*), post_images(*), likes(count), comments(count)")
        .order("created_at", { ascending: false })
        .limit(4),
    ]).then(([catRes, itemRes, postRes]) => {
      if (catRes.data) setDbCategories(catRes.data as DbCategoryWithCount[]);
      if (itemRes.data) setDbItems(itemRes.data as Item[]);
      if (postRes.data) setDbPosts(postRes.data as Post[]);
      setLoaded(true);
    });
  }, []);

  const hasDbCategories = dbCategories.length > 0;
  const hasDbItems = dbItems.length > 0;
  const hasDbPosts = dbPosts.length > 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 opacity-[0.07]">
          <PocketKnife className="absolute top-10 left-10 w-24 h-24 text-orange-400" />
          <Flashlight className="absolute top-20 right-20 w-20 h-20 text-blue-400" />
          <PenTool className="absolute bottom-10 left-1/3 w-16 h-16 text-orange-300" />
          <Wrench className="absolute bottom-20 right-10 w-24 h-24 text-blue-300" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="flex items-center gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-600/20 border border-orange-500/30 text-orange-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              Now in Beta
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              The marketplace for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400">
                everyday carry
              </span>{" "}
              enthusiasts
            </h1>
            <p className="mt-5 text-lg text-gray-300 leading-relaxed max-w-lg">
              Buy, sell, trade, lend, and rent EDC gear. Share your collection.
              Join a community that speaks your language.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/community"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-600 text-white font-semibold hover:bg-orange-700 transition shadow-lg shadow-orange-600/25"
              >
                Join the Carry <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition backdrop-blur border border-zinc-700"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
          {/* Icon Emblem */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <Image
              src="/icon-new-white.png"
              alt="The Carry Exchange Emblem"
              width={568}
              height={556}
              className="opacity-50 select-none pointer-events-none drop-shadow-2xl w-96 h-96"
            />
          </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-zinc-900/50 border-b border-zinc-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-green-500" />
              <div className="text-left">
                <p className="font-semibold text-sm text-white">Verified Sellers</p>
                <p className="text-xs text-gray-500">
                  Community-vetted traders
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <div className="text-left">
                <p className="font-semibold text-sm text-white">Growing Marketplace</p>
                <p className="text-xs text-gray-500">
                  Knives, lights, pens & more
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Users className="w-8 h-8 text-purple-400" />
              <div className="text-left">
                <p className="font-semibold text-sm text-white">EDC Community</p>
                <p className="text-xs text-gray-500">
                  Connect with enthusiasts
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Browse Categories</h2>
          <Link
            href="/categories"
            className="text-orange-400 text-sm font-medium hover:text-orange-300 flex items-center gap-1 transition"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {hasDbCategories
            ? dbCategories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  slug={cat.slug}
                  name={cat.name}
                  count={cat.items?.[0]?.count ?? 0}
                />
              ))
            : mockCategories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  slug={cat.id}
                  name={cat.name}
                  count={cat.count}
                />
              ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Listings</h2>
          <Link
            href="/categories"
            className="text-orange-400 text-sm font-medium hover:text-orange-300 flex items-center gap-1 transition"
          >
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {!loaded ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : hasDbItems ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dbItems.map((item) => (
              <DbItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {edcItems.slice(0, 4).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Community Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">From the Community</h2>
          <Link
            href="/community"
            className="text-orange-400 text-sm font-medium hover:text-orange-300 flex items-center gap-1 transition"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {!loaded ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : hasDbPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbPosts.map((post) => {
              const postType = typeStyles[post.type] || typeStyles.discussion;
              return (
                <Link
                  key={post.id}
                  href={`/community`}
                  className="bg-zinc-900/50 backdrop-blur rounded-2xl border border-zinc-800 p-5 hover:border-orange-500/50 transition block"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {post.profiles?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white">
                        {post.profiles?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${postType.bg}`}
                    >
                      {postType.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg leading-snug mb-2 text-white">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {post.content}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-orange-400 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityPosts.slice(0, 4).map((post) => (
              <CommunityPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-orange-500/30 text-white p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Ready to join the carry?
            </h2>
            <p className="mt-3 text-gray-400 max-w-md mx-auto">
              Share your collection, find your next grail, and connect with EDC
              enthusiasts worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-full bg-orange-600 text-white font-semibold hover:bg-orange-700 transition shadow-lg shadow-orange-600/25"
              >
                Join the Carry →
              </Link>
              <Link
                href="/community"
                className="px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition backdrop-blur border border-zinc-700"
              >
                Explore First
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const typeStyles: Record<string, { badge: string; bg: string }> = {
  collection: { badge: "Collection", bg: "bg-purple-500/20 text-purple-300" },
  review: { badge: "Review", bg: "bg-blue-500/20 text-blue-300" },
  discussion: { badge: "Discussion", bg: "bg-green-500/20 text-green-300" },
  photo: { badge: "Photo", bg: "bg-amber-500/20 text-amber-300" },
};
