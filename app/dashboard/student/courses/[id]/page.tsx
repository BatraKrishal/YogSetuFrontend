import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { use, useState, useEffect } from "react";
import Image from "next/image";
import { User, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Session } from "@/types";
import PaymentModal from "@/components/payment/PaymentModal";

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const sessionId = resolvedParams.id;

  const router = useRouter();
  const { user } = useAuthStore();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Payment State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleBook = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setBookingLoading(true);
      const res = await api.bookSession(sessionId);

      if (res.clientSecret) {
        setClientSecret(res.clientSecret);
        setIsPaymentModalOpen(true);
      } else {
        // Fallback if no payment needed (free course?)
        alert(`Booking initiated! Status: ${res.bookingStatus}`);
        router.push("/dashboard/student/bookings");
      }
    } catch (err: any) {
      console.error("Booking failed", err);
      if (err.message === "Email not verified") {
        alert("Please verify your email to book a session.");
      } else {
        alert(err.message || "Failed to book session");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    async function fetchSession() {
      try {
        const sessions = await api.getSessions();
        // Since we don't have a getSessionById endpoint in our simple API wrapper yet,
        // we'll filter from the list. Ideally, backend should have a specific endpoint.
        const found = sessions.find((s) => s.id === sessionId);
        setSession(found || null);
      } catch (error) {
        console.error("Failed to fetch session", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f46150] border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-zinc-900">Session not found</h2>
        <p className="text-zinc-500">
          The requested session could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative h-64 w-full overflow-hidden rounded-2xl md:h-96">
        <Image
          src={session.image || "/Home/Hero.webp"}
          alt={session.title || "Session Image"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white p-4">
          <h1 className="text-3xl font-bold md:text-5xl">{session.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-white/90">
            <span className="bg-[#f46150] px-3 py-1 rounded-full text-sm font-bold">
              {session.status}
            </span>
            {session.instructor?.name && (
              <span className="flex items-center gap-1 font-medium">
                <User className="h-4 w-4" /> {session.instructor.name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-bold text-zinc-900 mb-4">
              About the Session
            </h2>
            <p className="text-zinc-600 leading-relaxed">
              {session.description ||
                "No description provided for this session."}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-bold text-zinc-900 mb-4">Instructor</h2>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden">
                {/* Placeholder Avatar */}
                <User className="h-8 w-8 text-zinc-400" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900">
                  {session.instructor?.name || "Unknown Instructor"}
                </h3>
                <p className="text-sm text-zinc-500">
                  {session.instructor?.email}
                </p>
                {/* <p className="text-sm text-zinc-500 mt-1">Professional yoga instructor...</p> */}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-[#f46150]">
                ₹{session.price}
              </span>
              <span className="text-sm text-zinc-500">
                {session.capacity - session.currentBookings} spots left
              </span>
            </div>

            <Button
              className="w-full text-lg py-6 shadow-lg shadow-[#f46150]/20 disabled:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handleBook}
              disabled={
                !user?.isEmailVerified ||
                session.currentBookings >= session.capacity ||
                bookingLoading
              }
            >
              {!user?.isEmailVerified
                ? "Verify Email to Book"
                : session.currentBookings >= session.capacity
                ? "Session Full"
                : bookingLoading
                ? "Processing..."
                : "Book Now"}
            </Button>

            <div className="border-t border-zinc-100 pt-4 space-y-3">
              <div className="flex items-center gap-3 text-zinc-600">
                <Calendar className="h-5 w-5 text-zinc-400" />
                <span>{new Date(session.startTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600">
                <Clock className="h-5 w-5 text-zinc-400" />
                <span>
                  {new Date(session.startTime).toLocaleTimeString()} -{" "}
                  {new Date(session.endTime).toLocaleTimeString()}
                </span>
              </div>
              {/* Assuming location is online or specific place */}
              <div className="flex items-center gap-3 text-zinc-600">
                <MapPin className="h-5 w-5 text-zinc-400" />
                <span>Online Session</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {clientSecret && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          clientSecret={clientSecret}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
            alert("Booking Successful!");
            router.push("/dashboard/student/bookings");
          }}
          amount={session.price}
        />
      )}
    </div>
  );
}
