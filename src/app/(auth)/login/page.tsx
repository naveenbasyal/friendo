"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CiMail } from "react-icons/ci";
import { FaFacebookSquare, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import Link from "next/link";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { createSession } from "@/lib/lib";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<any>();
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const sendOtp = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        toast.success(data.message);
        localStorage.setItem("id", data.data.id);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error", error);
      toast.error(
        "An error occured while sending otp. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp,
          email,
          uniqueId: localStorage.getItem("id"),
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        localStorage.removeItem("id");
        const user = data.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        router.push("/home");
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("An error occured while logging in. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-5 w-full">
      <div className="border bg-[#09090b] rounded-md p-4 md:px-6 md:py-8">
        <div className="space-y-3">
          <div className="mb-5 space-y-2">
            <h1
              className={`text-start text-2xl font-medium text-slate-800 dark:text-slate-300`}
            >
              Sign in to get started
            </h1>
            <p className="text-slate-600 text-sm dark:text-slate-400 flex items-center gap-x-2">
              Please use your registered email to sign in.
            </p>
          </div>

          {/* _______ Sign In with Email ______ */}
          <div className="w-full space-y-3">
            {otpSent ? (
              <>
                <Label htmlFor="otp">Enter Otp</Label>
                <InputOTP
                  disabled={loading}
                  maxLength={6}
                  className="w-full flex justify-center"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e);
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
                <Label className="text-green-500 text-sm">
                  Otp has been sent to your email.
                </Label>

                <Button
                  disabled={loading || otp?.length !== 6}
                  onClick={handleLogin}
                  variant="default"
                  className="w-full flex items-center gap-x-2"
                >
                  Login
                  {loading && <ReloadIcon className="w-3 h-3 animate-spin" />}
                </Button>
                <p className="text-sm opacity-80 flex items-center">
                  Please check your email. The otp will expire in 1 hour
                </p>
              </>
            ) : (
              <>
                <Label
                  htmlFor="email"
                  className="flex items-center gap-x-1 md:gap-x-2"
                >
                  <CiMail />
                  Email
                </Label>
                <div className="md:flex items-center gap-x-2 space-y-4 md:space-y-0">
                  <Input
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    autoComplete="off"
                    disabled={loading || otpSent}
                    placeholder="Enter your email"
                    className="w-full "
                  />
                  <Button
                    variant="default"
                    className="w-full md:w-auto flex items-center gap-x-2"
                    disabled={loading || email === ""}
                    onClick={sendOtp}
                  >
                    Send OTP{" "}
                    {loading ? (
                      <ReloadIcon className="w-3 h-3 animate-spin" />
                    ) : null}
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className="text-center text-sm">or</div>

          {/* ___________ OAUTH ____________ */}
          <div className="oauth space-y-3 border-t border-b py-4 ">
            {/*_____ Google _____*/}

            <div className="google flex justify-between w-full">
              <div className="flex items-center gap-x-2 md:gap-x-4">
                <FcGoogle />
                <span>Google</span>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  toast.info("Coming soon");
                }}
              >
                Connect
              </Button>
            </div>
            {/* _____ Github _____ */}

            <div className="github flex justify-between w-full">
              <div className="flex items-center gap-x-2 md:gap-x-4">
                <FaGithub />
                Github
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  toast.info("Coming soon");
                }}
              >
                Connect
              </Button>
            </div>
            {/* _____ Facebook _____ */}

            <div className="facebook flex justify-between w-full">
              <div className="flex items-center gap-x-2 md:gap-x-4">
                <FaFacebookSquare />
                Facebook
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  toast.info("Coming soon");
                }}
              >
                Connect
              </Button>
            </div>
          </div>

          <div className="extras opacity-90">
            New to <span className="text-yellow-500">Friendo</span>?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
