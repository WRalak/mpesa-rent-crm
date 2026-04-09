import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const publicRoutes = new Set(["/", "/login", "/register", "/verify-phone"]);
const adminRoutes = new Set(["/admin"]);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth);
  const isPublicRoute = publicRoutes.has(pathname);
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isLoggedIn && (pathname === "/login" || pathname === "/register" || pathname === "/verify-phone")) {
    // Redirect based on user role
    const userRole = req.auth?.user?.role;
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect admin routes
  if (isAdminRoute && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
