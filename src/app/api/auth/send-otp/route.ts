import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { dbConnect } from "@/lib/dbConnect";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { email } = await req.json();

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
    // check if we already have an otp for this email
    const existingOtp = await Otp.findOne({ email });

    if (existingOtp) {
      // delete existing otp
      await Otp.deleteOne({ email });
    }

    // creating otp and unique id
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiry = new Date();
    expiry.setHours(new Date().getHours() + 1);
    const uniqueId = uuidv4();

    // saving otp to database
    const newOtp = await Otp.create({
      email,
      otp: otp.toString(),
      expiry,
      uniqueId,
    });
    await newOtp.save();

    // send email to user with otp
    const emailResponse = await sendVerificationEmail({
      email,
      verifyCode: otp,
      username: user.username,
    });
    console.log("emailResponse", emailResponse);

    if (!emailResponse) {
      const response: ApiResponse = {
        message: "Failed to send email",
        success: false,
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse = {
      message:
        "Otp has been sent to your email. Please check your email and enter the otp to verify your account.",
      success: true,
      data: { id: uniqueId },
    };
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
