"use client";

import { User } from "@/types";
import { Bell, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  user?: User;
}

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white px-6">
      {/* Search Bar (Placeholder) */}
      <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 focus-within:border-[#f46150] focus-within:ring-1 focus-within:ring-[#f46150]">
        <Search className="h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search for courses, instructors..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100">
          <span className="sr-only">Notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f46150] ring-2 ring-white" />
        </button>

        <div className="h-8 w-[1px] bg-zinc-200" />

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 hover:opacity-80"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-zinc-900">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-zinc-500 capitalize">
                {user?.role?.toLowerCase() || "Student"}
              </p>
            </div>
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-zinc-200">
              {/* Fallback avatar if no image */}
              <div className="flex h-full w-full items-center justify-center bg-[#f46150] text-white font-bold">
                {user?.name?.[0] || "U"}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
