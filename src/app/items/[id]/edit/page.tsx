"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImagePlus, X, Loader2, Crosshair } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase-browser";
import type { Category, Item } from "@/lib/types";

const conditions = [
  "Brand New In Box",
  "Like New",
  "Excellent",
  "Good",
  "Fair",
  "For Parts",
];
const listingTypes = [
  { value: "sell", label: "For Sale" },
  { value: "trade", label: "For Trade" },
  { value: "lend", label: "For Lend" },
  { value: "rent", label: "For Rent" },
  { value: "showcase", label: "Showcase" },
];
const boxDocsOptions = [
  { value: "none", label: "None" },
  { value: "box_only", label: "Box Only" },
  { value: "box_and_papers", label: "Box & Papers" },
  { value: "all_original", label: "All Original" },
];
const rentalPeriodOptions = [
  { value: "daily", label: "Per Day" },
  { value: "weekly", label: "Per Week" },
  { value: "monthly", label: "Per Month" },
];

type ExistingImage = { id: string; url: string; position: number };

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("Good");
  const [listingType, setListingType] = useState("sell");
  const [price, setPrice] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [rentalDeposit, setRentalDeposit] = useState("");
  const [rentalPeriod, setRentalPeriod] = useState("daily");
  const [shippingCost, setShippingCost] = useState("");
  const [freeShipping, setFreeShipping] = useState(false);
  const [shipsFrom, setShipsFrom] = useState("US");
  const [acceptsReturns, setAcceptsReturns] = useState(false);
  const [boxAndDocs, setBoxAndDocs] = useState("none");
  const [tags, setTags] = useState("");
  const [addToEdc, setAddToEdc] = useState(false);
  const [wasInEdc, setWasInEdc] = useState(false);

  // Images
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const [catRes, itemRes] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase
          .from("items")
          .select("*, item_images(*)")
          .eq("id", itemId)
          .single(),
      ]);

      if (catRes.data) setCategories(catRes.data as Category[]);

      if (!itemRes.data || itemRes.error) {
        toast.error("Item not found");
        router.push("/categories");
        return;
      }

      const item = itemRes.data as Item;

      // Verify ownership
      if (item.user_id !== user.id) {
        toast.error("You can only edit your own listings");
        router.push(`/item/${itemId}`);
        return;
      }

      // Populate form
      setName(item.name);
      setBrand(item.brand || "");
      setCategoryId(item.category_id);
      setDescription(item.description || "");
      setCondition(item.condition || "Good");
      setListingType(item.listing_type);
      setPrice(item.price ? String(item.price) : "");
      setRentPrice(item.rent_price || "");
      setRentalDeposit(item.rental_deposit ? String(item.rental_deposit) : "");
      setRentalPeriod(item.rental_period || "daily");
      setShippingCost(item.shipping_cost ? String(item.shipping_cost) : "");
      setFreeShipping(!item.shipping_cost && (item.listing_type === "sell" || item.listing_type === "rent"));
      setShipsFrom(item.ships_from_country || "US");
      setAcceptsReturns(item.accepts_returns || false);
      setBoxAndDocs(item.box_and_docs || "none");
      setTags(item.tags ? item.tags.join(", ") : "");

      const imgs = (item.item_images || []) as ExistingImage[];
      imgs.sort((a, b) => a.position - b.position);
      setExistingImages(imgs);

      // Check if this item is in the user's EDC loadout
      if (item.listing_type === "showcase") {
        const { data: loadoutData } = await supabase
          .from("edc_loadouts")
          .select("id")
          .eq("user_id", user.id)
          .eq("is_primary", true)
          .single();

        if (loadoutData) {
          const { data: loadoutItem } = await supabase
            .from("edc_loadout_items")
            .select("id")
            .eq("loadout_id", loadoutData.id)
            .eq("item_id", itemId)
            .single();

          if (loadoutItem) {
            setAddToEdc(true);
            setWasInEdc(true);
          }
        }
      }

      setLoading(false);
    };

    load();
  }, [itemId, router]);

  const totalImages =
    existingImages.filter((img) => !removedImageIds.includes(img.id)).length +
    newImages.length;

  const handleNewImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 10 - totalImages;
    const added = files.slice(0, remaining);
    setNewImages((prev) => [...prev, ...added]);
    setNewPreviews((prev) => [
      ...prev,
      ...added.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeExistingImage = (id: string) => {
    setRemovedImageIds((prev) => [...prev, id]);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: updateError } = await supabase
        .from("items")
        .update({
          category_id: categoryId,
          name,
          brand: brand || null,
          description: description || null,
          condition,
          listing_type: listingType,
          price: listingType === "sell" && price ? parseFloat(price) : null,
          rent_price: listingType === "rent" && rentPrice ? rentPrice : null,
          rental_deposit:
            listingType === "rent" && rentalDeposit
              ? parseFloat(rentalDeposit)
              : null,
          rental_period: listingType === "rent" ? rentalPeriod : null,
          shipping_cost:
            (listingType === "sell" || listingType === "rent") &&
            !freeShipping &&
            shippingCost
              ? parseFloat(shippingCost)
              : null,
          ships_from_country: shipsFrom || "US",
          accepts_returns: acceptsReturns,
          box_and_docs: boxAndDocs,
          tags: tags
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean),
        })
        .eq("id", itemId);

      if (updateError) throw updateError;

      // Delete removed images
      if (removedImageIds.length > 0) {
        await supabase
          .from("item_images")
          .delete()
          .in("id", removedImageIds);
      }

      // Upload new images
      const keptCount = existingImages.filter(
        (img) => !removedImageIds.includes(img.id)
      ).length;

      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${itemId}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("item-images")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("item-images").getPublicUrl(path);

        const { error: imgError } = await supabase
          .from("item_images")
          .insert({
            item_id: itemId,
            url: publicUrl,
            position: keptCount + i,
          });
        if (imgError) throw imgError;
      }

      // Handle EDC loadout add/remove for showcase items
      if (listingType === "showcase") {
        if (addToEdc && !wasInEdc) {
          // Add to EDC
          let loadoutId: string | null = null;
          const { data: existingLoadout } = await supabase
            .from("edc_loadouts")
            .select("id")
            .eq("user_id", user.id)
            .eq("is_primary", true)
            .single();

          if (existingLoadout) {
            loadoutId = existingLoadout.id;
          } else {
            const { data: newLoadout } = await supabase
              .from("edc_loadouts")
              .insert({
                user_id: user.id,
                name: "My Daily Carry",
                is_primary: true,
              })
              .select()
              .single();
            if (newLoadout) loadoutId = newLoadout.id;
          }

          if (loadoutId) {
            const { data: existingItems } = await supabase
              .from("edc_loadout_items")
              .select("position")
              .eq("loadout_id", loadoutId)
              .order("position", { ascending: false })
              .limit(1);

            const nextPosition = (existingItems?.[0]?.position ?? -1) + 1;

            await supabase.from("edc_loadout_items").insert({
              loadout_id: loadoutId,
              item_id: itemId,
              position: nextPosition,
            });
          }
        } else if (!addToEdc && wasInEdc) {
          // Remove from EDC
          const { data: existingLoadout } = await supabase
            .from("edc_loadouts")
            .select("id")
            .eq("user_id", user.id)
            .eq("is_primary", true)
            .single();

          if (existingLoadout) {
            await supabase
              .from("edc_loadout_items")
              .delete()
              .eq("loadout_id", existingLoadout.id)
              .eq("item_id", itemId);
          }
        }
      } else if (wasInEdc) {
        // If listing type changed away from showcase, remove from EDC
        const { data: existingLoadout } = await supabase
          .from("edc_loadouts")
          .select("id")
          .eq("user_id", user.id)
          .eq("is_primary", true)
          .single();

        if (existingLoadout) {
          await supabase
            .from("edc_loadout_items")
            .delete()
            .eq("loadout_id", existingLoadout.id)
            .eq("item_id", itemId);
        }
      }

      toast.success("Listing updated!");
      router.push(`/item/${itemId}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update listing";
      setError(msg);
      toast.error(msg);
      setSaving(false);
    }
  };

  const showShipping = listingType === "sell" || listingType === "rent";

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </>
    );
  }

  const keptExisting = existingImages.filter(
    (img) => !removedImageIds.includes(img.id)
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href={`/item/${itemId}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to listing
          </Link>

          <h1 className="text-2xl font-extrabold mb-6">Edit Listing</h1>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/50 border border-red-500 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Photos (up to 10)
              </label>
            <div className="flex gap-3 flex-wrap">
              {keptExisting.map((img, i) => (
                <div key={img.id} className="relative w-24 h-24">
                  <Image
                    src={img.url}
                    alt={`Image ${i + 1}`}
                    fill
                    className="rounded-xl object-cover"
                    sizes="96px"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {i === 0 && keptExisting.length > 0 && (
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div key={`new-${i}`} className="relative w-24 h-24">
                  <Image
                    src={src}
                    alt={`New ${i + 1}`}
                    fill
                    className="rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {keptExisting.length === 0 && i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
              {totalImages < 10 && (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-zinc-700 flex items-center justify-center cursor-pointer hover:border-orange-400 transition">
                  <ImagePlus className="w-6 h-6 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewImageAdd}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Item Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g. Benchmade Bugout 535"
                required
              />
            </div>

            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-1">
                Brand
              </label>
              <input
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g. Benchmade"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Category *
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
              <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Condition *</label>
              <div className="flex flex-wrap gap-2">
                {conditions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                      condition === c
                        ? "bg-orange-600 text-white"
                        : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Box & Docs */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Original Box & Documentation
              </label>
              <div className="flex flex-wrap gap-2">
                {boxDocsOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBoxAndDocs(opt.value)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                      boxAndDocs === opt.value
                        ? "bg-orange-600 text-white"
                        : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Listing Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Listing Type *
              </label>
              <div className="flex flex-wrap gap-2">
                {listingTypes.map((lt) => (
                  <button
                    key={lt.value}
                    type="button"
                    onClick={() => setListingType(lt.value)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                      listingType === lt.value
                        ? "bg-orange-600 text-white"
                        : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                    }`}
                  >
                    {lt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Daily Carry (showcase only) */}
            {listingType === "showcase" && (
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addToEdc}
                    onChange={(e) => setAddToEdc(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium text-gray-300">
                      Add to My Daily Carry
                    </span>
                  </div>
                </label>
                <p className="text-xs text-gray-400 mt-1.5 ml-7">
                  Include this item in your EDC loadout on your profile
                </p>
              </div>
            )}

            {/* Price (sell) */}
            {listingType === "sell" && (
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                  Price ($)
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.00"
                />
              </div>
            )}

            {/* Rent pricing */}
            {listingType === "rent" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rentPrice" className="block text-sm font-medium text-gray-300 mb-1">
                      Rental Rate ($)
                    </label>
                    <input
                      id="rentPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={rentPrice}
                      onChange={(e) => setRentPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label htmlFor="rentalPeriod" className="block text-sm font-medium text-gray-300 mb-1">
                      Period
                    </label>
                    <select
                      id="rentalPeriod"
                      value={rentalPeriod}
                      onChange={(e) => setRentalPeriod(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {rentalPeriodOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="rentalDeposit" className="block text-sm font-medium text-gray-300 mb-1">
                    Security Deposit ($)
                  </label>
                  <input
                    id="rentalDeposit"
                    type="number"
                    step="0.01"
                    min="0"
                    value={rentalDeposit}
                    onChange={(e) => setRentalDeposit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}

            {/* Shipping (sell/rent only) */}
            {showShipping && (
              <div className="space-y-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-300">Shipping</h3>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={freeShipping}
                      onChange={(e) => setFreeShipping(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-300">Free Shipping</span>
                  </label>
                </div>
                {!freeShipping && (
                  <div>
                    <label htmlFor="shippingCost" className="block text-sm font-medium text-gray-300 mb-1">
                      Shipping Cost ($)
                    </label>
                    <input
                      id="shippingCost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0.00"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shipsFrom" className="block text-sm font-medium text-gray-300 mb-1">
                      Ships From
                    </label>
                    <input
                      id="shipsFrom"
                      type="text"
                      value={shipsFrom}
                      onChange={(e) => setShipsFrom(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="US"
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptsReturns}
                        onChange={(e) => setAcceptsReturns(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-300">Accepts Returns</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={2000}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Describe your item — condition details, included accessories, reason for selling..."
              />
              <p className="text-xs text-gray-500 text-right mt-1">
                {description.length}/2000
              </p>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g. titanium, edc, knife, grail"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-orange-700 text-white font-semibold hover:bg-orange-600 shadow-lg shadow-orange-900/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
