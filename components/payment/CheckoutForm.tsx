"use client";

import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

export default function CheckoutForm({
  amount,
  onSuccess,
}: {
  amount?: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL where the user is redirected after the payment.
        // For simple modals, we might avoid redirect if we can handle it inline,
        // but confirmPayment usually redirects unless redirect: 'if_required' is set.
        return_url: window.location.href,
      },
      redirect: "if_required", // Handle success without full page reload if possible
    });

    if (error) {
      console.error(error);
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message ?? "An unexpected error occurred.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else {
      // Payment succeeded (or at least no error in confirmation)
      setMessage("Payment Succeeded!");
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      {message && (
        <div
          className="p-3 bg-red-50 text-red-700 rounded text-sm"
          id="payment-message"
        >
          {message}
        </div>
      )}
      <Button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Processing...
          </span>
        ) : (
          `Pay ${amount ? `₹${amount}` : "Now"}`
        )}
      </Button>
    </form>
  );
}
