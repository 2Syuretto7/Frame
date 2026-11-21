export interface DeviceHint {
  /** navigator.maxTouchPoints, which tells an iPad apart from a Mac. */
  touchPoints?: number;
}

/**
 * A short, human label for a device, such as "Safari on iPhone". iPads ask for the
 * desktop version of sites and so describe themselves as a Mac; the touch-point
 * count from the browser, when we have it, tells the two apart.
 */
export function deviceLabelFor(userAgent: string, hint: DeviceHint = {}): string {
  const ua = userAgent || "";
  const touch = (hint.touchPoints ?? 0) > 1;
  const device = /iPad/.test(ua)
    ? "iPad"
    : /iPhone/.test(ua)
      ? "iPhone"
      : /Android/.test(ua)
        ? /Mobile/.test(ua)
          ? "Android phone"
          : "Android tablet"
        : /Macintosh|Mac OS X/.test(ua)
          ? /Mobile/.test(ua) || touch
            ? "iPad"
            : "Mac"
          : /Windows/.test(ua)
            ? "Windows PC"
            : /CrOS/.test(ua)
              ? "Chromebook"
              : /Linux/.test(ua)
                ? "Linux computer"
                : "an unknown device";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\/|FxiOS/.test(ua)
        ? "Firefox"
        : /CriOS|Chrome\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Browser";
  return `${browser} on ${device}`;
}
