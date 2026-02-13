"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Check,
  X,
  AtSign,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") || "/";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Username availability
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Password strength
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  };
  const passwordStrong = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  // Username validation
  const isValidUsername = (u: string) => /^[a-zA-Z0-9_]{3,20}$/.test(u);

  const checkUsername = useCallback(async (value: string) => {
    if (!value || !isValidUsername(value)) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    setUsernameError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", value.toLowerCase())
        .maybeSingle();

      if (error) throw error;
      setUsernameAvailable(data === null);
    } catch {
      setUsernameError("Could not check availability");
    } finally {
      setCheckingUsername(false);
    }
  }, []);

  // Debounced username check
  useEffect(() => {
    if (!username || !isValidUsername(username)) {
      setUsernameAvailable(null);
      setUsernameError(null);
      return;
    }

    const timer = setTimeout(() => checkUsername(username), 400);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!isValidUsername(username)) {
      setFormError(
        "Username must be 3-20 characters: letters, numbers, and underscores only."
      );
      return;
    }
    if (!passwordStrong) {
      setFormError(
        "Password must be at least 8 characters with uppercase, lowercase, and a number."
      );
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (usernameAvailable === false) {
      setFormError("That username is already taken.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // Double-check username availability
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username.toLowerCase())
        .maybeSingle();

      if (existing) {
        setFormError("That username was just taken. Please pick another.");
        setUsernameAvailable(false);
        setLoading(false);
        return;
      }

      const callbackUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`
          : "";

      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl,
          data: {
            user_name: username.toLowerCase(),
            full_name: fullName || null,
          },
        },
      });

      if (error) throw error;

      // If Supabase returned a session, the user is auto-confirmed
      // (email confirmation disabled in dashboard). Redirect immediately.
      if (signUpData.session) {
        router.push(redirect);
        return;
      }

      // Otherwise show the "check your email" screen
      setSuccess(true);
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "Account creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Image src="/icon-new-dark.png" alt="The Carry Exchange" width={568} height={556} className="h-12 w-12" />
            <span className="text-2xl font-bold tracking-wide text-gray-900">
              The Carry Exchange
            </span>
          </div>
          <h1 className="text-2xl font-extrabold mb-2">You&apos;re almost in!</h1>
          <p className="text-gray-500 mb-6">
            We sent a confirmation link to{" "}
            <span className="font-medium text-gray-700">{email}</span>. Click it
            to activate your account.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-orange-800">
              Your username{" "}
              <span className="font-bold">@{username.toLowerCase()}</span> is
              reserved and waiting for you.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
          >
            Go to Sign In
          </Link>
          <p className="text-xs text-gray-400 mt-4">
            Didn&apos;t get the email? Check your spam folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 justify-center">
            <Image src="/icon-new-dark.png" alt="The Carry Exchange" width={568} height={556} className="h-12 w-12" />
            <span className="text-2xl font-bold tracking-wide text-gray-900">
              The Carry Exchange
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold mt-4">
            Create your account
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Join The Carry Exchange community. It only takes a minute.
          </p>
        </div>

        {formError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
                }
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                  username.length > 0 && usernameAvailable === true
                    ? "border-green-400 focus:ring-green-300"
                    : username.length > 0 && usernameAvailable === false
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-orange-500"
                }`}
                placeholder="pick_a_username"
                maxLength={20}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingUsername && (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                )}
                {!checkingUsername &&
                  username.length >= 3 &&
                  usernameAvailable === true && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                {!checkingUsername &&
                  username.length >= 3 &&
                  usernameAvailable === false && (
                    <X className="w-4 h-4 text-red-500" />
                  )}
              </div>
            </div>
            <div className="mt-1 min-h-[1.25rem]">
              {username.length > 0 && username.length < 3 && (
                <p className="text-xs text-gray-400">
                  At least 3 characters
                </p>
              )}
              {usernameAvailable === false && (
                <p className="text-xs text-red-500">
                  That username is taken
                </p>
              )}
              {usernameAvailable === true && (
                <p className="text-xs text-green-600">
                  @{username.toLowerCase()} is available!
                </p>
              )}
              {usernameError && (
                <p className="text-xs text-amber-500">{usernameError}</p>
              )}
            </div>
          </div>

          {/* Full Name (optional) */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {/* Password strength indicators */}
            {password.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                {[
                  { key: "length", label: "8+ characters" },
                  { key: "uppercase", label: "Uppercase letter" },
                  { key: "lowercase", label: "Lowercase letter" },
                  { key: "number", label: "Number" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-1.5">
                    {passwordChecks[key as keyof typeof passwordChecks] ? (
                      <Check className="w-3 h-3 text-green-500 shrink-0" />
                    ) : (
                      <X className="w-3 h-3 text-gray-300 shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        passwordChecks[key as keyof typeof passwordChecks]
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                  confirmPassword.length > 0 && passwordsMatch
                    ? "border-green-400 focus:ring-green-300"
                    : confirmPassword.length > 0 && !passwordsMatch
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-orange-500"
                }`}
                placeholder="Re-enter your password"
                required
              />
              {confirmPassword.length > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {passwordsMatch ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">
                Passwords don&apos;t match
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              !passwordStrong ||
              !passwordsMatch ||
              usernameAvailable !== true
            }
            className="w-full py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating your account..." : "Create Account"}
          </button>
        </form>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-6">
          By creating an account, you agree to our{" "}
          <Link href="#" className="underline hover:text-gray-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-gray-600">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="text-center mt-6">
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

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
