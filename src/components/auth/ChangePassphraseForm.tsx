"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { changeOwnPassphrase, type FormState } from "@/server/auth/actions";
import { PassphraseChooser } from "./PassphraseChooser";
import { PassphraseInput } from "./PassphraseInput";
import { SavedCheckbox } from "./SavedCheckbox";

/** Settings: the family's change-passphrase form, with Frame's passphrase generator for the new one. */
export function ChangePassphraseForm() {
  const [state, action] = useActionState<FormState, FormData>(changeOwnPassphrase, {});
  return (
    <form action={action} key={state.done} className="flex flex-col gap-5">
      {state.error ? (
        <p className="error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.done ? (
        <p className="success" role="status">
          {state.done}
        </p>
      ) : null}
      <input type="text" name="username" autoComplete="username" value="arnav" readOnly hidden />
      <PassphraseInput id="current" name="current" label="Current passphrase" autoComplete="current-password" />
      <PassphraseChooser label="New passphrase" />
      <SavedCheckbox />
      <div>
        <SubmitButton pendingText="Saving" className="btn">
          Change passphrase
        </SubmitButton>
      </div>
    </form>
  );
}
