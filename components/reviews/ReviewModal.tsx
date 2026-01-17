"use client";

import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionTitle: string;
  sessionId: string;
}

export default function ReviewModal({
  isOpen,
  onClose,
  sessionTitle,
  sessionId,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setLoading(true);
    // Mock API call for now since backend doesn't have review endpoint yet
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Review submitted:", { sessionId, rating, comment });
      alert("Thank you for your feedback!");
      onClose();
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Failed to submit review", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-zinc-900">Rate Session</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:bg-zinc-100 p-2 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-zinc-500 mb-6">
          How was <strong>{sessionTitle}</strong>?
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredStar || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-zinc-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-32 px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f46150]/20 focus:border-[#f46150] resize-none"
            placeholder="Write your review here (optional)..."
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
