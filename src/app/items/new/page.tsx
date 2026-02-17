"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImagePlus, X, Loader2, Crosshair, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase-browser";
import type { Category } from "@/lib/types";

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

export default function NewItemPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
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
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [addToEdc, setAddToEdc] = useState(false);
  const [stripeConnected, setStripeConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data as Category[]);
      });

    // Check Stripe connection status
    fetch("/api/stripe/connect")
      .then((res) => res.json())
      .then((data) => {
        setStripeConnected(data.connected && data.charges_enabled);
      })
      .catch(() => setStripeConnected(false));
  }, []);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 10 - images.length;
    const newFiles = files.slice(0, remaining);
    setImages((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [
      ...prev,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Gate: require Stripe for sell/rent listings
      if ((listingType === "sell" || listingType === "rent") && !stripeConnected) {
        throw new Error("Please connect your Stripe account before listing items for sale or rent. Go to your profile to set it up.");
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: item, error: itemError } = await supabase
        .from("items")
        .insert({
          user_id: user.id,
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
            (listingType === "sell" || listingType === "rent") && !freeShipping && shippingCost
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
        .select()
        .single();

      if (itemError) throw itemError;

      // Upload images
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${item.id}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("item-images")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("item-images").getPublicUrl(path);

        const { error: imgError } = await supabase
          .from("item_images")
          .insert({ item_id: item.id, url: publicUrl, position: i });
        if (imgError) throw imgError;
      }

      // Add to Daily Carry if checkbox was checked
      if (addToEdc && listingType === "showcase") {
        // Get or create primary loadout
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
          // Get next position
          const { data: existingItems } = await supabase
            .from("edc_loadout_items")
            .select("position")
            .eq("loadout_id", loadoutId)
            .order("position", { ascending: false })
            .limit(1);

          const nextPosition = (existingItems?.[0]?.position ?? -1) + 1;

          await supabase.from("edc_loadout_items").insert({
            loadout_id: loadoutId,
            item_id: item.id,
            position: nextPosition,
          });
        }
      }

      toast.success("Item listed successfully!");
      router.push(`/item/${item.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create item";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  const showShipping = listingType === "sell" || listingType === "rent";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to marketplace
          </Link>

          <h1 className="text-2xl font-extrabold mb-6">List a New Item</h1>

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
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-24">
                  <Image
                    src={src}
                    alt={`Preview ${i + 1}`}
                    fill
                    className="rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
              {images.length < 10 && (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-zinc-700 flex items-center justify-center cursor-pointer hover:border-orange-400 transition">
                  <ImagePlus className="w-6 h-6 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageAdd}
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

              {/* Stripe gate warning */}
              {(listingType === "sell" || listingType === "rent") && stripeConnected === false && (
                <div className="mt-3 p-3 rounded-xl bg-amber-900/30 border border-amber-500/50 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-300">
                      Stripe account required
                    </p>
                    <p className="text-amber-300/80 text-xs mt-0.5">
                      You need to{" "}
                      <a href="/profile" className="underline font-medium">
                        connect a Stripe account
                      </a>{" "}
                      before listing items for sale or rent.
                    </p>
                  </div>
                </div>
              )}
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
              disabled={loading}
              className="w-full py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating..." : "List Item"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
