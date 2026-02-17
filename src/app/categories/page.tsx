"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Loader2,
  Plus,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DbItemCard from "@/components/DbItemCard";
import CategoryIcon from "@/components/CategoryIcon";
import { createClient } from "@/lib/supabase-browser";
import type { Item, Category } from "@/lib/types";

const listingFilters = [
  "All Types",
  "For Sale",
  "For Trade",
  "For Lend",
  "For Rent",
];
const listingMap: Record<string, string | null> = {
  "All Types": null,
  "For Sale": "sell",
  "For Trade": "trade",
  "For Lend": "lend",
  "For Rent": "rent",
};

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Liked", value: "popular" },
];

const PAGE_SIZE = 20;

function CategoriesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || null;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory
  );
  const [listingFilter, setListingFilter] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("newest");
  const [dbItems, setDbItems] = useState<Item[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchItems = useCallback(
    async (pageNum: number, append: boolean) => {
      const supabase = createClient();

      let query = supabase
        .from("items")
        .select(
          "*, profiles(*), categories(*), item_images(*), likes(count), comments(count)"
        )
        .eq("status", "active");

      // Category filter
      if (selectedCategory) {
        const cat = dbCategories.find((c) => c.slug === selectedCategory);
        if (cat) query = query.eq("category_id", cat.id);
      }

      // Listing type filter
      const lt = listingMap[listingFilter];
      if (lt) query = query.eq("listing_type", lt);

      // Search filter (basic text match)
      if (searchQuery.trim()) {
        const q = searchQuery.trim();
        query = query.or(
          `name.ilike.%${q}%,brand.ilike.%${q}%,description.ilike.%${q}%`
        );
      }

      // Sort
      switch (sortBy) {
        case "price_asc":
          query = query.order("price", {
            ascending: true,
            nullsFirst: false,
          });
          break;
        case "price_desc":
          query = query.order("price", {
            ascending: false,
            nullsFirst: false,
          });
          break;
        case "popular":
          query = query.order("favorites_count", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const from = pageNum * PAGE_SIZE;
      query = query.range(from, from + PAGE_SIZE - 1);

      const { data } = await query;
      const items = (data || []) as Item[];

      if (append) {
        setDbItems((prev) => [...prev, ...items]);
      } else {
        setDbItems(items);
      }
      setHasMore(items.length === PAGE_SIZE);
      return items;
    },
    [selectedCategory, listingFilter, searchQuery, sortBy, dbCategories]
  );

  // Initial load — categories + first page
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setDbCategories(data as Category[]);
      });
  }, []);

  // Reload items when filters/sort change
  useEffect(() => {
    if (dbCategories.length === 0) return;
    setPage(0);
    setLoaded(false);
    fetchItems(0, false).then(() => setLoaded(true));
  }, [selectedCategory, listingFilter, searchQuery, sortBy, dbCategories, fetchItems]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    await fetchItems(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-extrabold mb-2 text-white">Browse Marketplace</h1>
        <p className="text-gray-400 mb-4">
          Find your next EDC grail. Buy, sell, trade, lend, or rent.
        </p>

        {/* Search banner */}
        {searchQuery && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-400">
              Showing results for &ldquo;
              <strong className="text-white">{searchQuery}</strong>&rdquo;
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 rounded-full hover:bg-zinc-800 transition"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}

        {/* Category chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 mb-8">
          {dbCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.slug ? null : cat.slug
                )
              }
              className={`text-left rounded-xl p-4 border-2 transition flex items-center gap-3 ${
                selectedCategory === cat.slug
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
              }`}
            >
              <CategoryIcon slug={cat.slug} size="sm" />
              <div>
                <p className="font-semibold text-sm text-white">{cat.name}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Listing type */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
            {listingFilters.map((f) => (
              <button
                key={f}
                onClick={() => setListingFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  listingFilter === f
                    ? "bg-orange-600 text-white"
                    : "bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="ml-auto flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-zinc-700 rounded-lg px-3 py-1.5 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {!loaded ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : dbItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dbItems.map((item) => (
                <DbItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-800 text-gray-300 font-medium hover:bg-zinc-700 transition disabled:opacity-50"
                >
                  {loadingMore && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg font-medium text-gray-400">
              No listings yet
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Be the first to list your EDC gear!
            </p>
            <Link
              href="/items/new"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-full bg-orange-600 text-white font-medium hover:bg-orange-700 transition"
            >
              <Plus className="w-4 h-4" />
              List an Item
            </Link>
          </div>
        )}
      </div>
      </div>

      <Footer />
    </>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense>
      <CategoriesContent />
    </Suspense>
  );
}
