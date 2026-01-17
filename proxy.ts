
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/user") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
     if (pathname.startsWith("/admin")) {
    const token = await getToken({ req });

    if (!token?.userId || token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/login" , "/admin/:path*"],
};
