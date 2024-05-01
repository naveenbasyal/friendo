import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import {
  apiAuthPrefix,
  authRoutes,
  Default_Redirect,
  publicRoutes,
} from "./routes";
import { getSession, updateSession } from "./lib/lib";
import { getUser } from "./actions/user";

export { default } from "next-auth/middleware";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await getSession();

  const { nextUrl } = request;
  console.log("request hit on ", nextUrl.pathname);
  const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  if (isApiAuthRoutes) return null;

  // Is AuthRoute?
  if (isAuthRoute) {
    //If session is not present, then let them go to the auth route
    if (!session) {
      return NextResponse.next();
    }
    // If session is present, restrict them from going to the auth routes
    return NextResponse.redirect(new URL(Default_Redirect, nextUrl));
  }
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
  return null;
}

// it invokes middlware on paths that match the config
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
