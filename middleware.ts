// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Only protect template routes, NOT the homepage
    "/templates/:path*",
  ],
};