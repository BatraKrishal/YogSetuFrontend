"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Payment } from "@/types";
import {
  Loader2,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { clsx } from "clsx";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const data = await api.getMyPayments();
        setPayments(data);
      } catch (err) {
        console.error("Failed to fetch payments", err);
        setError("Failed to load payment history.");
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#f46150]" />
        <p className="text-zinc-500 mt-2">Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-zinc-900 font-medium">Something went wrong</p>
        <p className="text-zinc-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-[#f46150] hover:underline font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Payment History</h1>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        {payments.length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={clsx(
                      "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                      payment.status === "SUCCEEDED"
                        ? "bg-green-100 text-green-600"
                        : payment.status === "FAILED"
                        ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600"
                    )}
                  >
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-zinc-900">
                        {payment.amount}{" "}
                        {payment.currency?.toUpperCase() || "INR"}
                      </p>
                      <StatusBadge status={payment.status} />
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">
                      {payment.type === "TOPUP"
                        ? "Wallet Top-up"
                        : payment.type === "SESSION_BOOKING"
                        ? "Session Booking"
                        : "Payment"}
                      {payment.provider && ` via ${payment.provider}`}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{" "}
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                      <span>ID: {payment.id.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {/* Optional actions or more details could go here */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <CreditCard className="h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-medium text-zinc-900">
              No payments found
            </h3>
            <p className="text-zinc-500">You haven't made any payments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "SUCCEEDED":
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Succeeded
        </span>
      );
    case "FAILED":
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Failed
        </span>
      );
    case "CANCELED":
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700">
          Canceled
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
          {status}
        </span>
      );
  }
}
