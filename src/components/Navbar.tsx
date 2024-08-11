import React from "react";
import { Redressed } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CiLocationOn } from "react-icons/ci";
import { GearIcon, PersonIcon } from "@radix-ui/react-icons";
import LogoutButton from "./LogoutButton";

const redressed = Redressed({
  subsets: ["latin"],
  weight: ["400"],
});

const Navbar = async () => {
  const { _doc: session } = await getSession();

  return (
    <nav className="w-full flex items-center p-3 border-b justify-between px-10">
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
      <div className="extras flex gap-x-5 items-center">
        <div className="links">
          <Link href={"/explore"}>Explore</Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image
              src={session?.avatar}
              alt="user"
              width={40}
              height={40}
              className="rounded-full cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem className="flex items-center gap-x-4">
              <Image
                src={session?.avatar}
                alt="user"
                width={50}
                height={50}
                className="rounded-full cursor-pointer"
              />
              <div className="flex flex-col">
                <div className="text-[.95rem] font-medium">
                  {session?.username}
                </div>

                <div className="flex items-center gap-x-1 font-normal">
                  <CiLocationOn />
                  {session?.location?.country}
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link
                href={"/profile"}
                className="flex gap-x-2 items-center pl-1"
              >
                <PersonIcon />
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>

              <Link
                href={"/settings"}
                className="flex gap-x-2 items-center pl-1"
              >
                <GearIcon />
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
