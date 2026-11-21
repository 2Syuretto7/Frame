"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button, TextField } from "@/components/midnight";
import { signIn, type FormState } from "@/server/auth/actions";

export function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});
  const [visible, setVisible] = useState(false);

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="text" name="username" autoComplete="username" value="arnav" readOnly hidden />
      <input type="hidden" name="next" value={next} />
      <div className="flex items-end gap-2">
        <TextField
          label="Passphrase"
          name="passphrase"
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          autoFocus
          error={state.error}
          className="max-w-[420px] flex-1"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide passphrase" : "Show passphrase"}
          aria-pressed={visible}
          className={`mds-btn mds-btn-ghost w-10 justify-center !px-0 text-ink-faint ${state.error ? "mb-6" : ""}`}
        >
          {visible ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
        </button>
      </div>
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Signing in" : "Sign in"}
        </Button>
      </div>
    </form>
  );
}
