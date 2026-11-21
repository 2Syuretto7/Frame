import Link from "next/link";
import { Settings2, Waypoints } from "lucide-react";
import { Wordmark } from "./Wordmark";

/** The quiet top bar: the wordmark, with the map and settings tucked away as two icons. */
export function AppHeader({ showSettings = true }: { showSettings?: boolean }) {
  return (
    <header className="flex h-16 items-center justify-between">
      <Wordmark />
      <nav className="flex items-center gap-1" aria-label="Main">
        <Link
          href="/map"
          aria-label="Knowledge map"
          className="mds-btn mds-btn-ghost w-11 justify-center !px-0 text-ink-faint hover:text-ink"
        >
          <Waypoints size={18} strokeWidth={1.5} aria-hidden="true" />
        </Link>
        {showSettings ? (
          <Link
            href="/settings"
            aria-label="Settings"
            className="mds-btn mds-btn-ghost w-11 justify-center !px-0 text-ink-faint hover:text-ink"
          >
            <Settings2 size={18} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        ) : null}
      </nav>
    </header>
  );
}
