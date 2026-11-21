import { NextResponse, type NextRequest } from "next/server";
import { getDb, isDatabaseConfigured } from "@/db/client";
import { SESSION_TTL_MS, validateSession } from "@/server/auth/core";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/server/auth/cookie";

/** Pages anyone may open. Everything else needs a valid session. */
const PUBLIC_PATHS = new Set(["/signin", "/setup", "/reset", "/api/version"]);

/**
 * Checks the session on every page request before anything renders. A valid
 * session has its cookie refreshed, so it lasts 90 days from your latest visit.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token && isDatabaseConfigured() ? await validateSession(getDb(), token) : null;

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.search = pathname === "/" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
    const response = NextResponse.redirect(url);
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  const response = NextResponse.next();
  response.cookies.set(SESSION_COOKIE, token!, {
    ...SESSION_COOKIE_OPTIONS,
    expires: new Date(Date.now() + SESSION_TTL_MS),
  });
  return response;
}

export const config = {
  // Skip Next.js internals, the manifest, icons and other static files.
  matcher: ["/((?!_next/|icons/|manifest\\.webmanifest|icon\\.svg|apple-icon\\.png|favicon\\.ico|robots\\.txt).*)"],
};
