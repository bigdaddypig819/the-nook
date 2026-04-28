import { NextResponse, type NextRequest } from "next/server";

// Kept in sync with ADMIN_COOKIE in lib/admin-auth.ts. Inlined here because
// proxy runs in the Edge runtime, which can't import node:crypto.
const ADMIN_COOKIE = "nook_admin";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  const cookie = req.cookies.get(ADMIN_COOKIE);
  if (!cookie?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  // Cryptographic verification happens in app/admin/layout.tsx via
  // isAdminAuthed(); a forged cookie that gets past this presence check
  // is still rejected there.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
