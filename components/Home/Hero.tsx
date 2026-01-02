import Image from "next/image";

export const Hero = () => {
  return (
    <div className="min-h-screen bg-zinc-50 text-white">
      <div className="relative w-screen h-screen overflow-hidden">
        <Image
          src="/Home/Hero.webp"
          alt="Hero background"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
        <div className="absolute left-10 bottom-5">
          <h1 className="text-8xl mb-3 text-white">
            Learn yoga with <br />
            the{" "}
            <span className="text-[#f46150]">&quot;Right Teacher&quot;</span>
          </h1>
          <q className="text-3xl text-white/60">
            Discover verified instructors matched to your goals
          </q>
          <div>
            <button className="bg-[#f46150] text-white px-6 py-3 rounded-lg my-5 font-bold">
              Book a free session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
