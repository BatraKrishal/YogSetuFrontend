"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { X } from "lucide-react";

// Load Stripe outside of render to avoid recreating object
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentModalProps {
  clientSecret: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount?: number;
}

export default function PaymentModal({
  clientSecret,
  isOpen,
  onClose,
  onSuccess,
  amount,
}: PaymentModalProps) {
  if (!isOpen || !clientSecret) return null;

  const appearance = {
    theme: "stripe" as const,
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
