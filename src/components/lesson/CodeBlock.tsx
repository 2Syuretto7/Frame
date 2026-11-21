import { cx } from "@/components/midnight/cx";
import { highlightLine, type TokenKind } from "@/lib/highlight";

const TOKEN_COLOUR: Record<TokenKind, string | undefined> = {
  keyword: "var(--code-keyword)",
  string: "var(--code-string)",
  number: "var(--code-number)",
  comment: "var(--code-muted)",
  plain: undefined,
};

export interface CodeBlockProps {
  code: string | string[];
  title?: string;
  /** Zero-based lines to mark as the current focus. */
  active?: number[];
  /** Zero-based lines to dim, such as lines not reached yet. */
  dim?: number[];
  className?: string;
}

/**
 * Lesson code in Midnight's CodeWindow style: always dark, mono, with line numbers.
 * The active line is marked with the accent bar, since it is the line in focus.
 */
export function CodeBlock({ code, title, active = [], dim = [], className }: CodeBlockProps) {
  const lines = Array.isArray(code) ? code : code.replace(/\n$/, "").split("\n");
  return (
    <div className={cx("mds-window", className)} style={{ boxShadow: "none" }}>
      {title ? (
        <div className="mds-window-head">
          <span className="mds-window-title">{title}</span>
        </div>
      ) : null}
      <pre className="m-0 overflow-x-auto py-3" style={{ font: "var(--text-code)" }}>
        <code className="block min-w-max">
          {lines.map((line, i) => {
            const isActive = active.includes(i);
            return (
              <span
                key={i}
                className="flex"
                aria-current={isActive ? "step" : undefined}
                style={{
                  background: isActive ? "var(--accent-soft)" : undefined,
                  boxShadow: isActive ? "inset 2px 0 0 var(--code-keyword)" : undefined,
                  opacity: dim.includes(i) ? 0.45 : 1,
                }}
              >
                <span
                  className="w-10 flex-none pr-3 text-right select-none"
                  style={{ color: "var(--code-muted)" }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="pr-4 whitespace-pre">
                  {highlightLine(line).map((token, j) => (
                    <span key={j} style={{ color: TOKEN_COLOUR[token.kind] }}>
                      {token.text}
                    </span>
                  ))}
                  {line === "" ? " " : null}
                </span>
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
