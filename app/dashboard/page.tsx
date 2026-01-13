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
      
    </div>
  );
}
