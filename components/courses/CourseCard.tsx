import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User as UserIcon } from "lucide-react";
import { Session } from "@/types";
import { Button } from "@/components/ui/Button";

interface CourseCardProps {
  session: Session;
}

export const CourseCard = ({ session }: CourseCardProps) => {
  const formattedDate = new Date(session.startTime).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      weekday: "short",
    }
  );

  const formattedTime = new Date(session.startTime).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-[#f46150]/30">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
        <Image
          src={session.image || "/Home/Hero.webp"} // Fallback image
          alt={session.title || "Yoga Session"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-[#f46150] backdrop-blur-sm">
          ₹{session.price}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-bold text-zinc-900 line-clamp-1">
            {session.title}
          </h3>
          <p className="text-sm text-zinc-500 line-clamp-2">
            {session.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <UserIcon className="h-4 w-4 text-[#f46150]" />
            <span className="font-medium">
              {session.instructor?.name || "Instructor"}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Calendar className="h-4 w-4 text-zinc-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Clock className="h-4 w-4 text-zinc-400" />
              <span>{formattedTime}</span>
            </div>
          </div>

          <Link
            href={`/dashboard/courses/${session.id}`}
            className="block mt-4"
          >
            {/* Using width full via className on Button component if possible, else wrapper */}
            <Button className="w-full" variant="outline">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
