"use client";

import { useActionState, useState } from "react";
import { Button, TextField } from "@/components/ui";
import { setupAccount, type FormState } from "@/server/auth/actions";
import { PassphraseChooser } from "./PassphraseChooser";
import { SavedCheckbox } from "./SavedCheckbox";

export function SetupForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(setupAccount, {});
  // Controlled, so a failed attempt does not clear what was typed.
  const [code, setCode] = useState("");
  const fieldError = (name: string) => (state.field === name ? state.error : undefined);
  const generalError = state.error && !state.field ? state.error : undefined;

  return (
    <form action={action} className="flex flex-col gap-8">
      {/* Lets password managers save the passphrase against a name. */}
      <input type="text" name="username" autoComplete="username" value="arnav" readOnly hidden />
      <TextField
        label="Setup code"
        name="setupCode"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        type="password"
        autoComplete="off"
        required
        hint="The SETUP_TOKEN value you added in Vercel."
        error={fieldError("setupCode")}
      />
      <PassphraseChooser error={fieldError("passphrase")} />
      <SavedCheckbox error={fieldError("savedIt")} />
      {generalError ? <p className="hint text-error m-0">{generalError}</p> : null}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Creating your account" : "Create my account"}
        </Button>
      </div>
    </form>
  );
}
