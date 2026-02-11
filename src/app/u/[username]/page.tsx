"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase-browser";

export default function UsernamePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const resolve = async () => {
      // Look up profile by username
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();

      if (!profile) {
        setNotFound(true);
        return;
      }

      // Check if this is the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id === profile.id) {
        router.replace("/profile");
      } else {
        router.replace(`/profile/${profile.id}`);
      }
    };

    resolve();
  }, [username, router]);

  if (notFound) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
          <p className="text-gray-500 mt-2">
            No user with the username &ldquo;{username}&rdquo; exists.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    </>
  );
}
