"use client";

import { signupSchema } from "@/types/auth";
import { useRouter } from "next/navigation";
/**
 * SIGNUP / REGISTER FORM (Frontend Only)
 * ----------------------------------------------------
 * Endpoint: POST /auth/register
 *
 * Backend responsibility:
 * - Validates email & password strength
 * - Creates user
 * - Issues JWT + refresh cookie
 *
 * Frontend responsibility:
 * - Collect input
 * - Show clear UX feedback
 * - Do NOT handle token storage
 *
 * Styling:
 * - Background: bg-zinc-50
 * - Primary: bg-[#f46150]
 * - Secondary: bg-gray-800
 */

import { useState } from "react";
import TextInput from "../ui/TextInput";
import PrimaryButton from "../ui/PrimaryButton";

/* ----------------------------------------------------
   Configuration
---------------------------------------------------- */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

/* ----------------------------------------------------
   Main Signup Form Component
---------------------------------------------------- */

export default function SignupForm() {
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

    // 🔐 Zod validation step
    const result = signupSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data), // ✅ validated data
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Registration failed");
      }

      setSuccess(true);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
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
        Create Account
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

        {/* Backend-enforced password rules hint */}
        <p className="text-xs text-gray-600">
          Password must include an uppercase letter, a number, and a special
          character.
        </p>

        {error && (
          <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
            Account created successfully
          </p>
        )}

        <PrimaryButton loading={loading} loadingText="Creating account...">
          Sign up
        </PrimaryButton>
      </form>

      {/* Secondary navigation */}
      <div className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="font-medium hover:underline">
          Login
        </a>
      </div>
    </div>
  );
}
