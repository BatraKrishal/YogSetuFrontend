"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Loader2,
  Users,
  FileCheck,
  AlertCircle,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import PaymentReconciliation from "@/components/admin/PaymentReconciliation";
import InstructorApplicationList from "@/components/admin/InstructorApplicationList";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingApplications: 0,
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  // We could fetch some summary stats here if we had a specific endpoint for it
  // For now, we'll load the applications to count them
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const apps = await api.getInstructorApplications();
        setStats({
          pendingApplications: apps.filter((a) => a.status === "PENDING")
            .length,
          totalApplications: apps.length,
        });
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Admin Overview</h1>
        <p className="text-zinc-500">
          Welcome to the administration dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Pending Applications
            </CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.pendingApplications}
            </div>
            <p className="text-xs text-zinc-500">
              Instructors waiting for approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Total Applications
            </CardTitle>
            <FileCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-zinc-500">All time applications</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-zinc-900">
            Pending Actions
          </h2>
          <InstructorApplicationList limit={5} showPendingOnly={true} />
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-zinc-900">System Health</h2>
          <PaymentReconciliation />
        </div>
      </div>
    </div>
  );
}
