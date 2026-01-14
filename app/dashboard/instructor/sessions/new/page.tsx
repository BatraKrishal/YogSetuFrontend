"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateSessionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    duration: 60, // minutes
    price: 500,
    capacity: 20,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Construct ISO strings
      // Combine date + time
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(
        startDateTime.getTime() + formData.duration * 60000
      );

      await api.createSession({
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        price: Number(formData.price),
        capacity: Number(formData.capacity),
      });

      // Redirect to list
      router.push("/dashboard/instructor/sessions");
    } catch (err: any) {
      console.error("Failed to create session", err);
      setError(err.message || "Failed to create session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard/instructor/sessions"
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Sessions
      </Link>

      <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">
          Create New Session
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Date</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f46150] focus:border-transparent"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                Start Time
              </label>
              <input
                type="time"
                required
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f46150] focus:border-transparent"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Duration (minutes)
            </label>
            <select
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f46150] focus:border-transparent"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: Number(e.target.value) })
              }
            >
              <option value={30}>30 mins</option>
              <option value={45}>45 mins</option>
              <option value={60}>60 mins (1 hour)</option>
              <option value={90}>90 mins (1.5 hours)</option>
              <option value={120}>120 mins (2 hours)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                Price (₹)
              </label>
              <input
                type="number"
                required
                min={0}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f46150] focus:border-transparent"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                Capacity (Students)
              </label>
              <input
                type="number"
                required
                min={1}
                max={100}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f46150] focus:border-transparent"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Publish Session
            </Button>
            <Link
              href="/dashboard/instructor/sessions"
              className="w-full md:w-auto"
            >
              <Button variant="ghost" type="button" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
