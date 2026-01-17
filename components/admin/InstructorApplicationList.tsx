"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, Check, X, FileText, Video, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

type Application = {
  id: string;
  user: { id: string; email: string };
  bio: string;
  certificates: string[];
  demoVideos: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewNotes?: string;
  createdAt: string;
};

export default function InstructorApplicationList({
  limit,
  showPendingOnly = false,
}: {
  limit?: number;
  showPendingOnly?: boolean;
}) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const data = await api.getInstructorApplications();
      let filtered = data;
      if (showPendingOnly) {
        filtered = data.filter((app) => app.status === "PENDING");
      }

      // Sort by date desc
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      if (limit) {
        filtered = filtered.slice(0, limit);
      }
      setApplications(filtered);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [limit, showPendingOnly]);

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this instructor?")) return;
    setProcessingId(id);
    try {
      await api.approveInstructorApplication(id);
      // Refresh list
      await fetchApplications();
    } catch (error) {
      console.error("Failed to approve", error);
      alert("Failed to approve application");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const notes = prompt("Enter rejection reason (optional):");
    if (notes === null) return; // Cancelled

    setProcessingId(id);
    try {
      await api.rejectInstructorApplication(id, notes);
      // Refresh list
      await fetchApplications();
    } catch (error) {
      console.error("Failed to reject", error);
      alert("Failed to reject application");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-zinc-500">
          No {showPendingOnly ? "pending" : ""} instructor applications found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id} className="overflow-hidden">
          <div className="p-4 sm:p-6 bg-white flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    app.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : app.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {app.status}
                </span>
                <span className="text-sm text-zinc-500">
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900">
                  {app.user.email}
                </h3>
                <p className="text-sm text-zinc-600 mt-1 line-clamp-3">
                  {app.bio}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {app.certificates.map((cert, idx) => (
                  <a
                    key={idx}
                    href={cert}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-50 text-xs text-blue-600 rounded border border-zinc-200 hover:bg-zinc-100"
                  >
                    <FileText className="h-3 w-3" /> Cert {idx + 1}
                  </a>
                ))}
                {app.demoVideos.map((video, idx) => (
                  <a
                    key={idx}
                    href={video}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-50 text-xs text-purple-600 rounded border border-zinc-200 hover:bg-zinc-100"
                  >
                    <Video className="h-3 w-3" /> Video {idx + 1}
                  </a>
                ))}
              </div>
            </div>

            {app.status === "PENDING" && (
              <div className="flex sm:flex-col gap-2 shrink-0">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-28"
                  onClick={() => handleApprove(app.id)}
                  disabled={!!processingId}
                >
                  {processingId === app.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {" "}
                      <Check className="h-4 w-4 mr-1" /> Approve{" "}
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-28"
                  onClick={() => handleReject(app.id)}
                  disabled={!!processingId}
                >
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
