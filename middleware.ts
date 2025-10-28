// ==========================================
// middleware.ts - Fixed version
// ==========================================
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Protect these specific routes
    "/templates/:path*",
    "/dashboard",
    // Protect root but exclude auth, api, and static files
    "/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};