import { dbConnect } from "@/lib/dbConnect";

import User from "@/models/User";
import { ApiResponse } from "@/types";
import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  const session = cookies().get("session")?.value; // getting undefined
  const session_1 = req.cookies.get("session")?.value; //getting undeined
  console.log("get all", cookies().getAll());
  console.log("session>>>>>>>>>>>>>>>>>>>>>>>>>>", session); // getting undefined

  if (!session && !session_1)
    return NextResponse.json(
      { message: "User not found" },
      {
        status: 404,
      }
    );

  const id = JSON.parse(session as string)?.id;
  console.log("id", id); // getting undefined

  try {
    const user = await User.findById(id);
    if (!user) {
      const response: ApiResponse = {
        message: "User not found",
        success: false,
      };
      return NextResponse.json(response, { status: 404 });
    }
    const response: ApiResponse = {
      message: "User found",
      success: true,
      data: user,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
