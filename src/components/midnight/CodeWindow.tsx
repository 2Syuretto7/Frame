import { cx } from "./cx";
import { StatusBadge, type Status } from "./StatusBadge";

export interface CodeLine {
  time?: string;
  text: string;
  tone?: "success" | "keyword" | "string";
}

export interface CodeWindowProps {
  title?: string;
  status?: Status;
  lines: CodeLine[];
  className?: string;
}

/** Midnight CodeWindow: always dark in both themes, mono 12px/18px, with a muted title bar. */
export function CodeWindow({ title, status, lines, className }: CodeWindowProps) {
  return (
    <div className={cx("mds-window", className)}>
      <div className="mds-window-head">
        <span className="mds-window-title">{title}</span>
        {status ? <StatusBadge status={status} /> : null}
      </div>
      <pre className="mds-window-body">
        {lines.map((line, i) => (
          <span key={i} className={cx("mds-window-line", line.tone && `mds-window-${line.tone}`)}>
            {line.time ? <span className="mds-window-time">{line.time}</span> : null}
            {line.text}
          </span>
        ))}
      </pre>
    </div>
  );
}
