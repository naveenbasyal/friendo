import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { ApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { email, verifyCode, username } = await req.json();

    if (verifyCode.length !== 6) {
      return NextResponse.json(
        {
          message: "Invalid verification code",
          success: false,
        },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        {
          message: "User is already verified",
          success: false,
        },
        { status: 400 }
      );
    }
    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeExpired =
      user.verifyCodeExpiry && user.verifyCodeExpiry < new Date();

    if (!isCodeValid) {
      return NextResponse.json(
        {
          message: "Invalid verification code",
          success: false,
        },
        { status: 400 }
      );
    }

    // send new verification code
    if (isCodeExpired) {
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verifyCodeExpiry = new Date();
      verifyCodeExpiry.setHours(new Date().getHours() + 1);
      user.verifyCode = verifyCode;
      user.verifyCodeExpiry = verifyCodeExpiry;
      await user.save();

      // send mail to user with verify code
      const emailResponse = await sendVerificationEmail({
        email,
        verifyCode,
        username,
      });

      if (!emailResponse) {
        const response: ApiResponse = {
          message: "Failed to send email",
          success: false,
        };
        return NextResponse.json(response, { status: 500 });
      }
      return NextResponse.json(
        {
          message: `Your verification code has expired. A new verification code has been sent to ${email}`,
          success: true,
        },
        { status: 200 }
      );
    }

    user.isVerified = true;
    user.verifyCode = "";
    user.verifyCodeExpiry = new Date();
    await user.save();
    return NextResponse.json(
      {
        message: "Account verified successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error while verifying code", error);
    return NextResponse.json(
      {
        message: "Error while verifying code",
        success: false,
      },
      { status: 500 }
    );
  }
}
