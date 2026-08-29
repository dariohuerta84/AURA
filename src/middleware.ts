import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple passthrough middleware - Clerk is initialized via ClerkProvider in layout.tsx
// using environment variables directly (no dynamic keys in edge runtime)
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|png|jpg|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
