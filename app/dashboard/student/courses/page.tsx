"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Session } from "@/types";
import { CourseCard } from "@/components/courses/CourseCard";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CoursesPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const data = await api.getSessions();
        setSessions(data);
        setFilteredSessions(data);
      } catch (error: any) {
        if (error?.status === 403) {
          console.warn("Sessions access restricted (Email likely unverified).");
        } else {
          console.error("Failed to fetch sessions", error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = sessions.filter((session) => {
      const matchesSearch =
        session.title?.toLowerCase().includes(lowerQuery) ||
        session.instructor?.name?.toLowerCase().includes(lowerQuery) ||
        false; // Add other fields if needed

      return matchesSearch;
    });
    setFilteredSessions(filtered);
  }, [searchQuery, sessions]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f46150] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Explore Courses</h1>
          <p className="mt-2 text-zinc-500">
            Find the perfect yoga session for your journey.
          </p>
        </div>

        {/* Search & Filter Actions */}
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by title or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#f46150] focus:ring-1 focus:ring-[#f46150] md:w-64"
            />
          </div>
          {/* Future: Add advanced filter dropdown here */}
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Course Grid */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.map((session) => (
            <CourseCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50">
          <p className="text-zinc-500">No sessions match your search.</p>
          <Button
            variant="ghost"
            className="mt-2 text-[#f46150]"
            onClick={() => setSearchQuery("")}
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}
