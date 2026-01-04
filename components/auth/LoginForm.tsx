"use client";

import { loginSchema } from "@/types/auth";
/**
 * LOGIN FORM (Frontend Only)
 * ----------------------------------------------------
 * Endpoint: POST /auth/login
 * Backend responsibility:
 * - Validates credentials
 * - Issues JWT + refresh cookie
 *
 * Frontend responsibility:
 * - Collect user input
 * - Call backend
 * - Handle loading / error / success states
 *
 * API Base URL:
 * - Uses NEXT_PUBLIC_API_BASE_URL
 * - Falls back to http://localhost:4000/auth
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TextInput from "../ui/TextInput";
import PrimaryButton from "../ui/PrimaryButton";
import { useAuthStore } from "@/store/auth.store";

/* ----------------------------------------------------
   Configuration
---------------------------------------------------- */

/* ----------------------------------------------------
   Main Login Form Component
---------------------------------------------------- */

export default function LoginForm() {
  /* ------------------------------
     Local State
  ------------------------------ */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  /* ------------------------------
     Submit Handler
  ------------------------------ */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    setSuccess(false);

    // ✅ Zod validation step
    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await useAuthStore
        .getState()
        .login(result.data.email, result.data.password);
      setSuccess(true);
      router.push("/dashboard");
    } catch (err: any) {
      // The store/api throws an object or error, we need to handle it.
      // Looking at api.ts: `throw error` where error is `res.json()`.
      // Ideally we should type this better, but for now matching existing behavior.
      // The error object might have a message property.
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------
     UI
  ------------------------------ */
  return (
    <div className="w-full max-w-md rounded-lg bg-zinc-50 p-6 shadow">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
            Login successful
          </p>
        )}

        <PrimaryButton loading={loading} loadingText="Please wait...">
          Login
        </PrimaryButton>
      </form>

      {/* Secondary actions */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <a href="/forgot-password" className="hover:underline">
          Forgot password?
        </a>
        <a href="/signup" className="hover:underline">
          Create account
        </a>
      </div>
    </div>
  );
}
