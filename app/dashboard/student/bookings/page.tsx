"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Booking } from "@/types";
import SessionCalendar from "@/components/student/SessionCalendar";
import { Loader2 } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await api.getBookings();
        setBookings(res.bookings || []);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#f46150]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">My Schedule</h1>
        <p className="mt-2 text-zinc-500">
          View your upcoming sessions in calendar view.
        </p>
      </div>

      <SessionCalendar bookings={bookings} />
    </div>
  );
}
