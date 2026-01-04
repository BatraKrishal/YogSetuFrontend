"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function VerifyEmailPendingPage() {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    loading,
    resendVerification,
  } = useAuthStore();

  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* -----------------------------------------
     Redirect rules
  ----------------------------------------- */
  useEffect(() => {
    if (loading) return;

    // Not logged in → login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Already verified → dashboard
    if (user?.isEmailVerified) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, user, router]);

  /* -----------------------------------------
     Resend handler
  ----------------------------------------- */
  const handleResend = async () => {
    setResending(true);
    setMessage(null);
    setError(null);

    try {
      await resendVerification();
      setMessage(
        "Verification email sent. Please check your inbox (and spam)."
      );
    } catch {
      setError("Failed to resend verification email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  /* -----------------------------------------
     Loading state
  ----------------------------------------- */
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  /* -----------------------------------------
     UI
  ----------------------------------------- */
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded border p-6 shadow">
        <h1 className="text-xl font-semibold">Verify your email</h1>

        <p className="text-sm text-gray-600">
          We’ve sent a verification link to:
        </p>

        <p className="font-medium">{user.email}</p>

        <p className="text-sm text-gray-600">
          Please click the link in the email to activate your account.
        </p>

        {message && (
          <p className="text-sm text-green-600">{message}</p>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={handleResend}
          disabled={resending}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {resending ? "Sending…" : "Resend verification email"}
        </button>

        <p className="text-xs text-gray-500">
          Didn’t receive the email? Check spam or wait a few minutes before retrying.
        </p>
      </div>
    </div>
  );
}
