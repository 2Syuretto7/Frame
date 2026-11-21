import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { NavLinks } from "./NavLinks";
import { UserMenu } from "./UserMenu";

/** The top bar shared with Frontier and Polymath: the mark, Home and Map, and the account menu. */
export function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand" aria-label="Frame home">
          <LogoMark />
          <span className="brand-name">Frame</span>
        </Link>
        <nav className="topnav" aria-label="Primary">
          <NavLinks />
        </nav>
        <div className="topbar-end">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
