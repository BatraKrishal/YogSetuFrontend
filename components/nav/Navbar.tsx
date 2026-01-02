import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="absolute z-100 w-full text-white flex px-8 justify-between items-center">
      <div>
        <Link href={"/"}>
        <Image
          src="/logos/logo.png"
          alt="YogSetu logo"
          width={160}
          height={160}
          priority
          className="select-none"
        />
        </Link>
      </div>
      <div className="flex">
        <p className="p-2"><Link href={"#"} className="border-b-2 border-transparent transition-all duration-300 hover:border-white">Pricing</Link></p>
        <p className="p-2"><Link href={"#"} className="border-b-2 border-transparent transition-all duration-300 hover:border-white">About Us</Link></p>
      </div>
      <div className="flex ">
        <div><Link href={"/login"}><button className="bg-white/20 hover:bg-white/40 transition duration-300 text-white px-3 py-1.5 rounded-lg my-5 cursor-pointer font-semibold mx-1">Log in</button></Link></div>
        <div><Link href={"#"}><button className="bg-[#f46150] transition duration-300 hover:bg-[#c14f42] text-white px-3 py-1.5 rounded-lg my-5 font-semibold mx-1">Book a free session</button></Link></div>
      </div>
    </div>
  );
};
