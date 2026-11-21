"use client";

import { useEffect, useId, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { cx } from "@/components/midnight/cx";

const control =
  "mds-btn mds-btn-ghost h-11 min-w-11 justify-center gap-2 border-line px-3 disabled:cursor-not-allowed disabled:opacity-40";

/** Back, next, play and start-again controls for a diagram that runs in steps. */
export function Stepper({
  step,
  total,
  onStep,
  label = "Step",
}: {
  /** The current step, from 0 (nothing run yet) to `total`. */
  step: number;
  total: number;
  onStep(step: number): void;
  label?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const running = playing && step < total;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => onStep(step + 1), 900);
    return () => window.clearTimeout(timer);
  }, [running, step, onStep]);

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <button
        type="button"
        className={control}
        onClick={() => onStep(step - 1)}
        disabled={step === 0}
        aria-label="Back one step"
      >
        <SkipBack size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={control}
        onClick={() => onStep(step + 1)}
        disabled={step >= total}
      >
        Next
        <SkipForward size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={control}
        onClick={() => setPlaying(!running)}
        disabled={step >= total}
        aria-label={running ? "Pause" : "Play every step"}
      >
        {running ? (
          <Pause size={16} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Play size={16} strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        className={control}
        onClick={() => {
          setPlaying(false);
          onStep(0);
        }}
        disabled={step === 0}
        aria-label="Start again"
      >
        <RotateCcw size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <span className="caption ml-auto text-ink-faint" aria-live="polite">
        {step === 0 ? "Not started" : `${label} ${step} of ${total}`}
      </span>
    </div>
  );
}

/** A labelled range input with its current value shown beside the label. */
export function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  format = String,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange(value: number): void;
  format?(value: number): string;
}) {
  const id = useId();
  return (
    <div className="flex min-w-[200px] flex-1 flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="small text-ink">
          {label}
        </label>
        <output htmlFor={id} className="eyebrow text-diagram-ink">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full"
        style={{ accentColor: "var(--accent)" }}
      />
    </div>
  );
}

/** A row of mutually exclusive choices. */
export function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange(value: T): void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cx(
              "small h-11 rounded-control border px-3",
              selected ? "border-accent bg-accent-soft text-ink" : "border-line bg-transparent text-ink-secondary hover:text-ink",
            )}
            style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
