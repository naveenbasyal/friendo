import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { ApiResponse, UserType } from "@/types";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { username, email, gender, location, languages, interests, birthday } =
    await req.json();

  try {
    const existingUser = await User.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setHours(new Date().getHours() + 1);

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          {
            message: `You are already registered !!`,
            success: false,
          },
          { status: 400 }
        );
      } else {
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = verifyCodeExpiry;
        await existingUser.save();

        // send mail to user with verify code
        await sendVerificationEmail({
          email,
          verifyCode,
          username,
        });

        return NextResponse.json(
          {
            message: `Verification code has been sent to your email address.`,
            success: true,
          },
          { status: 200 }
        );
      }
    }

    const newUser = await User.create({
      username,
      email,
      gender,
      verifyCode,
      verifyCodeExpiry,
      location: {
        country: location.country || "",
        state: location.state || "",
      },
      languages,
      interests,
      birthday,
    });
    await newUser.save();

    console.log("newUser", newUser);
    // TODO: send mail to user with verify code
    const emailResponse = await sendVerificationEmail({
      email,
      verifyCode,
      username,
    });
    if (!emailResponse) {
      return NextResponse.json(
        {
          message: `Failed to send email`,
          success: false,
        },
        { status: 500 }
      );
    }

    const response: ApiResponse = {
      message:
        "You have successfully signed up. Please verify your email address.",
      success: true,
    };
    console.log("response", response);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      {
        message: "Failed to sign up",
        success: false,
      },
      { status: 500 }
    );
  }
}
