"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function TopNav() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header
      className="
        h-16
        bg-white
        border-b border-gray-200
        flex items-center
        px-6
        sticky top-0 z-20
      "
    >
      {/* Brand */}
      <Link
        href="/dashboard"
        className="
          text-lg font-semibold
          text-[#f46150]
          tracking-tight
        "
      >
        YogSetu
      </Link>

      {/* Search */}
      <div className="flex-1 flex justify-center px-6">
        <input
          type="text"
          placeholder="Search instructors or sessions"
          className="
            w-full max-w-md
            bg-zinc-50
            border border-gray-300
            rounded-md
            px-4 py-2
            text-sm
            outline-none
            transition
            focus:border-[#f46150]
            focus:ring-2 focus:ring-[#f46150]/30
          "
        />
      </div>

      {/* Profile */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.email}
        </span>

        <button
          onClick={handleLogout}
          className="
            text-sm text-gray-600
            hover:text-[#f46150]
            transition
          "
        >
          Logout
        </button>
      </div>
    </header>
  );
}
