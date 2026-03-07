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
  ChevronDown,
  Backpack,
  Plane,
  Dumbbell,
  Pocket,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";

const NAV_PILLARS = [
  {
    label: "EDC",
    href: "/edc",
    icon: Pocket,
    color: "text-orange-400",
    subs: [
      { label: "Knives & Blades", href: "/edc/knives" },
      { label: "Flashlights", href: "/edc/flashlights" },
      { label: "Multi-Tools", href: "/edc/multi-tools" },
      { label: "Pens & Writing", href: "/edc/pens" },
      { label: "Wallets & Organizers", href: "/edc/wallets" },
    ],
  },
  {
    label: "Bags & Packs",
    href: "/bags",
    icon: Backpack,
    color: "text-amber-400",
    subs: [
      { label: "Backpacks", href: "/bags/backpacks" },
      { label: "Sling Bags", href: "/bags/slings" },
      { label: "Messenger & Briefcases", href: "/bags/messengers" },
      { label: "Duffels", href: "/bags/duffels" },
      { label: "Pouches & Organizers", href: "/bags/pouches" },
    ],
  },
  {
    label: "Travel",
    href: "/travel",
    icon: Plane,
    color: "text-sky-400",
    subs: [
      { label: "Carry-On Luggage", href: "/travel/carry-on" },
      { label: "Packing Systems", href: "/travel/packing" },
      { label: "Tech Travel Kits", href: "/travel/tech-kits" },
      { label: "Airline Guides", href: "/travel/airline-guides" },
    ],
  },
  {
    label: "Ruck & Fitness",
    href: "/ruck",
    icon: Dumbbell,
    color: "text-green-400",
    subs: [
      { label: "Rucksacks & Packs", href: "/ruck/rucksacks" },
      { label: "Weighted Vests & Plates", href: "/ruck/vests" },
      { label: "Training Plans", href: "/ruck/training" },
      { label: "Ruck Club Directory", href: "/ruck/clubs" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
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

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(e.target as Node)
      ) {
        setMegaMenuOpen(null);
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Image
              src="/tcc-icon.png"
              alt="The Carry Collective"
              width={620}
              height={640}
              className="h-10 w-auto sm:h-14"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-sm md:text-base font-black tracking-wide text-white uppercase">
                The Carry
              </span>
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] text-orange-400 uppercase">
                Collective
              </span>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md mx-2 md:mx-4">
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
                placeholder="Search gear, reviews, guides..."
                className="w-full pl-10 pr-3 md:pr-4 py-1.5 md:py-2 bg-transparent text-xs md:text-sm rounded-full focus:outline-none text-white placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </form>

          {/* Desktop nav — pillars + actions */}
          <div className="hidden lg:flex items-center gap-0.5" ref={megaMenuRef}>
            {NAV_PILLARS.map((pillar) => (
              <div key={pillar.label} className="relative">
                <button
                  onClick={() =>
                    setMegaMenuOpen(megaMenuOpen === pillar.label ? null : pillar.label)
                  }
                  className={`flex items-center gap-1 px-2 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition ${
                    megaMenuOpen === pillar.label
                      ? `${pillar.color} bg-zinc-800`
                      : "text-gray-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {pillar.label}
                  <ChevronDown className={`w-3 h-3 transition-transform ${megaMenuOpen === pillar.label ? "rotate-180" : ""}`} />
                </button>

                {megaMenuOpen === pillar.label && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-zinc-900 rounded-xl border border-zinc-700 shadow-xl shadow-black/40 py-2 z-50">
                    <Link
                      href={pillar.href}
                      onClick={() => setMegaMenuOpen(null)}
                      className={`block px-4 py-2 text-sm font-semibold ${pillar.color} hover:bg-zinc-800 transition`}
                    >
                      All {pillar.label} →
                    </Link>
                    <div className="border-t border-zinc-800 my-1" />
                    {pillar.subs.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMegaMenuOpen(null)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white transition"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/products"
              className="flex items-center gap-1 px-2 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium text-orange-400 hover:text-orange-300 hover:bg-zinc-800 transition"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Price Check
            </Link>
            <Link
              href="/reviews"
              className="px-2 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium text-gray-400 hover:text-white hover:bg-zinc-800 transition"
            >
              Reviews
            </Link>
            <Link
              href="/categories"
              className="px-2 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium text-gray-400 hover:text-white hover:bg-zinc-800 transition"
            >
              Marketplace
            </Link>

            {user ? (
              <>
                <Link
                  href="/items/new"
                  className="ml-1 flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-700 text-white text-xs font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-900/50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">List Item</span>
                </Link>
                <div className="flex items-center gap-1 ml-1">
                  <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-800 transition relative">
                    <Bell className="w-4 h-4" />
                  </button>
                  <Link
                    href="/messages"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-800 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
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
              <div className="flex items-center gap-1 ml-1">
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-zinc-700 text-gray-300 text-xs font-medium hover:bg-zinc-800 hover:text-white transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-700 text-white text-xs font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-900/50"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Tablet nav (md but not lg) */}
          <div className="hidden md:flex lg:hidden items-center gap-1">
            <Link href="/products" className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-orange-400 hover:text-orange-300 hover:bg-zinc-800 transition"><TrendingUp className="w-3.5 h-3.5" />Price Check</Link>
            <Link href="/reviews" className="px-2 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-zinc-800 transition">Reviews</Link>
            <Link href="/categories" className="px-2 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-zinc-800 transition">Marketplace</Link>
            {!user && (
              <Link href="/signup" className="ml-1 px-3 py-1.5 rounded-full bg-orange-700 text-white text-xs font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-900/50">Join</Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-zinc-800"
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
        <div className="lg:hidden border-t border-zinc-800 bg-black/95 backdrop-blur px-3 py-3 space-y-1">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="sm:hidden mb-3">
            <div className="relative flex items-center rounded-full border border-zinc-700 bg-zinc-900/50">
              <Search className="absolute left-3 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search gear, reviews, guides..."
                className="w-full pl-10 pr-4 py-2 bg-transparent text-sm rounded-full focus:outline-none text-white placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Pillar nav */}
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 px-2 mb-1">Explore</div>
          {NAV_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.href}
                href={pillar.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium ${pillar.color} hover:bg-zinc-800 transition`}
              >
                <Icon className="w-4 h-4" />
                {pillar.label}
              </Link>
            );
          })}

          <div className="border-t border-zinc-800 my-2" />

          <Link
            href="/products"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium text-orange-400 hover:bg-zinc-800 hover:text-orange-300"
          >
            <TrendingUp className="w-4 h-4" />
            Price Check
          </Link>
          <Link
            href="/reviews"
            onClick={() => setMobileOpen(false)}
            className="block px-2 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Reviews
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileOpen(false)}
            className="block px-2 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Marketplace
          </Link>
          <Link
            href="/community"
            onClick={() => setMobileOpen(false)}
            className="block px-2 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Community
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileOpen(false)}
            className="block px-2 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            Blog
          </Link>

          {user ? (
            <>
              <div className="border-t border-zinc-800 my-2" />
              <Link href="/profile" onClick={() => setMobileOpen(false)} className="block px-2 py-2 rounded-lg text-sm text-gray-300 hover:bg-zinc-800 hover:text-white">Profile</Link>
              <Link href="/messages" onClick={() => setMobileOpen(false)} className="block px-2 py-2 rounded-lg text-sm text-gray-300 hover:bg-zinc-800 hover:text-white">Messages</Link>
              <Link
                href="/items/new"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-1 mt-2 px-3 py-2.5 rounded-full bg-orange-700 text-white text-sm font-semibold shadow-lg shadow-orange-900/50"
              >
                <Plus className="w-4 h-4" />
                List Item
              </Link>
              <button
                onClick={() => { handleSignOut(); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-1 mt-1.5 px-3 py-2 rounded-full border border-red-500/30 text-red-400 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-1.5 mt-2 pt-2 border-t border-zinc-800">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-1 px-3 py-2.5 rounded-full border border-zinc-700 text-gray-300 text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-1 px-3 py-2.5 rounded-full bg-orange-700 text-white text-sm font-semibold shadow-lg shadow-orange-900/50"
              >
                Join The Collective
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
