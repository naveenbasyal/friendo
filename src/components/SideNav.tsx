"use client";
import { routes } from "@/configs/sidenav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const SideNav = () => {
  const path = usePathname();

  return (
    <div className="space-y-4 flex flex-col">
      {routes?.map((route, index) => {
        const Icon = route.icon;
        return (
          <Link
            key={index}
            href={route.path}
            className={` py-2 
              ${
                path === route.path
                  ? "text-gray-100"
                  : "text-gray-500 hover:text-gray-100 "
              }
              
              `}
          >
            <div className="flex items-center gap-x-2 capitalize">
              <Icon />
              {route.name}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SideNav;
