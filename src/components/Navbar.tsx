"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  Plus,
  Bell,
  User,
  MessageSquare,
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">EDC</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">
              EDC <span className="text-orange-600">Exchange</span>
            </span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div
              className={`relative flex items-center rounded-full border transition-all ${
                searchFocused
                  ? "border-orange-400 ring-2 ring-orange-100"
                  : "border-gray-300"
              } bg-gray-50`}
            >
              <Search className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search knives, flashlights, pens..."
                className="w-full pl-10 pr-4 py-2 bg-transparent text-sm rounded-full focus:outline-none"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/community"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
            >
              Community
            </Link>
            <Link
              href="/categories"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
            >
              Browse
            </Link>
            <button className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition">
              <Plus className="w-4 h-4" />
              List Item
            </button>
            <div className="flex items-center gap-1 ml-2">
              <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition">
                <MessageSquare className="w-5 h-5" />
              </button>
              <Link
                href="/profile"
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          <Link href="/community" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
            Community
          </Link>
          <Link href="/categories" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
            Browse
          </Link>
          <Link href="/profile" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
            Profile
          </Link>
          <button className="w-full flex items-center justify-center gap-1.5 mt-2 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium">
            <Plus className="w-4 h-4" />
            List Item
          </button>
        </div>
      )}
    </nav>
  );
}
