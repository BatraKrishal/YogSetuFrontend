"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { clsx } from "clsx";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

interface SidebarProps {
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
}

export const Sidebar = ({ role = "USER" }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  // Define navigation items based on role
  const navItems =
    role === "INSTRUCTOR"
      ? [
          {
            label: "Overview",
            href: "/dashboard/instructor",
            icon: LayoutDashboard,
          },
          {
            label: "My Sessions",
            href: "/dashboard/instructor/sessions",
            icon: Calendar,
          },
          {
            label: "Create Session",
            href: "/dashboard/instructor/sessions/new",
            icon: BookOpen,
          },
          {
            label: "Earnings",
            href: "/dashboard/instructor/earnings",
            icon: History,
          },
        ]
      : [
          {
            label: "Dashboard",
            href: "/dashboard/student",
            icon: LayoutDashboard,
          },
          {
            label: "Browse Courses",
            href: "/dashboard/student/courses",
            icon: BookOpen,
          },
          {
            label: "My Bookings",
            href: "/dashboard/student/bookings",
            icon: Calendar,
          },
          {
            label: "Payment History",
            href: "/dashboard/student/payments",
            icon: History,
          },
        ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-200 bg-white">
      {/* Logo Area */}
      <div className="flex h-16 items-center border-b border-zinc-200 px-6">
        <Link href="/">
          {/* Using a text logo/placeholder if image fails, but mimicking the Navbar logo style */}
          <div className="relative h-8 w-32">
            <Image
              src="/logos/logo.png"
              alt="YogSetu"
              fill
              className="object-contain object-left"
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col justify-between h-[calc(100vh-65px)] p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#f46150]/10 text-[#f46150]"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-zinc-200 pt-4 space-y-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
};
