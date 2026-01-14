"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Booking } from "@/types";
import { Loader2, Calendar, User, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";
import Link from "next/link";

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const data = await api.getBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (
      !confirm(
        "Are you sure you want to cancel this booking? This might be subject to refund policies."
      )
    )
      return;

    setCancellingId(bookingId);
    try {
      await api.cancelBooking(bookingId);
      // alert("Booking cancelled successfully");
      fetchBookings(); // Refresh list to show updated status
    } catch (err: any) {
      console.error("Failed to cancel booking", err);
      alert(err.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
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
        <h1 className="text-2xl font-bold text-zinc-900">My Bookings</h1>
        <Link href="/dashboard/student/courses">
          <Button variant="outline">Browse Courses</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-md"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={clsx(
                      "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide",
                      booking.status === "BOOKED"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : booking.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-zinc-100 text-zinc-600"
                    )}
                  >
                    {booking.status}
                  </span>
                  <span className="text-xs text-zinc-400">
                    ID: {booking.id.slice(0, 8)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-900">
                  {booking.session?.title || "Yoga Session"}
                </h3>

                <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-zinc-400" />{" "}
                    {new Date(
                      booking.session?.startTime || ""
                    ).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-zinc-400" />{" "}
                    {new Date(
                      booking.session?.startTime || ""
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-zinc-400" /> Instructor
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 min-w-[120px]">
                <p className="text-lg font-bold text-zinc-900">
                  ₹{booking.pricePaid}
                </p>

                {booking.status === "BOOKED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 w-full"
                    onClick={() => handleCancel(booking.id)}
                    disabled={!!cancellingId}
                  >
                    {cancellingId === booking.id ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    ) : null}
                    Cancel
                  </Button>
                )}
                {booking.status === "CANCELLED" && (
                  <span className="text-xs text-zinc-400 italic">
                    Cancelled on {new Date().toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
            <Calendar className="h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-medium text-zinc-900">
              No bookings found
            </h3>
            <p className="text-zinc-500 mb-6">
              You haven't booked any sessions yet.
            </p>
            <Link href="/dashboard/student/courses">
              <Button>Find a Class</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
