"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

const baseLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "My Sessions", href: "/dashboard/sessions" },
  { name: "My Bookings", href: "/dashboard/bookings" },
];

const instructorLinks = [
  { name: "Host Sessions", href: "/dashboard/host" },
  { name: "Earnings", href: "/dashboard/earnings" },
];

export default function SideNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isInstructor = user?.role === "INSTRUCTOR";

  const renderLink = (link: { name: string; href: string }) => {
    const active = pathname === link.href;

    return (
      <Link
        key={link.href}
        href={link.href}
        className={`
          relative
          px-4 py-2
          rounded-md
          text-sm
          transition
          ${
            active
              ? "text-[#f46150]"
              : "text-gray-300 hover:bg-gray-700/60"
          }
        `}
      >
        {active && (
          <span className="
            absolute left-0 top-1/2
            h-5 w-1
            -translate-y-1/2
            bg-[#f46150]
            rounded-r
          " />
        )}
        {link.name}
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-gray-800 p-4">
      <nav className="flex flex-col gap-1">
        {baseLinks.map(renderLink)}

        {isInstructor && (
          <>
            <div className="my-3 border-t border-gray-700" />
            {instructorLinks.map(renderLink)}
          </>
        )}
      </nav>
    </aside>
  );
}
