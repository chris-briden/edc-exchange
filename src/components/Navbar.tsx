"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  Plus,
  Bell,
  MessageSquare,
  LogIn,
  LogOut,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data) setProfile(data as Profile);
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/categories?search=${encodeURIComponent(q)}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-zinc-800 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo - New Icon + Text System */}
          <Link href="/marketplace" className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Image
              src="/icon-new-white.png"
              alt="The Carry Exchange"
              width={568}
              height={556}
              className="h-12 w-12 sm:h-16 sm:w-16"
            />
            <span className="text-sm sm:text-lg md:text-xl font-bold tracking-wide text-white hidden sm:inline">
              The Carry Exchange
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xl mx-2 md:mx-4">
            <div
              className={`relative flex items-center rounded-full border transition-all w-full ${
                searchFocused
                  ? "border-orange-500/50 ring-2 ring-orange-500/20"
                  : "border-zinc-700"
              } bg-zinc-900/50`}
            >
              <Search className="absolute left-3 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search knives, flashlights, pens..."
                className="w-full pl-10 pr-3 md:pr-4 py-1.5 md:py-2 bg-transparent text-xs md:text-sm rounded-full focus:outline-none text-white placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </form>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
            <Link
              href="/community"
              className="px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium text-gray-400 hover:text-white hover:bg-zinc-800 transition"
            >
              Community
            </Link>
            <Link
              href="/categories"
              className="px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium text-gray-400 hover:text-white hover:bg-zinc-800 transition"
            >
              Marketplace
            </Link>
            <Link
              href="/blog"
              className="px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium text-gray-400 hover:text-white hover:bg-zinc-800 transition"
            >
              Blog
            </Link>

            {user ? (
              <>
                <Link
                  href="/items/new"
                  className="ml-1 lg:ml-2 flex items-center gap-1 lg:gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-orange-700 text-white text-xs lg:text-sm font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-900/50"
                >
                  <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden lg:inline">List Item</span>
                </Link>
                <div className="flex items-center gap-1 ml-2">
                  <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-800 transition relative">
                    <Bell className="w-5 h-5" />
                  </button>
                  <Link
                    href="/messages"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-800 transition"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Link>

                  {/* User avatar dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="p-1 rounded-lg hover:bg-zinc-800 transition"
                    >
                      {profile?.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt={profile.username || ""}
                          width={32}
                          height={32}
                          className="rounded-full w-8 h-8 object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold">
                          {profile?.username?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-zinc-900 rounded-xl border border-zinc-700 shadow-xl shadow-black/40 py-2 z-50">
                        <div className="px-4 py-2 border-b border-zinc-800">
                          <p className="font-semibold text-sm text-white">
                            {profile?.username || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white transition"
                        >
                          <UserIcon className="w-4 h-4" /> My Profile
                        </Link>
                        <Link
                          href="/profile/edit"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white transition"
                        >
                          <Settings className="w-4 h-4" /> Edit Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1 lg:gap-2 ml-1 lg:ml-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1 lg:gap-1.5 px-2 lg:px-4 py-1.5 lg:py-2 rounded-full border border-zinc-700 text-gray-300 text-xs lg:text-sm font-medium hover:bg-zinc-800 hover:text-white transition"
                >
                  <LogIn className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden lg:inline">Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="hidden md:flex items-center gap-1 lg:gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-orange-700 text-white text-xs lg:text-sm font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-900/50"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-zinc-800"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur px-3 py-2 space-y-0.5">
          <Link
            href="/community"
            className="block px-2 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Community
          </Link>
          <Link
            href="/categories"
            className="block px-2 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Marketplace
          </Link>
          <Link
            href="/blog"
            className="block px-2 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Blog
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                className="block px-2 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:bg-zinc-800 hover:text-white"
              >
                Profile
              </Link>
              <Link
                href="/messages"
                className="block px-2 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:bg-zinc-800 hover:text-white"
              >
                Messages
              </Link>
              <Link
                href="/profile/edit"
                className="block px-2 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:bg-zinc-800 hover:text-white"
              >
                Edit Profile
              </Link>
              <Link
                href="/items/new"
                className="w-full flex items-center justify-center gap-1 mt-1.5 px-3 py-2 rounded-full bg-orange-700 text-white text-xs font-semibold shadow-lg shadow-orange-900/50"
              >
                <Plus className="w-3.5 h-3.5" />
                List Item
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-1 mt-1.5 px-3 py-2 rounded-full border border-red-500/30 text-red-400 text-xs font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-1.5 mt-1.5">
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-full border border-zinc-700 text-gray-300 text-xs font-medium"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-orange-700 text-white text-xs font-semibold shadow-lg shadow-orange-900/50"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
