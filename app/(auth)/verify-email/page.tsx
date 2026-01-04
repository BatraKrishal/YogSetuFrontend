"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { verifyEmail, resendVerification } = useAuthStore();

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  /* -----------------------------------------
     Verify email on load
  ----------------------------------------- */
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Missing verification token.");
      return;
    }

    const runVerification = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");

        // small delay for UX
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1500);
      } catch {
        setStatus("error");
        setError("Verification link is invalid or expired.");
      }
    };

    runVerification();
  }, [token, verifyEmail, router]);

  /* -----------------------------------------
     Resend handler (fallback)
  ----------------------------------------- */
  const handleResend = async () => {
    setResending(true);
    setError(null);

    try {
      await resendVerification();
      setError(
        "A new verification email has been sent. Please check your inbox."
      );
    } catch {
      setError("Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  /* -----------------------------------------
     UI states
  ----------------------------------------- */
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded border p-6 shadow">
        {status === "loading" && (
          <>
            <h1 className="text-xl font-semibold">
              Verifying your email…
            </h1>
            <p className="text-sm text-gray-600">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-xl font-semibold text-green-600">
              Email verified 🎉
            </h1>
            <p className="text-sm text-gray-600">
              Your account has been activated. Redirecting to dashboard…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-xl font-semibold text-red-600">
              Verification failed
            </h1>

            <p className="text-sm text-gray-600">
              {error}
            </p>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {resending
                ? "Sending…"
                : "Resend verification email"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
