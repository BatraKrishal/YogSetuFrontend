"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      <button
        onClick={handleLogout}
        className="mt-4 rounded bg-gray-800 px-4 py-2 text-white"
      >
        Logout
      </button>
    </div>
  );
}
