import { Wordmark } from "./Wordmark";
import { MainNav } from "./MainNav";

/**
 * The same top bar on every page: the wordmark on the left and the labelled main
 * navigation on the right. Signed-out pages show the wordmark alone, in the same place.
 */
export function AppHeader({ signedIn = true }: { signedIn?: boolean }) {
  return (
    <header className="flex h-16 flex-none items-center justify-between gap-4">
      <Wordmark />
      {signedIn ? <MainNav /> : null}
    </header>
  );
}
