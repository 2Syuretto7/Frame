interface PhaseProgressProps {
  phase: number;
  title: string;
  learnt: number;
  total: number;
}

/** Progress through the current phase: a labelled bar that fills as ideas are learnt. */
export function PhaseProgress({ phase, title, learnt, total }: PhaseProgressProps) {
  const percent = total === 0 ? 0 : Math.round((learnt / total) * 100);
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <span className="small text-ink">{`Phase ${phase}: ${title}`}</span>
        <span className="caption flex-none text-ink-secondary">{`${percent}%`}</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-round border border-line bg-raised"
        role="progressbar"
        aria-label={`Phase ${phase} progress`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={learnt}
        aria-valuetext={`${learnt} of ${total} ideas learnt`}
      >
        <div className="h-full rounded-round bg-success" style={{ width: `${percent}%` }} />
      </div>
      <span className="caption text-ink-secondary">{`${learnt} of ${total} ideas learnt`}</span>
    </div>
  );
}
