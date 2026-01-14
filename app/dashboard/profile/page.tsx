"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User, Wallet, History, Calendar, CreditCard } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/Button";
import { Booking, Transaction } from "@/types";
import PaymentModal from "@/components/payment/PaymentModal";

import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "wallet" | "bookings"
  >("overview");

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  // Data states
  const [balance, setBalance] = useState<number | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Payment State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          api.getWalletBalance(),
          api.getBookings(),
          api.getWalletTransactions(),
        ]);

        const [balanceRes, bookingsRes, transactionsRes] = results;

        if (balanceRes.status === "fulfilled")
          setBalance(balanceRes.value.balance);
        if (bookingsRes.status === "fulfilled")
          setBookings(bookingsRes.value.bookings || []);
        if (transactionsRes.status === "fulfilled")
          setTransactions(transactionsRes.value);
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchData();
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-zinc-900">My Profile</h1>
      </div>

      {/* Main Profile Header Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm">
        <div className="h-32 w-32 rounded-full bg-linear-to-br from-orange-100 to-orange-50 flex items-center justify-center shrink-0 border-4 border-white shadow-md">
          <User className="h-12 w-12 text-orange-400" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-3xl font-bold text-zinc-900">
            {(user as any).name || "User"}
          </h2>
          <p className="text-zinc-500 font-medium">{user.email}</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600 uppercase tracking-wider">
              {user.role}
            </span>
            {user.isEmailVerified ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                Verified
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                Unverified
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <Button variant="outline">Edit Profile</Button>
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "border-[#f46150] text-[#f46150]"
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("wallet")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "wallet"
              ? "border-[#f46150] text-[#f46150]"
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          Wallet & Transactions
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "bookings"
              ? "border-[#f46150] text-[#f46150]"
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          My Bookings
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wallet Summary */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-zinc-400" /> Wallet Balance
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("wallet")}
                >
                  View All
                </Button>
              </div>
              <p className="text-4xl font-bold text-zinc-900">
                ₹{balance ?? 0}
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                Available for bookings
              </p>
            </div>

            {/* Recent Booking Summary */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-zinc-400" /> Recent Activity
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("bookings")}
                >
                  View All
                </Button>
              </div>
              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-medium text-zinc-700 truncate max-w-[200px]">
                        {booking.session?.title || "Yoga Session"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          booking.status === "BOOKED"
                            ? "bg-green-100 text-green-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">
                  No recent bookings found.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-zinc-900 text-white p-8 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-zinc-400 font-medium mb-1">Total Balance</p>
                <h2 className="text-5xl font-bold">₹{balance ?? 0}</h2>
                <div className="mt-6 flex gap-3">
                  <Button
                    className="bg-white text-zinc-900 hover:bg-zinc-100"
                    onClick={async () => {
                      const amountStr = prompt(
                        "Enter amount to add (₹):",
                        "500"
                      );
                      if (amountStr && !isNaN(Number(amountStr))) {
                        const amount = Number(amountStr);
                        try {
                          const res = await api.topUpWallet(amount);
                          if (res.clientSecret) {
                            setClientSecret(res.clientSecret);
                            setTopUpAmount(amount);
                            setIsPaymentModalOpen(true);
                          } else {
                            alert("Failed to initiate payment");
                          }
                        } catch (e) {
                          console.error(e);
                          alert("Failed to top-up");
                        }
                      }
                    }}
                  >
                    Add Money
                  </Button>
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-white hover:bg-zinc-800"
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 bg-linear-to-l from-zinc-800 to-transparent opacity-50" />
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
              <div className="p-6 border-b border-zinc-200">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <History className="h-5 w-5" /> Transaction History
                </h3>
              </div>
              <div className="divide-y divide-zinc-100">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            tx.type === "CREDIT"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">
                            {tx.description || tx.reason}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-bold ${
                          tx.type === "CREDIT"
                            ? "text-green-600"
                            : "text-zinc-900"
                        }`}
                      >
                        {tx.type === "CREDIT" ? "+" : "-"} ₹{tx.amount}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-zinc-500">
                    No transactions found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-4">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-xl border border-zinc-200 bg-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-zinc-900">
                      {booking.session?.title || "Yoga Session"}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />{" "}
                        {new Date(
                          booking.session?.startTime || new Date()
                        ).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />{" "}
                        {booking.session?.instructorId ? "Instructor" : "TBD"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === "BOOKED"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <p className="mt-2 text-sm font-medium text-zinc-900">
                      ₹{booking.pricePaid}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
                <Calendar className="h-12 w-12 text-zinc-300 mb-4" />
                <h3 className="text-lg font-medium text-zinc-900">
                  No bookings yet
                </h3>
                <p className="text-zinc-500 mb-6">
                  Explore courses and book your first session
                </p>
                <Button
                  onClick={() =>
                    (window.location.href = "/dashboard/student/courses")
                  }
                >
                  Explore Courses
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Payment Modal for Top-up */}
      {clientSecret && topUpAmount && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          clientSecret={clientSecret}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setClientSecret(null);
          }}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
            setClientSecret(null);
            alert("Wallet Top-up Successful!");
            window.location.reload();
          }}
          amount={topUpAmount}
        />
      )}
    </div>
  );
}
