import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/onboarding(.*)",
  "/home(.*)",
  "/two-futures(.*)",
  "/profile(.*)",
  "/api/(.*)",
  "/manifest.json",
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow seamless access to all public app routes
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|png|jpg|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
