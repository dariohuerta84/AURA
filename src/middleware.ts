import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!pubKey || pubKey.trim() === "") {
    return NextResponse.next();
  }

  try {
    const { clerkMiddleware } = require("@clerk/nextjs/server");
    return clerkMiddleware({
      publishableKey: pubKey,
      secretKey: process.env.CLERK_SECRET_KEY,
    })(req, {} as any);
  } catch (e) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|png|jpg|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
