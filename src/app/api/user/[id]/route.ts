import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: any }) {
  await dbConnect();
  const id = params?.id;

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
