"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuthStore();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  if (loading || !user) {
    return <p>Loading…</p>;
  }

  return (
    <div>
      {/* 🔔 Verification banner */}
      {!user.isEmailVerified && (
        <div className="mb-4 rounded border border-yellow-400 bg-yellow-100 p-3 text-sm">
          <p className="font-medium">
            Your email is not verified.
          </p>
          <p>
            Please verify your email to book sessions or make payments.
          </p>
        </div>
      )}

      <h1>Dashboard</h1>
      <p>Welcome, {user.email}</p>

      <button
        onClick={handleLogout}
        className="mt-4 rounded bg-gray-800 px-4 py-2 text-white"
      >
        Logout
      </button>
    </div>
  );
}
