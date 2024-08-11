import { MdOutlineInterests } from "react-icons/md";
import { GearIcon, PersonIcon } from "@radix-ui/react-icons";
import { FaLanguage } from "react-icons/fa";

export const routes = [
  {
    path: "/profile",
    name: "Profile",
    icon: PersonIcon,
  },
  {
    path: "/settings/languages",
    name: "Languages",
    icon: FaLanguage,
  },
  {
    path: "/settings/interests",
    name: "Interests",
    icon: MdOutlineInterests,
  },
  {
    path: "/settings/preferences",
    name: "preferences",
    icon: PersonIcon,
  },
  {
    path: "/settings",
    name: "Settings",
    icon: GearIcon,
  },
];
