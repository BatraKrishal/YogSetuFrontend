"use client";

import { useAuthStore } from "@/store/auth.store";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming sonner is installed or we use simple alert for now.
// Actually, I don't see sonner in package.json context, I'll stick to simple state or just the button.

export function EmailVerificationBanner() {
  const { user, resendVerification } = useAuthStore();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!user || user.isEmailVerified) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerification();
      setSent(true);
      // Reset sent message after 5 seconds
      setTimeout(() => setSent(false), 5000);
    } catch (error) {
      console.error("Failed to resend verification", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-orange-50 border-b border-orange-200 px-6 py-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-orange-800">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">
            Your email is not verified. Some features like booking and wallet
            are restricted.
          </p>
        </div>
        <button
          onClick={handleResend}
          disabled={sending || sent}
          className="text-sm font-bold text-orange-700 hover:text-orange-900 underline disabled:opacity-50 disabled:no-underline whitespace-nowrap"
        >
          {sent
            ? "Verification email sent!"
            : sending
            ? "Sending..."
            : "Resend Verification Email"}
        </button>
      </div>
    </div>
  );
}
