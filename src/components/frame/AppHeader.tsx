import Link from "next/link";
import { Settings2 } from "lucide-react";
import { Wordmark } from "./Wordmark";

/** The quiet top bar: the wordmark, and settings tucked away in a single icon. */
export function AppHeader({ showSettings = true }: { showSettings?: boolean }) {
  return (
    <header className="flex h-16 items-center justify-between">
      <Wordmark />
      {showSettings ? (
        <Link
          href="/settings"
          aria-label="Settings"
          className="mds-btn mds-btn-ghost w-9 justify-center !px-0 text-ink-faint hover:text-ink"
        >
          <Settings2 size={18} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      ) : null}
    </header>
  );
}
