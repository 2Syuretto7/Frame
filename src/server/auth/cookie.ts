/**
 * Session cookie settings, shared by the proxy and server code.
 * In production the `__Host-` prefix makes the browser insist on HTTPS, this exact
 * host and the whole site path, so the cookie cannot be set or read anywhere else.
 */
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-frame-session" : "frame-session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
