import type { ReactNode } from "react";
import { TopBar } from "@/components/shell/TopBar";

/**
 * The signed-in page frame shared with Frontier and Polymath: the top bar, then a
 * 720px reading column (`page`), or the full 1280px frame (`wide`) for the map.
 */
export function Page({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="shell">
      <TopBar />
      <main id="main" className={wide ? "page page-wide" : "page"}>
        {children}
      </main>
    </div>
  );
}
