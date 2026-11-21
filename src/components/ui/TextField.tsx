"use client";

import { useId, type InputHTMLAttributes } from "react";
import { cx } from "./cx";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

/** The family field: a 13px label over a 40px input, with a hint or an error below. */
export function TextField({ label, hint, error, className, id, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={cx("field", className)}>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} className="input" aria-invalid={error ? "true" : undefined} {...rest} />
      {error ? (
        <p className="hint" style={{ color: "var(--danger)" }} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="hint">{hint}</p>
      ) : null}
    </div>
  );
}
