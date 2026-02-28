"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Mail, Loader2, Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      window.location.href = redirect;
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "Sign in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Image src="/icon-new-white.png" alt="The Carry Exchange" width={568} height={556} className="w-24 sm:w-32 h-24 sm:h-32 opacity-90 drop-shadow-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
            Sign in to The Carry Exchange
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            Welcome back. Pick up where you left off.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-4 sm:p-6">
          {(error || formError) && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg bg-red-900/50 border border-red-500 text-red-300 text-xs sm:text-sm">
              {formError || "Authentication failed. Please try again."}
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSignIn} className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-zinc-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent bg-zinc-800/50 text-white placeholder-gray-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-xl border border-zinc-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent bg-zinc-800/50 text-white placeholder-gray-500"
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-orange-700 text-white text-sm sm:text-base font-semibold hover:bg-orange-600 shadow-lg shadow-orange-900/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Create account link */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-zinc-800/30 border border-zinc-700 text-center">
          <p className="text-xs sm:text-sm text-gray-300">
            New to The Carry Exchange?{" "}
            <Link
              href="/signup"
              className="text-orange-400 font-semibold hover:text-orange-300 transition"
            >
              Create an account
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-4 sm:mt-6">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-gray-300">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-gray-300">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="text-center mt-4 sm:mt-6">
          <Link
            href="/"
            className="text-xs sm:text-sm text-gray-400 hover:text-orange-400 transition"
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
