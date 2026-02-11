"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Share2,
  UserPlus,
  UserCheck,
  Loader2,
  Crosshair,
  MessageSquare,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DbItemCard from "@/components/DbItemCard";
import CategoryIcon from "@/components/CategoryIcon";
import { createClient } from "@/lib/supabase-browser";
import type { Profile, Item, EdcLoadout } from "@/lib/types";

export default function PublicProfilePage() {
  const params = useParams();
  const profileId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loadoutItems, setLoadoutItems] = useState<Item[]>([]);
  const [loadout, setLoadout] = useState<EdcLoadout | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      // Redirect to own profile if viewing self
      if (user?.id === profileId) {
        window.location.href = "/profile";
        return;
      }

      // Fetch target profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch items
      const { data: itemsData } = await supabase
        .from("items")
        .select("*, profiles(*), categories(*), item_images(*)")
        .eq("user_id", profileId)
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (itemsData) {
        setItems(itemsData as Item[]);
        setItemCount(itemsData.length);
      }

      // Fetch follower count
      const { count } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profileId);
      setFollowerCount(count || 0);

      // Check if current user follows this profile
      if (user) {
        const { data: followData } = await supabase
          .from("followers")
          .select("id")
          .eq("follower_id", user.id)
          .eq("following_id", profileId)
          .single();
        setIsFollowing(!!followData);
      }

      // Fetch primary EDC loadout
      const { data: loadoutData } = await supabase
        .from("edc_loadouts")
        .select("*")
        .eq("user_id", profileId)
        .eq("is_primary", true)
        .single();

      if (loadoutData) {
        setLoadout(loadoutData as EdcLoadout);
        const { data: loadoutItemsData } = await supabase
          .from("edc_loadout_items")
          .select("*, items(*, categories(*), item_images(*))")
          .eq("loadout_id", loadoutData.id)
          .order("position");
        if (loadoutItemsData) {
          setLoadoutItems(
            loadoutItemsData
              .map((li: Record<string, unknown>) => li.items as Item)
              .filter(Boolean)
          );
        }
      }

      setLoading(false);
    };

    load();
  }, [profileId]);

  const handleFollow = async () => {
    if (!currentUserId) {
      window.location.href = "/login";
      return;
    }
    setFollowLoading(true);
    const supabase = createClient();

    if (isFollowing) {
      await supabase
        .from("followers")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", profileId);
      setIsFollowing(false);
      setFollowerCount((c) => c - 1);
    } else {
      await supabase
        .from("followers")
        .insert({ follower_id: currentUserId, following_id: profileId });
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
    }
    setFollowLoading(false);
  };

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

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
          <p className="text-gray-500 mt-2">
            This profile doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-flex mt-4 text-orange-600 hover:underline"
          >
            &larr; Back to home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Profile header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.username || ""}
                width={96}
                height={96}
                className="rounded-2xl shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-3xl font-bold shadow-lg">
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
                <span>{itemCount} items</span>
                <span>
                  <strong className="text-white">{followerCount}</strong>{" "}
                  followers
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1.5 ${
                  isFollowing
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" /> Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Follow
                  </>
                )}
              </button>
              <Link
                href={`/messages?to=${profileId}`}
                className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> Message
              </Link>
              <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDC Loadout */}
      {loadout && loadoutItems.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Crosshair className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-lg">{loadout.name}</h3>
            </div>
            {loadout.description && (
              <p className="text-gray-600 text-sm mb-4">
                {loadout.description}
              </p>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {loadoutItems.map((item) => {
                const firstImage = item.item_images?.[0]?.url;
                const categorySlug = item.categories?.slug || "";
                return (
                  <Link
                    key={item.id}
                    href={`/item/${item.id}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={item.name}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CategoryIcon slug={categorySlug} size="md" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 font-medium mt-1.5 text-center line-clamp-1">
                      {item.name}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <h3 className="font-bold text-lg mb-4">
          Collection ({items.length} items)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <DbItemCard key={item.id} item={item} />
          ))}
        </div>
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-medium">No items yet</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
