import { EmailTemplate } from "@/components/email-template";
import { ApiResponse, SendEmailProps } from "@/types";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail({
  username,
  email,
  verifyCode,
}: SendEmailProps) {
  try {
    const data = await resend.emails.send({
      from: "Friendo <onboarding@resend.dev>",
      to: email,
      subject: "Friendo Email Verfication Code",
      text: `Hello, ${username}! Your verification code is ${verifyCode}`,
      react: EmailTemplate({ username, verifyCode }),
    });
    if (data.error) {
      const response: ApiResponse = {
        message: "Failed to send email",
        success: false,
      };
      return NextResponse.json(response, { status: 500 });
    }
    return true;
  } catch (error) {
    return NextResponse.json({ error });
  }
}
