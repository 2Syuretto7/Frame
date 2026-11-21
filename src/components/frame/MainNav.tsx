"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { describeThisDevice } from "@/server/auth/actions";
import { House, Settings2, Waypoints, type LucideIcon } from "lucide-react";
import { cx } from "@/components/midnight/cx";

interface Item {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Whether a path belongs to this section. Lessons sit inside the map's section. */
  matches(path: string): boolean;
}

const ITEMS: Item[] = [
  { href: "/", label: "Home", icon: House, matches: (p) => p === "/" },
  {
    href: "/map",
    label: "Map",
    icon: Waypoints,
    matches: (p) => p.startsWith("/map") || p.startsWith("/learn"),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings2,
    matches: (p) => p.startsWith("/settings"),
  },
];

/** Labelled links to the three places in Frame, with the current one marked. */
export function MainNav() {
  const path = usePathname() ?? "/";

  // Once per visit, tell the server what kind of device this is, so Settings names it correctly.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("frame-device-described")) return;
      sessionStorage.setItem("frame-device-described", "1");
    } catch {
      // Storage can be refused in private browsing; describing the device again is harmless.
    }
    describeThisDevice(navigator.maxTouchPoints ?? 0).catch(() => {});
  }, []);
  return (
    <nav aria-label="Main">
      {/* The last label lines up with the column's right edge, like the wordmark does on the left. */}
      <ul className="m-0 -mr-2 flex list-none items-center gap-1 p-0 sm:-mr-3">
        {ITEMS.map(({ href, label, icon: Icon, matches }) => {
          const current = matches(path);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={cx(
                  "relative flex h-11 items-center gap-2 rounded-control px-2 text-[14px] leading-5 font-medium no-underline transition-colors sm:px-3",
                  current ? "text-ink" : "text-ink-secondary hover:bg-hover hover:text-ink",
                )}
              >
                <Icon size={16} strokeWidth={1.5} aria-hidden="true" className={current ? "text-accent" : undefined} />
                {label}
                {current ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2 bottom-0.5 h-0.5 rounded-round bg-accent sm:inset-x-3"
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
