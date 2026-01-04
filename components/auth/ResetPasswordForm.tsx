"use client";

/**
 * RESET PASSWORD FORM (Frontend Only)
 * ----------------------------------------------------
 * Endpoint: POST /auth/reset-password
 *
 * Backend responsibility:
 * - Validates reset token
 * - Validates new password
 * - Updates password
 *
 * Frontend responsibility:
 * - Read token from URL
 * - Collect new password
 * - Show clear success / error states
 *
 * Styling:
 * - Background: bg-zinc-50
 * - Primary: bg-[#f46150]
 * - Secondary: bg-gray-800
 */

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPasswordSchema } from "@/types/auth";
import TextInput from "../ui/TextInput";
import PrimaryButton from "../ui/PrimaryButton";
import { api } from "@/lib/api";

/* ----------------------------------------------------
   Configuration
---------------------------------------------------- */

/* ----------------------------------------------------
   Main Reset Password Component
---------------------------------------------------- */

export default function ResetPasswordForm() {
  /* ------------------------------
     Read token from URL
     Example: /reset-password?token=abc123
  ------------------------------ */
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  /* ------------------------------
     Local State
  ------------------------------ */
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /* ------------------------------
     Submit Handler
  ------------------------------ */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    setSuccess(false);

    // ❗ token comes from URL, validate it too
    const result = resetPasswordSchema.safeParse({
      token,
      newPassword,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword(result.data.token, result.data.newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Password reset failed");
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
        Reset Password
      </h1>

      {!token && (
        <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
          Invalid or expired password reset link.
        </p>
      )}

      {token && (
        <>
          <p className="mb-6 text-sm text-gray-600 text-center">
            Enter a new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            {/* Backend password rules hint */}
            <p className="text-xs text-gray-600">
              Password must meet the minimum security requirements.
            </p>

            {error && (
              <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
                Password reset successful. You can now log in.
              </p>
            )}

            <PrimaryButton loading={loading} loadingText="Resetting...">
              Reset password
            </PrimaryButton>
          </form>
        </>
      )}

      {/* Secondary navigation */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <a href="/login" className="font-medium hover:underline">
          Back to login
        </a>
      </div>
    </div>
  );
}
