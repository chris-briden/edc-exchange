"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import ItemCard from "@/components/ItemCard";
import { categories, edcItems } from "@/lib/data";

const listingFilters = ["All Types", "For Sale", "For Trade", "For Lend", "For Rent"];
const listingMap: Record<string, string | null> = {
  "All Types": null,
  "For Sale": "sell",
  "For Trade": "trade",
  "For Lend": "lend",
  "For Rent": "rent",
};

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [listingFilter, setListingFilter] = useState("All Types");

  let filtered = edcItems;
  if (selectedCategory) {
    filtered = filtered.filter((i) => i.category === selectedCategory);
  }
  if (listingMap[listingFilter]) {
    filtered = filtered.filter(
      (i) => i.listingType === listingMap[listingFilter]
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-extrabold mb-2">Browse Marketplace</h1>
        <p className="text-gray-500 mb-6">
          Find your next EDC grail. Buy, sell, trade, lend, or rent.
        </p>

        {/* Category cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.id ? null : cat.id
                )
              }
              className={`text-left rounded-xl p-4 border-2 transition ${
                selectedCategory === cat.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <p className="font-semibold text-sm mt-1">{cat.name}</p>
              <p className="text-xs text-gray-400">
                {cat.count.toLocaleString()} listings
              </p>
            </button>
          ))}
        </div>

        {/* Listing type filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
          {listingFilters.map((f) => (
            <button
              key={f}
              onClick={() => setListingFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                listingFilter === f
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No items match your filters</p>
            <p className="text-sm mt-1">Try adjusting your category or listing type.</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
