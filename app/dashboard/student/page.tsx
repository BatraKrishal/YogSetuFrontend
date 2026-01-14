"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Booking, Session } from "@/types";
import { CourseCard } from "@/components/courses/CourseCard";
import { Wallet, BookOpen, Calendar } from "lucide-react";

export default function StudentDashboard() {
  // State management for dashboard data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Loading state to show spinner while fetching data
  const [loading, setLoading] = useState(true);

  // Effect hook to fetch data when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data independently so one failure doesn't block others
        const results = await Promise.allSettled([
          api.getBookings(),
          api.getSessions(),
        ]);

        const [bookingResult, sessionResult] = results;

        if (bookingResult.status === "fulfilled") {
          // Verify structure of response
          console.log("Bookings API Response:", bookingResult.value);
          setBookings(bookingResult.value.bookings || []);
        } else {
          console.error("Bookings fetch failed:", bookingResult.reason);
        }

        if (sessionResult.status === "fulfilled") {
          setSessions(sessionResult.value);
        } else {
          // If 403, it's expected for unverified users
          const error = sessionResult.reason;
          if (error?.status === 403) {
            console.warn(
              "Sessions access restricted (Email likely unverified)."
            );
          } else {
            console.error("Sessions fetch failed:", error);
          }
        }
      } catch (error) {
        console.error("Unexpected error in dashboard fetch", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f46150] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Welcome back! 👋</h1>
        <p className="mt-2 text-zinc-500">
          Track your progress and explore new yoga sessions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Active Bookings */}
        <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md hover:border-[#f46150]/30">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Upcoming Sessions
              </p>
              <p className="text-2xl font-bold text-zinc-900">
                {bookings.length}
              </p>
            </div>
          </div>
        </div>

        {/* Courses Completed (Mock) */}
        <div className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md hover:border-[#f46150]/30">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Sessions Completed
              </p>
              <p className="text-2xl font-bold text-zinc-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Sessions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900">
            Recommended for you
          </h2>
          <button className="text-sm font-medium text-[#f46150] hover:text-[#d95546]">
            View all courses
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <CourseCard key={session.id} session={session} />
          ))}
        </div>
      </div>
    </div>
  );
}
