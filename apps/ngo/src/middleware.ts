import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    if (!token || token.status !== "ACTIVE") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.mustChangePassword && path !== "/change-password") {
      return NextResponse.redirect(new URL("/change-password", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/admin") || path.startsWith("/change-password")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/change-password"],
};
