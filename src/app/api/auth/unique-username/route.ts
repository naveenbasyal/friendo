import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UserNameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = { username: searchParams.get("username") };
    // validate username
    const validateUsername = UserNameQuerySchema.safeParse(queryParam);
    console.log("validateUsername", validateUsername);
    if (!validateUsername.success) {
      const errors = validateUsername.error.format().username?._errors || [];
      return NextResponse.json(
        {
          message: errors.length > 0 ? errors.join(", ") : "Invalid username",
          success: false,
        },
        { status: 400 }
      );
    }

    const { username } = validateUsername.data;

    // check if username exists in the database || check if username exists in the database with case-insensitive
    const checkUsername = await User.findOne({ username });

    const response: ApiResponse = checkUsername
      ? {
          message: "Username already exists",
          success: false,
        }
      : {
          message: "Username is available",
          success: true,
        };

    return NextResponse.json(response);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      {
        message: "Error while checking username availability",
        success: false,
      },
      { status: 500 }
    );
  }
}
