"use server";
import { UserType } from "@/types";
import { SignJWT, KeyLike, jwtVerify } from "jose";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, secretKey, {
    algorithms: ["HS256"],
  });

  return payload;
}

export const logout = () => {
  // destroy the cookie
  cookies().set("session", "", { expires: new Date(0) });
  redirect("/login");
};

export const getSession = async () => {
  const session = cookies().get("session")?.value;

  if (!session) return null;
  return await decrypt(session);
};

export const updateSession = async (req: NextRequest) => {
  const session = await getSession();

  if (!session) return null;
  // const parsed = await decrypt(session);
  const parsed: any = session;

  const expires = new Date();
  expires.setDate(expires.getDate() + 30);

  parsed.expires = expires;

  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires,
  });
  return res;
};

export const createSession = async (user: UserType) => {
  // create the session
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);

  const session = await encrypt({ ...user, expires });
  // save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
  redirect("/home");
};
