export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/properties/:path*", "/tenants/:path*", "/payments/:path*", "/reports/:path*", "/settings/:path*", "/messages/:path*", "/admin/:path*"],
};
