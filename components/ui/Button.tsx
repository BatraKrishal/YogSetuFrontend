import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",

          // Variants
          variant === "primary" &&
            "bg-[#f46150] text-white hover:bg-[#d95546] focus:ring-[#f46150]",
          variant === "secondary" &&
            "bg-zinc-800 text-white hover:bg-zinc-700 focus:ring-zinc-800",
          variant === "outline" &&
            "border-2 border-[#f46150] text-[#f46150] hover:bg-[#f46150]/10",
          variant === "ghost" &&
            "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",

          // Sizes
          size === "sm" && "h-9 px-3 text-sm",
          size === "md" && "h-11 px-6 text-base",
          size === "lg" && "h-14 px-8 text-lg",

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
