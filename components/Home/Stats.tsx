"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { RotatingRangoli } from "../ui/RotatingRangoli";

export const Stats = () => {
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRunKey((prev) => prev + 1);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);

    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  return (
    <section
      ref={statsRef}
      className="relative overflow-hidden bg-zinc-50 text-black py-24"
    >
      {/* Decorative Rangoli layer */}
      <div className="hidden pointer-events-none absolute inset-0 lg:flex items-center justify-between opacity-40">
        <div className="-translate-x-3/5">
          <RotatingRangoli className="animate-[spin-slow_150s_linear_infinite]" />
        </div>
        <div className="translate-x-3/5">
          <RotatingRangoli className="animate-[spin-slow_150s_linear_infinite_reverse]" />
        </div>
      </div>

      {/* Actual content */}
      <div className="relative z-10">
        <div className="text-[#f46150] text-center text-xl font-semibold">
          Welcome to Yogsetu!
        </div>

        <div className="text-5xl text-center mt-2">
          Trusted by <span className="font-bold">50,000+ students</span>
        </div>

        <p className="text-center text-lg pt-2 opacity-70 max-w-2xl mx-auto">
          From the very origins of yogic practices to modern practices our
          tutors cover everything.
        </p>

        <div className="w-[80%] lg:w-[50%] text-white min-h-60 flex-col md:flex-row flex mx-auto mt-12">
          {/* Mentors */}
          <div className="bg-gray-800 md:w-1/3 rounded-2xl m-3 p-5">
            <div className="text-4xl text-center flex flex-col justify-center items-center h-full">
              <div className="font-bold">
                <CountUp key={runKey} end={10000} duration={2} />+
              </div>
              <div className="mt-2">Mentors Available</div>
            </div>
          </div>

          {/* Sessions */}
          <div className="bg-[#f46150] scale-105 md:w-1/3 rounded-2xl m-3 p-5">
            <div className="text-4xl text-center flex flex-col justify-center items-center h-full">
              <div className="font-bold">
                <CountUp key={runKey + 1} end={400000} duration={2} />+
              </div>
              <div className="mt-2">Sessions Booked</div>
            </div>
          </div>

          {/* Community */}
          <div className="bg-gray-800 md:w-1/3 rounded-2xl m-3 p-5">
            <div className="text-4xl text-center flex flex-col justify-center items-center h-full">
              <div className="font-bold">
                <CountUp key={runKey + 2} end={50000} duration={2} />+
              </div>
              <div className="mt-2">Community Members</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
