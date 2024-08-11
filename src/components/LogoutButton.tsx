"use client";
import React from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { logout } from "@/lib/lib";

const LogoutButton = () => {
  return (
    <span
      className="flex text-red-500  text-sm p-2 cursor-pointer gap-x-2 items-center"
      onClick={() => {
        console.log("logout clicked");
        // it is done in england and t
        logout();
      }}
    >
      <IoLogOutOutline />
      Logout
    </span>
  );
}; 

export default LogoutButton;
