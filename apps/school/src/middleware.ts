import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token || token.status !== "ACTIVE") {
      const login = new URL("/login", req.url);
      login.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(login);
    }

    if (token.mustChangePassword && path !== "/change-password") {
      return NextResponse.redirect(new URL("/change-password", req.url));
    }

    const role = token.role as string;

    if (path.startsWith("/admin")) {
      if (role !== "HEAD_ADMIN" && role !== "SUB_ADMIN" && role !== "TEACHER") {
        return NextResponse.redirect(new URL("/portal", req.url));
      }
      // Teachers: dashboard, student view, and results only (server actions still enforce permissions)
      if (role === "TEACHER") {
        const allowed =
          path === "/admin" ||
          path.startsWith("/admin/students") ||
          path.startsWith("/admin/results");
        if (!allowed) {
          return NextResponse.redirect(new URL("/admin/results", req.url));
        }
      }
    }

    if (path.startsWith("/portal/student") && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/portal", req.url));
    }

    if (path.startsWith("/portal/parent") && role !== "PARENT") {
      return NextResponse.redirect(new URL("/portal", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const protectedPrefixes = ["/admin", "/portal", "/change-password"];
        if (!protectedPrefixes.some((p) => path.startsWith(p))) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/change-password"],
};
