import React from "react";
import { Redressed } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/lib";

const redressed = Redressed({
  subsets: ["latin"],
  weight: ["400"],
});

const Navbar = async () => {
  const session = (await getSession())?._doc;

  return (
    <nav className="w-full flex items-center p-3 bg-slate-800 justify-between">
      <div className="brand flex items-center gap-x-4 text-3xl">
        <div className="logo">
          <Image
            src="/logo.png"
            alt="logo"
            width={35}
            height={35}
            className="rounded-full"
          />
        </div>
        <div className={`${redressed.className}`}>
          <Link href={"/home"}>Friendo</Link>
        </div>
      </div>
      <div className="extras">
        <Image
          src={session?.avatar}
          alt="user"
          width={30}
          height={30}
          className="rounded-full "
        />
      </div>
    </nav>
  );
};

export default Navbar;
