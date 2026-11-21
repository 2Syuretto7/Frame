"use client";

import { useState } from "react";

export function SavedCheckbox({ error }: { error?: string }) {
  // Controlled, so a failed attempt does not untick the box.
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-start gap-3 text-ink-secondary">
        <input
          type="checkbox"
          name="savedIt"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-1 h-4 w-4 flex-none"
          style={{ accentColor: "var(--accent-strong)" }}
        />
        <span>I have saved this passphrase somewhere safe, such as on paper or in a password manager.</span>
      </label>
      {error ? <span className="mds-hint mds-hint-error">{error}</span> : null}
    </div>
  );
}
