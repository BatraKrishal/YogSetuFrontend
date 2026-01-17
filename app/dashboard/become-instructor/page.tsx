"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Loader2, Plus, Trash2, Video, FileText } from "lucide-react";

export default function BecomeInstructorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    bio: string;
    certificates: string[];
    demoVideos: string[];
  }>({
    bio: "",
    certificates: [""],
    demoVideos: [""],
  });

  const handleArrayChange = (
    field: "certificates" | "demoVideos",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addField = (field: "certificates" | "demoVideos") => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeField = (field: "certificates" | "demoVideos", index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty strings
      const payload = {
        bio: formData.bio,
        certificates: formData.certificates.filter((s) => s.trim() !== ""),
        demoVideos: formData.demoVideos.filter((s) => s.trim() !== ""),
      };

      if (!payload.bio) {
        alert("Bio is required");
        setLoading(false);
        return;
      }

      if (
        payload.certificates.length === 0 ||
        payload.demoVideos.length === 0
      ) {
        alert("At least one certificate and one demo video are required");
        setLoading(false);
        return;
      }

      await api.applyToBecomeInstructor(payload);
      alert(
        "Application submitted successfully! Please wait for admin approval."
      );
      router.push("/dashboard/profile");
    } catch (error) {
      console.error("Application failed", error);
      alert("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">
          Become an Instructor
        </h1>
        <p className="text-zinc-500 mt-2">
          Share your expertise and start teaching on YogSetu.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-6 md:p-8 rounded-2xl border border-zinc-200"
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-900">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full h-32 px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f46150]/20 focus:border-[#f46150]"
            placeholder="Tell us about your yoga journey, experience, and teaching style..."
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-900 flex items-center gap-2">
            <FileText className="h-4 w-4" /> Certificates (URLs)
          </label>
          {formData.certificates.map((cert, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="url"
                value={cert}
                onChange={(e) =>
                  handleArrayChange("certificates", idx, e.target.value)
                }
                className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f46150]/20 focus:border-[#f46150]"
                placeholder="https://..."
              />
              {formData.certificates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField("certificates", idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("certificates")}
            className="text-sm text-[#f46150] font-medium flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Certificate
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-900 flex items-center gap-2">
            <Video className="h-4 w-4" /> Demo Videos (URLs)
          </label>
          {formData.demoVideos.map((video, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="url"
                value={video}
                onChange={(e) =>
                  handleArrayChange("demoVideos", idx, e.target.value)
                }
                className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f46150]/20 focus:border-[#f46150]"
                placeholder="https://youtube.com/..."
              />
              {formData.demoVideos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField("demoVideos", idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("demoVideos")}
            className="text-sm text-[#f46150] font-medium flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Video
          </button>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
