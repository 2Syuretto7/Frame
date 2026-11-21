import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";

/**
 * Page frame shared by every screen: safe-area aware side gutters
 * (16px on phones, 32px from tablets up) and a readable maximum width.
 */
export function Page({
  children,
  showSettings = true,
  wide = false,
}: {
  children: ReactNode;
  showSettings?: boolean;
  /** Fills the whole window, for the map. The page then takes exactly the screen's height. */
  wide?: boolean;
}) {
  return (
    <div
      className={wide ? "flex h-dvh w-full flex-col" : "mx-auto flex min-h-dvh w-full max-w-[1120px] flex-col"}
      style={{
        paddingLeft: "max(var(--gutter), env(safe-area-inset-left))",
        paddingRight: "max(var(--gutter), env(safe-area-inset-right))",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <AppHeader showSettings={showSettings} />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
