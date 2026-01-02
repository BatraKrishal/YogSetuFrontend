import React from "react";

/**
 * Primary action button
 */
export default function PrimaryButton({
  loading,
  loadingText = "Please wait...",
  children,
  ...props
}: {
  loading: boolean;
  loadingText?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded bg-[#f46150] py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}
