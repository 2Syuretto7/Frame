"use client";

import { useActionState } from "react";
import { signIn, type FormState } from "@/server/auth/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { PassphraseInput } from "./PassphraseInput";

export function SignInForm({ next }: { next: string }) {
  const [state, action] = useActionState<FormState, FormData>(signIn, {});
  return (
    <form action={action}>
      {state.error ? (
        <p className="error" role="alert">
          {state.error}
        </p>
      ) : null}
      {/* Lets password managers save the passphrase against a name. */}
      <input type="text" name="username" autoComplete="username" value="arnav" readOnly hidden />
      <input type="hidden" name="next" value={next} />
      <PassphraseInput id="passphrase" name="passphrase" label="Passphrase" autoComplete="current-password" autoFocus />
      <SubmitButton pendingText="Signing in…">Sign in</SubmitButton>
    </form>
  );
}
