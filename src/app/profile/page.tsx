"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Settings,
  Share2,
  Plus,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import DbItemCard from "@/components/DbItemCard";
import { users, edcItems } from "@/lib/data";
import { createClient } from "@/lib/supabase-browser";
import type { Profile, Item } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setIsOwnProfile(true);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profileData) {
          setProfile(profileData as Profile);
        }

        const { data: itemsData } = await supabase
          .from("items")
          .select("*, profiles(*), categories(*), item_images(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (itemsData) {
          setItems(itemsData as Item[]);
        }
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </>
    );
  }

  // If logged in with profile data — show real profile
  if (profile) {
    return (
      <>
        <Navbar />

        {/* Profile header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.username || ""}
                  width={96}
                  height={96}
                  className="rounded-2xl shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-3xl font-bold shadow-lg">
                  {profile.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-extrabold">
                  {profile.username || "User"}
                </h1>
                {profile.full_name && (
                  <p className="text-gray-400 text-sm">{profile.full_name}</p>
                )}
                {profile.bio && (
                  <p className="text-gray-300 mt-2 max-w-md">{profile.bio}</p>
                )}
                <div className="flex items-center gap-5 mt-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span>{items.length} items</span>
                </div>
              </div>
              {isOwnProfile && (
                <div className="flex gap-2">
                  <Link
                    href="/profile/edit"
                    className="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition flex items-center gap-1.5"
                  >
                    <Settings className="w-4 h-4" /> Edit Profile
                  </Link>
                  <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collection */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">
              My Collection ({items.length} items)
            </h3>
            <Link
              href="/items/new"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
            >
              <Plus className="w-4 h-4" /> List Item
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <DbItemCard key={item.id} item={item} />
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-medium">No items yet</p>
              <p className="text-sm mt-1">Start building your collection!</p>
              <Link
                href="/items/new"
                className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
              >
                <Plus className="w-4 h-4" /> List Your First Item
              </Link>
            </div>
          )}
        </div>

        <Footer />
      </>
    );
  }

  // Fallback: show mock profile (not logged in)
  const user = users[2]; // TitaniumTom as demo
  const userItems = edcItems.filter((i) => i.owner.id === user.id);

  return (
    <>
      <Navbar />

      {/* Profile header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-3xl font-bold shadow-lg">
              {user.username.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold">{user.username}</h1>
                {user.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-2.5 py-0.5 rounded-full bg-white/15 text-white/80 text-xs font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 mt-2 max-w-md">{user.bio}</p>
              <div className="flex items-center gap-5 mt-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {user.joinDate}
                </span>
                <span>{user.itemCount} items</span>
                <span>
                  <strong className="text-white">
                    {user.followers.toLocaleString()}
                  </strong>{" "}
                  followers
                </span>
                <span>
                  <strong className="text-white">{user.following}</strong>{" "}
                  following
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/login"
                className="px-5 py-2 rounded-full bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition"
              >
                Sign in to follow
              </Link>
              <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collection */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {["Collection", "For Sale / Trade", "Reviews", "Activity"].map(
            (tab, i) => (
              <button
                key={tab}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  i === 0
                    ? "border-orange-600 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 mb-8 border border-orange-100">
          <h3 className="font-bold text-lg mb-1">
            Today&apos;s Carry &mdash; Titanium Tuesday
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            CRK Sebenza 31, Emisar D4V2 Ti, Tactile Turn Short, Ridge Wallet Ti
          </p>
          <div className="flex gap-3 flex-wrap">
            {[
              "CRK Sebenza 31",
              "Emisar D4V2 Ti",
              "Tactile Turn Short",
              "Ridge Wallet Ti",
            ].map((item) => (
              <div
                key={item}
                className="w-20 h-20 rounded-xl bg-white border border-orange-200 flex items-center justify-center text-xs text-gray-500 font-medium text-center p-2"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <h3 className="font-bold text-lg mb-4">
          Collection ({userItems.length} items)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {userItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        {userItems.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-medium">No items yet</p>
            <p className="text-sm mt-1">Start building your collection!</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
