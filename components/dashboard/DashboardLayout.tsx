"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { EmailVerificationBanner } from "@/components/auth/EmailVerificationBanner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50">
        <Sidebar role={user?.role || "USER"} />
        <div className="pl-64 flex flex-col min-h-screen">
          <EmailVerificationBanner />
          <Header user={user || undefined} />
          <main className="p-8 flex-1">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
