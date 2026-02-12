"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Share2,
  Shield,
  Flag,
  Loader2,
  Pencil,
  Trash2,
  Eye,
  Package,
  Truck,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import CategoryIcon from "@/components/CategoryIcon";
import DbItemCard from "@/components/DbItemCard";
import { BuyNowForm, RentalPaymentForm } from "@/components/StripePaymentForm";
import { createClient } from "@/lib/supabase-browser";
import type { Item } from "@/lib/types";

const listingConfig: Record<
  string,
  { color: string; label: string; bg: string }
> = {
  sell: { color: "text-green-700", label: "For Sale", bg: "bg-green-100" },
  trade: { color: "text-blue-700", label: "For Trade", bg: "bg-blue-100" },
  lend: {
    color: "text-purple-700",
    label: "Available to Lend",
    bg: "bg-purple-100",
  },
  rent: { color: "text-amber-700", label: "For Rent", bg: "bg-amber-100" },
  showcase: { color: "text-gray-700", label: "Showcase", bg: "bg-gray-100" },
};

const boxDocsLabels: Record<string, string> = {
  none: "None",
  box_only: "Box Only",
  box_and_papers: "Box & Papers",
  all_original: "All Original Packaging",
};

export default function ItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [dbItem, setDbItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [similarItems, setSimilarItems] = useState<Item[]>([]);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showRentalForm, setShowRentalForm] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      const { data, error } = await supabase
        .from("items")
        .select(
          "*, profiles(*), categories(*), item_images(*), likes(count), comments(count)"
        )
        .eq("id", id)
        .single();

      if (!data || error) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const item = data as Item;
      setDbItem(item);
      setIsOwner(user?.id === item.user_id);

      // Get like count
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("item_id", id);
      setLikeCount(count || 0);

      // Check if user liked
      if (user) {
        const { data: likeData } = await supabase
          .from("likes")
          .select("id")
          .eq("user_id", user.id)
          .eq("item_id", id)
          .single();
        setLiked(!!likeData);
      }

      // Increment views (once per session per item)
      const viewKey = `viewed_item_${id}`;
      if (!sessionStorage.getItem(viewKey)) {
        sessionStorage.setItem(viewKey, "1");
        supabase.rpc("increment_views", { p_item_id: id }).then(() => {});
      }

      // Fetch similar items (same category, excluding this one)
      if (item.category_id) {
        const { data: similar } = await supabase
          .from("items")
          .select(
            "*, profiles(*), categories(*), item_images(*), likes(count), comments(count)"
          )
          .eq("category_id", item.category_id)
          .eq("status", "active")
          .neq("id", id)
          .order("created_at", { ascending: false })
          .limit(4);
        if (similar) setSimilarItems(similar as Item[]);
      }

      setLoading(false);
    };

    load();
  }, [id]);

  const handleLike = async () => {
    if (!currentUserId) {
      router.push("/login");
      return;
    }
    const supabase = createClient();

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", currentUserId)
        .eq("item_id", id);
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      await supabase
        .from("likes")
        .insert({ user_id: currentUserId, item_id: id });
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: dbItem?.name || "EDC Item",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch {
      // User cancelled share
    }
  };

  const handleAction = () => {
    if (!currentUserId) {
      router.push("/login");
      return;
    }
    if (!dbItem) return;
    router.push(`/messages?to=${dbItem.user_id}&item=${dbItem.id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("items").delete().eq("id", id);
    toast.success("Item deleted");
    router.push("/profile");
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

  if (notFound || !dbItem) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold">Item not found</h1>
          <p className="text-gray-500 mt-2">
            This item may have been removed or doesn&apos;t exist.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 mt-4 text-orange-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Browse listings
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const listing =
    listingConfig[dbItem.listing_type] || listingConfig.showcase;
  const images = dbItem.item_images || [];
  const categorySlug = dbItem.categories?.slug || "";
  const ownerUsername = dbItem.profiles?.username || "Unknown";
  const ownerAvatar = dbItem.profiles?.avatar_url;
  const viewsCount = dbItem.views_count || 0;

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden relative">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImage]?.url || images[0].url}
                  alt={dbItem.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <CategoryIcon slug={categorySlug} size="xl" />
                    </div>
                    <p className="text-gray-400 text-sm">No images</p>
                  </div>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === i
                        ? "border-orange-500"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${dbItem.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${listing.bg} ${listing.color}`}
              >
                {listing.label}
              </span>
              {isOwner && (
                <div className="flex gap-1">
                  <Link
                    href={`/items/${id}/edit`}
                    className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition"
                    title="Edit listing"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-3">
              {dbItem.name}
            </h1>
            <p className="text-gray-500 mt-1">
              {dbItem.brand} &middot; Condition: {dbItem.condition}
            </p>

            {dbItem.price && (
              <p className="text-3xl font-extrabold text-green-700 mt-4">
                ${Number(dbItem.price).toFixed(0)}
              </p>
            )}
            {dbItem.rent_price && (
              <p className="text-3xl font-extrabold text-amber-700 mt-4">
                {dbItem.rent_price}
                {dbItem.rental_period && (
                  <span className="text-base font-medium text-gray-500">
                    {" "}
                    / {dbItem.rental_period}
                  </span>
                )}
              </p>
            )}
            {!dbItem.price && !dbItem.rent_price && (
              <p className="text-xl font-bold text-blue-600 mt-4">
                Open to trade offers
              </p>
            )}

            {/* Item details badges */}
            <div className="flex flex-wrap gap-3 mt-4">
              {dbItem.box_and_docs && dbItem.box_and_docs !== "none" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">
                  <Package className="w-3.5 h-3.5" />
                  {boxDocsLabels[dbItem.box_and_docs] || dbItem.box_and_docs}
                </span>
              )}
              {(dbItem.listing_type === "sell" || dbItem.listing_type === "rent") && (
                <>
                  {dbItem.shipping_cost ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">
                      <Truck className="w-3.5 h-3.5" />
                      Shipping: ${Number(dbItem.shipping_cost).toFixed(0)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                      <Truck className="w-3.5 h-3.5" />
                      Free Shipping
                    </span>
                  )}
                  {dbItem.accepts_returns && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                      <RotateCcw className="w-3.5 h-3.5" />
                      Returns Accepted
                    </span>
                  )}
                </>
              )}
              {dbItem.rental_deposit && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium">
                  <Shield className="w-3.5 h-3.5" />
                  ${Number(dbItem.rental_deposit).toFixed(0)} deposit
                </span>
              )}
            </div>

            <p className="text-gray-600 mt-4 leading-relaxed">
              {dbItem.description}
            </p>

            {dbItem.tags && dbItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {dbItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            {!isOwner && (
              <div className="flex flex-wrap gap-3 mt-6">
                {dbItem.listing_type === "sell" && dbItem.price && (
                  <button
                    onClick={() => {
                      if (!currentUserId) {
                        router.push("/login");
                        return;
                      }
                      setShowBuyForm(true);
                    }}
                    className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                  >
                    Buy Now &mdash; ${Number(dbItem.price).toFixed(0)}
                  </button>
                )}
                {dbItem.listing_type === "trade" && (
                  <button
                    onClick={handleAction}
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    Make Trade Offer
                  </button>
                )}
                {dbItem.listing_type === "lend" && (
                  <button
                    onClick={handleAction}
                    className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                  >
                    Request to Borrow
                  </button>
                )}
                {dbItem.listing_type === "rent" && (
                  <button
                    onClick={() => {
                      if (!currentUserId) {
                        router.push("/login");
                        return;
                      }
                      setShowRentalForm(true);
                    }}
                    className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition"
                  >
                    Rent &mdash; {dbItem.rent_price}
                    {dbItem.rental_period && (
                      <span className="text-amber-200 text-sm font-normal">
                        {" "}/ {dbItem.rental_period}
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={handleAction}
                  className="py-3 px-4 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                >
                  Message Seller
                </button>
              </div>
            )}

            {/* Engagement + stats */}
            <div className="flex items-center gap-5 mt-6 pt-5 border-t border-gray-200 text-gray-500 text-sm">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 transition ${
                  liked ? "text-red-500" : "hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
                />
                {likeCount} {likeCount === 1 ? "like" : "likes"}
              </button>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {viewsCount} {viewsCount === 1 ? "view" : "views"}
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-green-500 transition ml-auto"
              >
                <Share2 className="w-5 h-5" /> Share
              </button>
              <button className="flex items-center gap-1.5 hover:text-red-400 transition">
                <Flag className="w-4 h-4" />
              </button>
            </div>

            {/* Seller info */}
            <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-3">
                <Link href={`/profile/${dbItem.user_id}`}>
                  {ownerAvatar ? (
                    <Image
                      src={ownerAvatar}
                      alt={ownerUsername}
                      width={48}
                      height={48}
                      className="rounded-full w-12 h-12 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {ownerUsername.charAt(0)}
                    </div>
                  )}
                </Link>
                <div className="flex-1">
                  <Link
                    href={`/profile/${dbItem.user_id}`}
                    className="font-semibold hover:text-orange-600 transition"
                  >
                    {ownerUsername}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-green-500" />{" "}
                      Member
                    </span>
                    {dbItem.ships_from_country && (
                      <span>Ships from {dbItem.ships_from_country}</span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/profile/${dbItem.user_id}`}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection itemId={id} />

        {/* Similar Items */}
        {similarItems.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold mb-4">Similar Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarItems.map((item) => (
                <DbItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Payment modals */}
      {showBuyForm && dbItem.price && (
        <BuyNowForm
          listingId={dbItem.id}
          itemName={dbItem.name}
          price={Number(dbItem.price)}
          onClose={() => setShowBuyForm(false)}
        />
      )}

      {showRentalForm && dbItem.rent_price && (
        <RentalPaymentForm
          listingId={dbItem.id}
          itemName={dbItem.name}
          rentPrice={dbItem.rent_price}
          rentalPeriod={dbItem.rental_period}
          depositAmount={dbItem.rental_deposit}
          onClose={() => setShowRentalForm(false)}
        />
      )}
    </>
  );
}
