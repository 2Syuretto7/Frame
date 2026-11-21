"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { describeThisDevice, signOut } from "@/server/auth/actions";
import { Menu } from "@/components/ui/Icons";
import { NavLinks } from "./NavLinks";

/** The account menu. Closes on Escape, on a click outside and on navigation. */
export function UserMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const path = usePathname();
  // Signing out asks once, in place, before it happens.
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [path]);

  useEffect(() => {
    const close = (focus: boolean) => {
      const el = ref.current;
      if (!el?.open) return;
      el.open = false;
      if (focus) el.querySelector("summary")?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onClick = (e: MouseEvent) => {
      // composedPath still holds the menu when the clicked button has just been replaced.
      if (ref.current && !e.composedPath().includes(ref.current)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

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
    <details className="menu" ref={ref} onToggle={() => setAsking(false)}>
      <summary
        className={path === "/settings" ? "btn btn-ghost btn-sm menu-toggle is-on" : "btn btn-ghost btn-sm menu-toggle"}
      >
        <Menu />
        <span>Menu</span>
      </summary>
      <div className="menu-panel">
        <div className="menu-mobile">
          <NavLinks variant="menu" />
          <div className="menu-sep" />
        </div>
        <Link href="/settings" className="menu-item" aria-current={path === "/settings" ? "page" : undefined}>
          Settings
        </Link>
        {asking ? (
          <form action={signOut} className="menu-confirm" role="group" aria-label="Sign out of this device?">
            <p className="hint" role="status">
              Sign out of this device?
            </p>
            <button type="submit" className="menu-item" autoFocus>
              Yes, sign out
            </button>
            <button type="button" className="menu-item" onClick={() => setAsking(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <button type="button" className="menu-item" onClick={() => setAsking(true)}>
            Sign out
          </button>
        )}
      </div>
    </details>
  );
}
