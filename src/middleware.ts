import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin") || pathname.startsWith("/api/seed")) {
    if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
      return pathname.startsWith("/api/")
        ? NextResponse.json({ error: "Admin xizmati sozlanmagan" }, { status: 503 })
        : NextResponse.redirect(new URL("/account", request.url));
    }
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/seed")) {
    const token = request.cookies.get("gh_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Autentifikatsiya talab qilinadi" }, { status: 401 });
    }
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      if (payload.role !== "admin") {
        return NextResponse.json({ error: "Ruxsatsiz" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Sessiya tugagan" }, { status: 401 });
    }
  }

  // Protect admin page routes (redirect to login)
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("gh_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/account", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/seed/:path*"],
};
