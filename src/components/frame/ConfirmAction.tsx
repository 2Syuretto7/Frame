"use client";

import { useState } from "react";
import { Button, type ButtonVariant } from "@/components/midnight";

interface ConfirmActionProps {
  /** The button that starts the action, such as "Sign out everywhere". */
  label: string;
  /** What will happen, asked as a question. */
  question: string;
  /** The button that carries it out, such as "Yes, sign out everywhere". */
  confirmLabel: string;
  action(form: FormData): void | Promise<void>;
  fields?: Record<string, string>;
  variant?: ButtonVariant;
}

/** A destructive action that asks once, in place, before it happens. */
export function ConfirmAction({
  label,
  question,
  confirmLabel,
  action,
  fields = {},
  variant = "secondary",
}: ConfirmActionProps) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <Button type="button" variant={variant} onClick={() => setAsking(true)}>
        {label}
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-wrap items-center gap-3"
      role="group"
      aria-label={question}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          setAsking(false);
        }
      }}
    >
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <span className="small text-ink" role="status">
        {question}
      </span>
      <Button type="submit" variant="secondary" autoFocus>
        {confirmLabel}
      </Button>
      <Button type="button" variant="ghost" onClick={() => setAsking(false)}>
        Cancel
      </Button>
    </form>
  );
}
