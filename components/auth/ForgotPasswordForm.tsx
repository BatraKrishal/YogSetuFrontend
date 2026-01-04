"use client";

import { forgotPasswordSchema } from "@/types/auth";
/**
 * FORGOT PASSWORD FORM (Frontend Only)
 * ----------------------------------------------------
 * Endpoint: POST /auth/forgot-password
 *
 * Backend responsibility:
 * - Validates email
 * - Sends reset email if account exists
 * - Applies rate limiting
 *
 * Frontend responsibility:
 * - Collect email
 * - Show neutral success message
 * - Do NOT reveal account existence
 *
 * Styling:
 * - Background: bg-zinc-50
 * - Primary: bg-[#f46150]
 * - Secondary: bg-gray-800
 */

import { useState } from "react";
import TextInput from "../ui/TextInput";
import PrimaryButton from "../ui/PrimaryButton";
import { api } from "@/lib/api";

/* ----------------------------------------------------
   Configuration
---------------------------------------------------- */

/* ----------------------------------------------------
   Main Forgot Password Component
---------------------------------------------------- */

export default function ForgotPasswordForm() {
  /* ------------------------------
     Local State
  ------------------------------ */
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  /* ------------------------------
     Submit Handler
  ------------------------------ */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    setSubmitted(false);

    // 🔐 Zod validation
    const result = forgotPasswordSchema.safeParse({
      email,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await api.forgotPassword(result.data.email);

      /**
       * Always show neutral success message
       * (prevents email enumeration)
       */
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------
     UI
  ------------------------------ */
  return (
    <div className="w-full max-w-md rounded-lg bg-zinc-50 p-6 shadow">
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">
        Forgot Password
      </h1>

      <p className="mb-6 text-sm text-gray-600 text-center">
        Enter your email address and we’ll send you a password reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && (
          <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {submitted && (
          <p className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
            If an account exists for this email, a reset link has been sent.
          </p>
        )}

        <PrimaryButton loading={loading} loadingText="Sending...">
          Send reset link
        </PrimaryButton>
      </form>

      {/* Secondary navigation */}
      <div className="mt-4 text-center text-sm text-gray-600">
        Remembered your password?{" "}
        <a href="/login" className="font-medium hover:underline">
          Back to login
        </a>
      </div>
    </div>
  );
}
