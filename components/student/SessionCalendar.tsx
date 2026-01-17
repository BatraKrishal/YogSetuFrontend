"use client";

import { useState } from "react";
import { Booking } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SessionCalendarProps {
  bookings: Booking[];
}

export default function SessionCalendar({ bookings }: SessionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const getBookingsForDate = (day: number) => {
    return bookings.filter((booking) => {
      if (!booking.session) return false;
      const bookingDate = new Date(booking.session.startTime);
      return (
        bookingDate.getDate() === day &&
        bookingDate.getMonth() === currentDate.getMonth() &&
        bookingDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalSlots = Math.ceil((daysInMonth + firstDay) / 7) * 7;

    for (let i = 0; i < totalSlots; i++) {
      const dayNumber = i - firstDay + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;

      if (!isCurrentMonth) {
        days.push(
          <div
            key={i}
            className="h-24 bg-zinc-50/50 border border-zinc-100/50"
          />
        );
        continue;
      }

      const dateBookings = getBookingsForDate(dayNumber);

      days.push(
        <div
          key={i}
          className="h-24 bg-white border border-zinc-100 p-2 flex flex-col gap-1 transition-colors hover:bg-zinc-50"
        >
          <span
            className={`text-sm font-medium ${
              new Date().getDate() === dayNumber &&
              new Date().getMonth() === currentDate.getMonth() &&
              new Date().getFullYear() === currentDate.getFullYear()
                ? "bg-[#f46150] text-white h-6 w-6 rounded-full flex items-center justify-center"
                : "text-zinc-700"
            }`}
          >
            {dayNumber}
          </span>

          <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar">
            {dateBookings.map((b) => (
              <div
                key={b.id}
                className="text-[10px] px-1.5 py-1 rounded bg-orange-100 text-orange-700 font-medium truncate"
                title={b.session?.title || "Session"}
              >
                {new Date(b.session!.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" - "}
                {b.session?.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
      <div className="p-4 flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50">
        <h2 className="font-bold text-lg text-zinc-900">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-zinc-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-50"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 bg-zinc-100 gap-px border-b border-l border-zinc-200">
        {renderCalendarDays()}
      </div>
    </div>
  );
}
