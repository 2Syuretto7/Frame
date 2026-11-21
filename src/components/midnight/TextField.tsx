"use client";

import { useId, type InputHTMLAttributes } from "react";
import { cx } from "./cx";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

/** Midnight TextField: a 14px/500 label over a 40px input with a hairline and 2px corners. */
export function TextField({ label, hint, error, className, id, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={cx("mds-field", className)}>
      <label className="mds-label" htmlFor={inputId}>
        {label}
      </label>
      <input id={inputId} className="mds-input" aria-invalid={error ? "true" : undefined} {...rest} />
      {error ? (
        <span className="mds-hint mds-hint-error">{error}</span>
      ) : hint ? (
        <span className="mds-hint">{hint}</span>
      ) : null}
    </div>
  );
}
