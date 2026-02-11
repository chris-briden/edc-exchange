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

            {user ? (
              <>
                <Link
                  href="/items/new"
                  className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  List Item
                </Link>
                <div className="flex items-center gap-1 ml-2">
                  <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition relative">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition">
                    <MessageSquare className="w-5 h-5" />
                  </button>

                  {/* User avatar dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="p-1 rounded-lg hover:bg-gray-100 transition"
                    >
                      {profile?.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt={profile.username || ""}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-bold">
                          {profile?.username?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-semibold text-sm">
                            {profile?.username || "User"}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <UserIcon className="w-4 h-4" /> My Profile
                        </Link>
                        <Link
                          href="/profile/edit"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <Settings className="w-4 h-4" /> Edit Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
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
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          <Link
            href="/community"
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Community
          </Link>
          <Link
            href="/categories"
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Browse
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                href="/profile/edit"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Edit Profile
              </Link>
              <Link
                href="/items/new"
                className="w-full flex items-center justify-center gap-1.5 mt-2 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                List Item
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-1.5 mt-2 px-4 py-2 rounded-full border border-red-300 text-red-600 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-1.5 mt-2 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
