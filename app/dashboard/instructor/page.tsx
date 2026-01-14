"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { Session } from "@/types";
import { Loader2, Calendar, Plus, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InstructorDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      // Guard: Redirect if not instructor? (Optional, relying on sidebar for now)

      try {
        const data = await api.getInstructorSessions(user.id);
        setSessions(data);
      } catch (err) {
        console.error("Failed to fetch instructor stats", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#f46150]" />
      </div>
    );
  }

  const totalSessions = sessions.length;
  const upcomingSessions = sessions.filter(
    (s) => new Date(s.startTime) > new Date() && s.status !== "CANCELLED"
  ).length;
  const completedSessions = sessions.filter(
    (s) => s.status === "COMPLETED"
  ).length;

  // Mock earnings for now as we don't have a direct endpoint yet
  // calculate strictly from completed sessions * price * bookings? (Too complex for now without data)
  const totalEarnings = 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            Instructor Dashboard
          </h1>
          <p className="text-zinc-500">
            Welcome back, {user?.name || "Instructor"}
          </p>
        </div>
        <Link href="/dashboard/instructor/sessions/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Session
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Upcoming Sessions
              </p>
              <h3 className="text-2xl font-bold text-zinc-900">
                {upcomingSessions}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Total Earnings
              </p>
              <h3 className="text-2xl font-bold text-zinc-900">
                ₹{totalEarnings}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Total Sessions Taught
              </p>
              <h3 className="text-2xl font-bold text-zinc-900">
                {completedSessions}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions Preview */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          <h2 className="font-bold text-zinc-900">Recent Sessions</h2>
          <Link
            href="/dashboard/instructor/sessions"
            className="text-sm text-[#f46150] font-medium hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="divide-y divide-zinc-100">
          {sessions.length > 0 ? (
            sessions.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-zinc-900">
                    {session.title || "Yoga Session"}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                    <span>{new Date(session.startTime).toLocaleString()}</span>
                    <span>•</span>
                    <span>
                      {session.currentBookings} / {session.capacity} booked
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    session.status === "SCHEDULED"
                      ? "bg-blue-100 text-blue-700"
                      : session.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {session.status}
                </span>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-zinc-500">
              No sessions created yet. Start teaching today!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
