import { Tag } from "@/components/midnight";

interface PhaseProgressProps {
  phase: number;
  title: string;
  learnt: number;
  total: number;
}

/** A quiet indication of progress: the current phase and a hairline that fills as ideas are learnt. */
export function PhaseProgress({ phase, title, learnt, total }: PhaseProgressProps) {
  const percent = total === 0 ? 0 : Math.round((learnt / total) * 100);
  return (
    <div className="flex w-full max-w-[400px] flex-col gap-3">
      <div className="flex items-center gap-3">
        <Tag>Phase {phase}</Tag>
        <span className="small text-ink-secondary">{title}</span>
      </div>
      <div
        className="h-0.5 w-full overflow-hidden rounded-round bg-line"
        role="progressbar"
        aria-label={`Phase ${phase} progress`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={learnt}
        aria-valuetext={`${learnt} of ${total} ideas learnt`}
      >
        <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
      </div>
      <span className="caption text-ink-faint">
        {learnt} of {total} ideas learnt
      </span>
    </div>
  );
}
