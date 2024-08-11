import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Image from "next/image";
import React from "react";
import { MdOutlineExplore } from "react-icons/md";

const Explore = async () => {
  await dbConnect();
  const users = await User.find();

  return (
    <section className="explore">
      <div className="text-2xl font-bold flex items-center gap-x-2">
        Discover People <MdOutlineExplore className="text-yellow-600" />
      </div>
      {users?.map((user, index) => {
        return (
          <div key={index} className="user flex gap-x-4 items-center">
            <div className="avatar">
              <Image
                src={user?.avatar ?? ""}
                width={30}
                height={30}
                alt={user?.username}
              />
            </div>
            <div className="details">
              <div className="name">{user?.username}</div>
              <div className="location">{user?.location?.country}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Explore;
