"use client";

import { User } from "@/types";
import { Bell, Search, LogOut, User as UserIcon, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog"; // Or specialized Popover if available, using simple toggle for now
import { cn } from "@/lib/utils";

interface HeaderProps {
  user?: User;
}

export const Header = ({ user }: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "Session Reminders",
      message: "Yoga Basics starts in 1 hour.",
      time: "1h ago",
      unread: true,
    },
    {
      id: 2,
      title: "System",
      message: "Welcome to YogSetu Premium!",
      time: "1d ago",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 shadow-sm">
      {/* Search Bar */}
      <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/50 px-4 py-2 transition-all focus-within:border-[#f46150] focus-within:ring-2 focus-within:ring-[#f46150]/20 focus-within:bg-white">
        <Search className="h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search for courses, instructors..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
          >
            <span className="sr-only">Notifications</span>
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f46150] ring-2 ring-white animate-pulse" />
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-200 bg-white shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 rounded-t-xl">
                  <h3 className="font-semibold text-sm text-zinc-900">
                    Notifications
                  </h3>
                  <button className="text-xs text-[#f46150] hover:underline">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "px-4 py-3 hover:bg-zinc-50 border-b border-zinc-50 last:border-0 cursor-pointer transition-colors",
                        n.unread ? "bg-orange-50/30" : ""
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-sm text-zinc-900">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-zinc-400">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-6 w-[1px] bg-zinc-200" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-zinc-900 group-hover:text-[#f46150] transition-colors">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-zinc-500 capitalize">
                {user?.role?.toLowerCase() || "Student"}
              </p>
            </div>
            <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-zinc-100 group-hover:ring-[#f46150] transition-all">
              {/* Fallback avatar if no image */}
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f46150] to-[#d95546] text-white font-bold text-sm">
                {user?.name?.[0] || "U"}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
