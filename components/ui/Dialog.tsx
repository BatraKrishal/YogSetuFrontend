"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Since this is a simple implementation, we'll keep it basic without Radix for now if it's not installed.
// Assuming "Dialog" refers to a modal implementation.

/* 
  If the user is using Radix UI or a specific library, we should use that. 
  However, based on previous files, I'll create a simple handcrafted Dialog/Modal 
  unless I see package.json suggests otherwise. 
*/

export const Dialog = ({
  isOpen,
  onClose,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={cn(
          "bg-white rounded-2xl w-full max-w-lg shadow-xl relative animate-in zoom-in-95 duration-200",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
