"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Settings,
  Share2,
  Plus,
  Loader2,
  PenLine,
  Crosshair,
  MapPin,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DbItemCard from "@/components/DbItemCard";
import CategoryIcon from "@/components/CategoryIcon";
import CommunityPostCard from "@/components/CommunityPostCard";
import ConnectStripeButton from "@/components/ConnectStripeButton";
import { createClient } from "@/lib/supabase-browser";
import type { Profile, Item, EdcLoadout, Post, Category } from "@/lib/types";

const tabs = ["Listings", "Collection", "Community"] as const;
type Tab = (typeof tabs)[number];

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [showcaseItems, setShowcaseItems] = useState<Item[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadout, setLoadout] = useState<EdcLoadout | null>(null);
  const [edcItemIds, setEdcItemIds] = useState<string[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("Listings");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/login?redirect=/profile");
        return;
      }
      setUserId(user.id);

      const [profileRes, listingsRes, showcaseRes, postsRes, followerRes, followingRes, loadoutRes, categoriesRes] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase
            .from("items")
            .select("*, profiles(*), categories(*), item_images(*), likes(count), comments(count)")
            .eq("user_id", user.id)
            .neq("listing_type", "showcase")
            .order("created_at", { ascending: false }),
          supabase
            .from("items")
            .select("*, profiles(*), categories(*), item_images(*), likes(count), comments(count)")
            .eq("user_id", user.id)
            .eq("listing_type", "showcase")
            .order("created_at", { ascending: false }),
          supabase
            .from("posts")
            .select("*, profiles(*), post_images(*), likes(count), comments(count)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("followers")
            .select("*", { count: "exact", head: true })
            .eq("following_id", user.id),
          supabase
            .from("followers")
            .select("*", { count: "exact", head: true })
            .eq("follower_id", user.id),
          supabase
            .from("edc_loadouts")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_primary", true)
            .single(),
          supabase.from("categories").select("*").order("name"),
        ]);

      if (profileRes.data) setProfile(profileRes.data as Profile);
      if (listingsRes.data) setItems(listingsRes.data as Item[]);
      if (showcaseRes.data) setShowcaseItems(showcaseRes.data as Item[]);
      if (postsRes.data) setPosts(postsRes.data as Post[]);
      setFollowerCount(followerRes.count || 0);
      setFollowingCount(followingRes.count || 0);
      if (categoriesRes.data) setCategories(categoriesRes.data as Category[]);

      if (loadoutRes.data) {
        setLoadout(loadoutRes.data as EdcLoadout);
        const { data: loadoutItemsData } = await supabase
          .from("edc_loadout_items")
          .select("item_id")
          .eq("loadout_id", loadoutRes.data.id)
          .order("position");
        if (loadoutItemsData) {
          setEdcItemIds(loadoutItemsData.map((li: { item_id: string }) => li.item_id));
        }
      }

      setLoading(false);

      // Handle Stripe callback query params
      const urlParams = new URLSearchParams(window.location.search);
      const stripeStatus = urlParams.get("stripe");
      if (stripeStatus === "connected") {
        toast.success("Stripe account connected successfully! You can now receive payments.");
        window.history.replaceState({}, "", "/profile");
      } else if (stripeStatus === "pending") {
        toast.info("Stripe onboarding started. Please complete the setup to receive payments.");
        window.history.replaceState({}, "", "/profile");
      } else if (stripeStatus === "error") {
        toast.error("There was an issue connecting your Stripe account. Please try again.");
        window.history.replaceState({}, "", "/profile");
      }

      const paymentStatus = urlParams.get("payment");
      if (paymentStatus === "success") {
        toast.success("Payment completed successfully!");
        window.history.replaceState({}, "", "/profile");
      } else if (paymentStatus === "rental_success") {
        toast.success("Rental confirmed! The lender has been notified.");
        window.history.replaceState({}, "", "/profile");
      }
    });
  }, [router]);

  // Derive EDC items and collection-only items from showcaseItems + edcItemIds
  const edcItems = showcaseItems.filter((item) => edcItemIds.includes(item.id));
  const collectionOnly = showcaseItems.filter((item) => !edcItemIds.includes(item.id));
  const filteredCollection = selectedCategory
    ? collectionOnly.filter((item) => item.category_id === selectedCategory)
    : collectionOnly;

  const handleAddToEdc = useCallback(
    async (itemId: string) => {
      // Optimistic update
      setEdcItemIds((prev) => [...prev, itemId]);

      try {
        const supabase = createClient();
        let loadoutId = loadout?.id;

        if (!loadoutId) {
          // Auto-create loadout
          const { data: newLoadout, error: createErr } = await supabase
            .from("edc_loadouts")
            .insert({
              user_id: userId!,
              name: "My Daily Carry",
              is_primary: true,
            })
            .select()
            .single();
          if (createErr) throw createErr;
          setLoadout(newLoadout as EdcLoadout);
          loadoutId = newLoadout.id;
        }

        // Get next position
        const { data: existingItems } = await supabase
          .from("edc_loadout_items")
          .select("position")
          .eq("loadout_id", loadoutId)
          .order("position", { ascending: false })
          .limit(1);

        const nextPosition = (existingItems?.[0]?.position ?? -1) + 1;

        const { error: insertErr } = await supabase
          .from("edc_loadout_items")
          .insert({
            loadout_id: loadoutId,
            item_id: itemId,
            position: nextPosition,
          });
        if (insertErr) throw insertErr;

        toast.success("Added to Daily Carry!");
      } catch {
        // Revert on error
        setEdcItemIds((prev) => prev.filter((id) => id !== itemId));
        toast.error("Failed to add to Daily Carry");
      }
    },
    [loadout, userId]
  );

  const handleRemoveFromEdc = useCallback(
    async (itemId: string) => {
      if (!loadout?.id) return;

      // Optimistic update
      setEdcItemIds((prev) => prev.filter((id) => id !== itemId));

      try {
        const supabase = createClient();
        const { error: deleteErr } = await supabase
          .from("edc_loadout_items")
          .delete()
          .eq("loadout_id", loadout.id)
          .eq("item_id", itemId);
        if (deleteErr) throw deleteErr;

        toast.success("Removed from Daily Carry");
      } catch {
        // Revert on error
        setEdcItemIds((prev) => [...prev, itemId]);
        toast.error("Failed to remove from Daily Carry");
      }
    },
    [loadout]
  );

  const handleShare = async () => {
    const url = profile?.username
      ? `${window.location.origin}/u/${profile.username}`
      : window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${profile?.username}'s Profile`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Profile link copied!");
      }
    } catch {
      // cancelled
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] bg-black">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h1 className="text-2xl font-bold">Profile not found</h1>
            <p className="text-gray-400 mt-2">Please log in to view your profile.</p>
            <Link
              href="/login"
              className="inline-flex mt-4 px-6 py-2.5 rounded-full bg-orange-700 text-white font-semibold hover:bg-orange-600 shadow-lg shadow-orange-900/50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const allItems = [...items, ...showcaseItems];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white">
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
                className="rounded-full w-24 h-24 object-cover shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-3xl font-bold shadow-lg">
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
              <div className="flex items-center gap-5 mt-4 text-sm text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined{" "}
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </span>
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </span>
                )}
                <span>{allItems.length} items</span>
                <span>
                  <strong className="text-white">{followerCount}</strong>{" "}
                  followers
                </span>
                <span>
                  <strong className="text-white">{followingCount}</strong>{" "}
                  following
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/profile/edit"
                className="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition flex items-center gap-1.5"
              >
                <Settings className="w-4 h-4" /> Edit Profile
              </Link>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Stripe Connect Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
          <ConnectStripeButton />
        </div>

        {/* My EDC Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/50 transition">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-lg">
                {loadout?.name || "My Daily Carry"}
              </h3>
              {edcItems.length > 0 && (
                <span className="text-xs text-gray-400 ml-1">
                  ({edcItems.length})
                </span>
              )}
            </div>
            <Link
              href="/profile/my-edc"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-sm font-medium text-gray-300 hover:bg-zinc-700 transition"
            >
              <PenLine className="w-3.5 h-3.5" />
              {loadout ? "Edit" : "Set Up"}
            </Link>
          </div>

          {edcItems.length > 0 ? (
            <>
              {loadout?.description && (
                <p className="text-gray-400 text-sm mb-4">
                  {loadout.description}
                </p>
              )}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {edcItems.map((item) => {
                  const firstImage = item.item_images?.[0]?.url;
                  const categorySlug = item.categories?.slug || "";
                  return (
                    <div key={item.id} className="group relative">
                      <Link href={`/item/${item.id}`}>
                        <div className="aspect-square rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all">
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
                      </Link>
                      <p className="text-xs text-gray-400 font-medium mt-1.5 text-center line-clamp-1">
                        {item.name}
                      </p>
                      {/* Remove from EDC button on hover */}
                      <button
                        onClick={() => handleRemoveFromEdc(item.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-md"
                        title="Remove from Daily Carry"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <Crosshair className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-medium">No EDC set up yet</p>
              <p className="text-xs mt-1">
                Showcase the items you carry every day
              </p>
              <Link
                href="/profile/my-edc"
                className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
              >
                <Plus className="w-4 h-4" /> Set Up My EDC
              </Link>
            </div>
          )}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 border-b border-zinc-800 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab
                  ? "border-orange-500 text-orange-400"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab}
              <span className="ml-1.5 text-xs text-gray-400">
                {tab === "Listings"
                  ? items.length
                  : tab === "Collection"
                    ? showcaseItems.length
                    : posts.length}
              </span>
            </button>
          ))}
        </div>
        </div>

        {/* Tab content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        {activeTab === "Listings" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">
                Active Listings ({items.length})
              </h3>
              <Link
                href="/items/new"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
              >
                <Plus className="w-4 h-4" /> List Item
              </Link>
            </div>
            {items.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                  <DbItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg font-medium">No active listings</p>
                <p className="text-sm mt-1">List an item for sale, trade, or rent!</p>
                <Link
                  href="/items/new"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
                >
                  <Plus className="w-4 h-4" /> List Your First Item
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === "Collection" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">
                Collection ({collectionOnly.length})
              </h3>
              <Link
                href="/items/new"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
              >
                <Plus className="w-4 h-4" /> Add to Collection
              </Link>
            </div>

            {/* Category filter pills */}
            {collectionOnly.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                    selectedCategory === null
                      ? "bg-orange-600 text-white"
                      : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                  }`}
                >
                  All
                </button>
                {categories
                  .filter((cat) =>
                    collectionOnly.some((item) => item.category_id === cat.id)
                  )
                  .map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                        selectedCategory === cat.id
                          ? "bg-orange-600 text-white"
                          : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
              </div>
            )}

            {filteredCollection.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCollection.map((item) => {
                  const firstImage = item.item_images?.[0]?.url;
                  const categorySlug = item.categories?.slug || "";
                  const ownerUsername = item.profiles?.username || "Unknown";
                  const ownerAvatar = item.profiles?.avatar_url;
                  return (
                    <div key={item.id} className="group relative">
                      <Link
                        href={`/item/${item.id}`}
                        className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 block hover:border-orange-500/50"
                      >
                        <div className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 relative overflow-hidden">
                          {firstImage ? (
                            <Image
                              src={firstImage}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <CategoryIcon slug={categorySlug} size="xl" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 bg-zinc-700 text-gray-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                            Showcase
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-sm group-hover:text-orange-400 transition line-clamp-1 text-white">
                            {item.name}
                          </h3>
                          <p className="text-gray-400 text-xs mt-1">
                            {item.brand} &middot; {item.condition}
                          </p>
                          <div className="flex items-center mt-3 pt-3 border-t border-zinc-800">
                            <div className="flex items-center gap-1">
                              {ownerAvatar ? (
                                <Image
                                  src={ownerAvatar}
                                  alt={ownerUsername}
                                  width={20}
                                  height={20}
                                  className="rounded-full w-5 h-5 object-cover"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-amber-600" />
                              )}
                              <span className="text-xs text-gray-400">{ownerUsername}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      {/* Add to Daily Carry overlay */}
                      <button
                        onClick={() => handleAddToEdc(item.id)}
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <div className="flex flex-col items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center shadow-lg">
                            <Plus className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-white drop-shadow-lg">
                            Add to Daily Carry
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : collectionOnly.length > 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg font-medium">No items in this category</p>
                <p className="text-sm mt-1">Try selecting a different filter</p>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg font-medium">
                  {showcaseItems.length > 0
                    ? "All collection items are in your Daily Carry!"
                    : "No showcase items"}
                </p>
                <p className="text-sm mt-1">
                  {showcaseItems.length > 0
                    ? "Remove items from Daily Carry to see them here"
                    : 'Show off your collection — list items as "Showcase"'}
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === "Community" && (
          <>
            <h3 className="font-bold text-lg mb-6">
              Posts ({posts.length})
            </h3>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <CommunityPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg font-medium">No posts yet</p>
                <p className="text-sm mt-1">
                  Share your thoughts with the community!
                </p>
                <Link
                  href="/posts/new"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
                >
                  <Plus className="w-4 h-4" /> Create Post
                </Link>
              </div>
            )}
          </>
        )}
        </div>
      </div>

      <Footer />
    </>
  );
}
