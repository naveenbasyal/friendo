"use client";
import { Button } from "@/components/ui/button";

import { Label } from "@radix-ui/react-label";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { UserType } from "@/types";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

const VerifyUser = () => {
  const router = useRouter();
  const user: UserType = JSON.parse(localStorage.getItem("userbackup") || "{}");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({
    username: user?.username,
    email: user?.email,
    verifyCode: "",
  });

  const handleVerifyUser = async () => {
    const { username, email, verifyCode } = value;
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }
    if (verifyCode.trim().length < 6) {
      toast.error("Please enter a valid verification code");
      return;
    }
    if (!email.trim().length || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verifyCode, username }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        console.log("data", data);
        router.push("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Error while verifying code, please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full space-y-5 flex flex-col items-center justify-center p-4">
      <div className="border rounded-md  lg:w-full p-5 space-y-4">
        <Label htmlFor="otp" className="text-lg font-medium">
          Verify Email
        </Label>
        <InputOTP
          disabled={loading}
          maxLength={6}
          className="w-full flex justify-center"
          value={value.verifyCode}
          onChange={(e) => {
            setValue({ ...value, verifyCode: e });
          }}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button
          disabled={loading || value.verifyCode.length !== 6}
          onClick={handleVerifyUser}
          variant="default"
          className="w-full flex items-center gap-x-2"
        >
          Verify
          {loading && <ReloadIcon className="w-3 h-3 animate-spin" />}
        </Button>
        <p className="text-sm opacity-50">
          Please check your email. The passcode will expire in 1 hour.
        </p>
      </div>
    </div>
  );
};

export default VerifyUser;
