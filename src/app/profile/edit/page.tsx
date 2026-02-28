"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AvatarCropper from "@/components/AvatarCropper";
import { createClient } from "@/lib/supabase-browser";
import type { Profile } from "@/lib/types";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/login?redirect=/profile/edit");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        const p = data as Profile;
        setProfile(p);
        setUsername(p.username || "");
        setFullName(p.full_name || "");
        setBio(p.bio || "");
        setWebsite(p.website || "");
        setLocation(p.location || "");
        setAvatarUrl(p.avatar_url);
      }
      setLoading(false);
    });
  }, [router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setTempImageUrl(event.target?.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(croppedBlob));
    setShowCropper(false);
    setTempImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let newAvatarUrl = avatarUrl;

      // Upload avatar if changed
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `${user.id}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(path);
        newAvatarUrl = `${publicUrl}?t=${Date.now()}`;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username,
          full_name: fullName || null,
          bio: bio || null,
          website: website || null,
          location: location || null,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;
      toast.success("Profile updated!");
      setSuccess(true);
      setTimeout(() => router.push("/profile"), 1000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: unknown }).message)
            : "Failed to save profile";
      setError(msg);
    } finally {
      setSaving(false);
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

          <h1 className="text-2xl font-extrabold mb-6">Edit Profile</h1>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/50 border border-red-500 text-red-300 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-900/50 border border-green-500 text-green-300 text-sm">
              Profile updated! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Avatar
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  {avatarPreview || avatarUrl ? (
                    <Image
                      src={avatarPreview || avatarUrl!}
                      alt="Avatar"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold">
                      {username.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center cursor-pointer shadow-sm hover:bg-zinc-700">
                    <Camera className="w-4 h-4 text-gray-300" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400">
                  Click the camera icon to upload a new avatar
                </p>
              </div>
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Tell the community about yourself..."
              />
            </div>

            {/* Website */}
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Website
              </label>
              <input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g. Austin, TX"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-orange-700 text-white font-semibold hover:bg-orange-600 shadow-lg shadow-orange-900/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <Link
                href="/profile"
                className="px-6 py-3 rounded-xl border border-zinc-700 text-gray-300 font-medium hover:bg-zinc-800 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      {showCropper && tempImageUrl && (
        <AvatarCropper
          imageSrc={tempImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setTempImageUrl(null);
          }}
        />
      )}

      <Footer />
    </>
  );
}
