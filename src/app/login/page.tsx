"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const error = searchParams.get("error");

  const handleGitHubLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">EDC</span>
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold mt-4">
            Sign in to EDC Exchange
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Join the community. Buy, sell, trade EDC gear.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            Authentication failed. Please try again.
          </div>
        )}

        {/* GitHub OAuth button */}
        <button
          onClick={handleGitHubLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition shadow-lg"
        >
          <Github className="w-5 h-5" />
          Sign in with GitHub
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree to our{" "}
          <Link href="#" className="underline hover:text-gray-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-gray-600">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-orange-600 transition"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
