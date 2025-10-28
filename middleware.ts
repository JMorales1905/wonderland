// ==========================================
// FILE 2: middleware.ts (in root directory)
// ==========================================
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/templates/:path*",
    "/dashboard",
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};