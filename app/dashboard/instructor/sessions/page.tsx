"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { Session } from "@/types";
import {
  Loader2,
  Plus,
  Calendar,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { clsx } from "clsx";

export default function InstructorSessionsPage() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSessions = async () => {
    if (!user) return;
    try {
      const data = await api.getInstructorSessions(user.id);
      setSessions(data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSessions();
  }, [user]);

  const handleCompleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to mark this session as completed?"))
      return;

    setActionLoading(sessionId);
    try {
      await api.completeSession(sessionId);
      // alert("Session completed successfully!");
      fetchSessions(); // Refresh list
    } catch (err) {
      console.error("Failed to complete session", err);
      alert("Failed to update session status");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#f46150]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">My Sessions</h1>
        <Link href="/dashboard/instructor/sessions/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Session
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "px-2 py-0.5 rounded-full text-xs font-bold",
                      session.status === "SCHEDULED"
                        ? "bg-blue-100 text-blue-700"
                        : session.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-zinc-100 text-zinc-600"
                    )}
                  >
                    {session.status}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {session.id.slice(0, 8)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-900">
                  {session.title || "Yoga Session"}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />{" "}
                    {new Date(session.startTime).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />{" "}
                    {new Date(session.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(session.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {session.currentBookings} /{" "}
                    {session.capacity}
                  </span>
                  <span className="font-bold text-zinc-900">
                    ₹{session.price}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                {session.status === "SCHEDULED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCompleteSession(session.id)}
                    disabled={!!actionLoading}
                    className="w-full md:w-auto text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                  >
                    {actionLoading === session.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Mark Complete
                  </Button>
                )}
                {session.status === "COMPLETED" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="text-zinc-400 w-full md:w-auto"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Completed
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
            <Calendar className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-zinc-900 font-medium">No sessions found</h3>
            <p className="text-zinc-500 mb-6">
              You haven't created any sessions yet.
            </p>
            <Link href="/dashboard/instructor/sessions/new">
              <Button variant="outline">Create Your First Session</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
