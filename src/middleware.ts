"use server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/register(.*)",
  "/login(.*)",
  "/api/uploadthing(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (
    req.headers.get("accept") &&
    req.headers.get("accept")?.includes("text/html")
  ) {
    return;
  }
  if (!isPublicRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
