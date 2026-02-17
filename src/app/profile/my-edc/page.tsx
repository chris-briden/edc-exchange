"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  X,
  Loader2,
  Crosshair,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryIcon from "@/components/CategoryIcon";
import { createClient } from "@/lib/supabase-browser";
import type { Item, EdcLoadout } from "@/lib/types";

export default function MyEdcPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [loadout, setLoadout] = useState<EdcLoadout | null>(null);
  const [name, setName] = useState("My Daily Carry");
  const [description, setDescription] = useState("");
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/login?redirect=/profile/my-edc");
        return;
      }

      // Fetch user items
      const { data: itemsData } = await supabase
        .from("items")
        .select("*, categories(*), item_images(*)")
        .eq("user_id", user.id)
        .eq("listing_type", "showcase")
        .order("created_at", { ascending: false });
      if (itemsData) {
        setUserItems(itemsData as Item[]);
      }

      // Fetch existing primary loadout
      const { data: loadoutData } = await supabase
        .from("edc_loadouts")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_primary", true)
        .single();

      if (loadoutData) {
        const l = loadoutData as EdcLoadout;
        setLoadout(l);
        setName(l.name);
        setDescription(l.description || "");

        // Fetch loadout item IDs
        const { data: loadoutItemsData } = await supabase
          .from("edc_loadout_items")
          .select("item_id")
          .eq("loadout_id", l.id)
          .order("position");
        if (loadoutItemsData) {
          setSelectedItemIds(loadoutItemsData.map((li) => li.item_id));
        }
      }

      setLoading(false);
    });
  }, [router]);

  const toggleItem = (itemId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let loadoutId = loadout?.id;

      if (loadoutId) {
        // Update existing loadout
        const { error: updateErr } = await supabase
          .from("edc_loadouts")
          .update({
            name,
            description: description || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", loadoutId);
        if (updateErr) throw updateErr;

        // Clear existing items
        const { error: deleteErr } = await supabase
          .from("edc_loadout_items")
          .delete()
          .eq("loadout_id", loadoutId);
        if (deleteErr) throw deleteErr;
      } else {
        // Create new loadout
        const { data: newLoadout, error: createErr } = await supabase
          .from("edc_loadouts")
          .insert({
            user_id: user.id,
            name,
            description: description || null,
            is_primary: true,
          })
          .select()
          .single();
        if (createErr) throw createErr;
        loadoutId = newLoadout.id;
      }

      // Insert selected items
      if (selectedItemIds.length > 0) {
        const items = selectedItemIds.map((item_id, i) => ({
          loadout_id: loadoutId!,
          item_id,
          position: i,
        }));
        const { error: insertErr } = await supabase
          .from("edc_loadout_items")
          .insert(items);
        if (insertErr) throw insertErr;
      }

      setSuccess(true);
      setTimeout(() => router.push("/profile"), 1000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: unknown }).message)
            : "Failed to save EDC loadout";
      setError(msg);
    } finally {
      setSaving(false);
    }
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

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 mb-6"
          >
          <ArrowLeft className="w-4 h-4" /> Back to profile
        </Link>

          <div className="flex items-center gap-2 mb-6">
            <Crosshair className="w-6 h-6 text-orange-600" />
            <h1 className="text-2xl font-extrabold">My EDC</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/50 border border-red-500 text-red-300 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-900/50 border border-green-500 text-green-300 text-sm">
              EDC saved! Redirecting...
            </div>
          )}

          <div className="space-y-6">
            {/* Loadout name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Loadout Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g. My Daily Carry, Titanium Tuesday"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="desc"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description (optional)
              </label>
              <textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Describe your everyday carry..."
              />
            </div>

            {/* Select items */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select items from your collection (
                {selectedItemIds.length} selected)
              </label>

              {userItems.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {userItems.map((item) => {
                    const isSelected = selectedItemIds.includes(item.id);
                    const firstImage = item.item_images?.[0]?.url;
                    const categorySlug = item.categories?.slug || "";
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className={`relative rounded-xl border-2 overflow-hidden transition ${
                          isSelected
                            ? "border-orange-500 ring-2 ring-orange-500/30"
                            : "border-zinc-700 hover:border-zinc-600"
                        }`}
                      >
                        <div className="aspect-square bg-zinc-800">
                        {firstImage ? (
                          <Image
                            src={firstImage}
                            alt={item.name}
                            width={160}
                            height={160}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <CategoryIcon slug={categorySlug} size="md" />
                          </div>
                          )}
                        </div>
                        <p className="text-xs font-medium text-gray-300 p-2 text-center line-clamp-1">
                          {item.name}
                        </p>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-zinc-700 rounded-xl text-gray-400">
                  <p className="text-sm font-medium">No items in your collection</p>
                  <p className="text-xs mt-1">
                    List some items first, then add them to your EDC
                  </p>
                  <Link
                    href="/items/new"
                    className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
                  >
                    <Plus className="w-4 h-4" /> List Your First Item
                  </Link>
                </div>
              )}
            </div>

            {/* Preview */}
            {selectedItemIds.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preview
                </label>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Crosshair className="w-4 h-4 text-orange-600" />
                    <p className="font-semibold text-sm text-gray-200">{name || "My EDC"}</p>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {selectedItemIds.map((id) => {
                      const item = userItems.find((i) => i.id === id);
                      if (!item) return null;
                      const firstImage = item.item_images?.[0]?.url;
                      const categorySlug = item.categories?.slug || "";
                      return (
                        <div key={id}>
                          <div className="aspect-square rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden shadow-sm">
                            {firstImage ? (
                              <Image
                                src={firstImage}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <CategoryIcon slug={categorySlug} size="sm" />
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1 text-center line-clamp-1">
                            {item.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Save */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving..." : "Save My EDC"}
              </button>
              <Link
                href="/profile"
                className="px-6 py-3 rounded-xl border border-zinc-700 text-gray-300 font-medium hover:bg-zinc-800 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
