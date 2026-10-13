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

    const role = token.role as string;

    // Head admin keeps a permanent password — no forced change redirect.
    if (
      role !== "HEAD_ADMIN" &&
      token.mustChangePassword &&
      path !== "/change-password"
    ) {
      return NextResponse.redirect(new URL("/change-password", req.url));
    }

    if (path.startsWith("/admin")) {
      if (role !== "HEAD_ADMIN" && role !== "SUB_ADMIN" && role !== "TEACHER") {
        return NextResponse.redirect(new URL("/portal", req.url));
      }
      // Teachers land on a dedicated desk; admin students/results remain reachable.
      if (role === "TEACHER") {
        if (path === "/admin" || path === "/admin/") {
          return NextResponse.redirect(new URL("/portal/teacher", req.url));
        }
        const allowed =
          path.startsWith("/admin/students") || path.startsWith("/admin/results");
        if (!allowed) {
          return NextResponse.redirect(new URL("/portal/teacher", req.url));
        }
      }
    }

    if (path.startsWith("/portal/teacher") && role !== "TEACHER") {
      return NextResponse.redirect(new URL("/portal", req.url));
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
