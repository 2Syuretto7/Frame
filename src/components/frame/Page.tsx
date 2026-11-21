import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";

/**
 * Page frame shared by every screen: safe-area aware side gutters
 * (16px on phones, 32px from tablets up) and a readable maximum width.
 */
export function Page({ children, showSettings = true }: { children: ReactNode; showSettings?: boolean }) {
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[1120px] flex-col"
      style={{
        paddingLeft: "max(var(--gutter), env(safe-area-inset-left))",
        paddingRight: "max(var(--gutter), env(safe-area-inset-right))",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <AppHeader showSettings={showSettings} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
