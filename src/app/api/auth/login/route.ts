import { createSession } from "@/lib/lib";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { ApiResponse } from "@/types";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { otp, email, uniqueId } = await req.json();

    const otpData = await Otp.findOne({ uniqueId });

    if (!otpData) {
      return NextResponse.json(
        {
          message: "Invalid Otp",
          success: false,
        },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          message: "Your email is not registered with us. Please sign up.",
          success: false,
        },
        { status: 404 }
      );
    }

    if (otpData.otp !== otp || otpData.email !== email) {
      return NextResponse.json(
        {
          message: "Invalid Otp or email. Please try again.",
          success: false,
        },
        { status: 400 }
      );
    }
    // check expirty
    if (otpData.expiry < new Date()) {
      return NextResponse.json(
        {
          message: "Otp has expired. Please request a new one.",
          success: false,
        },
        { status: 400 }
      );
    }

    // delete otp
    await Otp.deleteOne({ email, uniqueId });

    const response: ApiResponse = {
      message: "Otp verified successfully",
      success: true,
      data: { user },
    };
    await createSession(user);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      {
        message: "Failed to send Otp",
        success: false,
      },
      { status: 500 }
    );
  }
}
