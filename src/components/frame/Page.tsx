import type { ReactNode } from "react";
import { cx } from "@/components/midnight/cx";
import { AppHeader } from "./AppHeader";

/**
 * Page frame shared by every screen. The header always sits in Frame's one
 * centred column (--column, 960px), so the wordmark and navigation never move.
 * Content uses the same column, except on the knowledge map (`wide`), which is
 * the only page allowed to use the full width of the window.
 */
export function Page({
  children,
  signedIn = true,
  wide = false,
}: {
  children: ReactNode;
  signedIn?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className="flex min-h-dvh w-full flex-col"
      style={{
        paddingLeft: "max(var(--gutter), env(safe-area-inset-left))",
        paddingRight: "max(var(--gutter), env(safe-area-inset-right))",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="page-column">
        <AppHeader signedIn={signedIn} />
      </div>
      <main id="main" className={cx("flex min-h-0 flex-1 flex-col", wide ? "w-full" : "page-column")}>
        {children}
      </main>
    </div>
  );
}
