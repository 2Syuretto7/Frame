"use client";

/**
 * The interactive diagrams used by the Phase 1 lessons. Each one is small, works
 * with keyboard and touch, and describes itself in words for screen readers.
 */
import { useState } from "react";
import { PROGRAM_LOOP, PROGRAM_OUTPUT, PROGRAM_STATE } from "@/lessons/programs";
import { formatValue, type Value } from "@/lessons/trace";
import { EVALUATIONS } from "@/lessons/evaluations";
import { DiagramFrame } from "./DiagramFrame";
import { Choice, Slider, Stepper } from "./controls";
import { TraceView } from "./TraceView";

const mono = { font: "var(--text-code)" } as const;

/* 1.01 ------------------------------------------------------------------ */

export function OutputTrace() {
  return (
    <TraceView
      title="Run it one line at a time"
      description="A five-line program. Each press of Next runs one line and shows what it prints."
      lines={PROGRAM_OUTPUT}
      prompt="Before you press Next, say out loud what you think each line will print."
      showVariables={false}
    />
  );
}

/* 1.02 ------------------------------------------------------------------ */

const LEFT: { key: string; value: Value }[] = [
  { key: "5", value: 5 },
  { key: '"5"', value: "5" },
  { key: "2.5", value: 2.5 },
  { key: "true", value: true },
  { key: '"Rain"', value: "Rain" },
];
const RIGHT: { key: string; value: Value }[] = [
  { key: "3", value: 3 },
  { key: '"3"', value: "3" },
  { key: "false", value: false },
  { key: '"fall"', value: "fall" },
];
type Operator = "+" | "===";

function combine(a: Value, b: Value, op: Operator): Value {
  if (op === "===") return a === b;
  // The cast mirrors what JavaScript does; this is the behaviour being taught.
  return (a as number) + (b as number);
}

function explainCombination(a: Value, b: Value, op: Operator): string {
  if (op === "===") {
    if (typeof a !== typeof b) return `=== never converts. A ${typeof a} and a ${typeof b} are never equal.`;
    return a === b ? "Same type and same value, so they are equal." : "Same type, but different values.";
  }
  if (typeof a === "string" || typeof b === "string") {
    return "One side is a string, so + joins them as text. The other value is turned into text first.";
  }
  if (typeof a === "boolean" || typeof b === "boolean") {
    return "Neither side is a string, so + adds numbers. A boolean counts as 1 for true and 0 for false.";
  }
  return "Two numbers, so + adds them.";
}

export function TypeMixer() {
  const [left, setLeft] = useState(LEFT[0].key);
  const [right, setRight] = useState(RIGHT[1].key);
  const [op, setOp] = useState<Operator>("+");
  const a = LEFT.find((o) => o.key === left)!.value;
  const b = RIGHT.find((o) => o.key === right)!.value;
  const result = combine(a, b, op);

  return (
    <DiagramFrame
      title="Combine two values"
      description="Pick a value on each side and an operator. The result and its type are shown, with the rule that produced it."
      controls={
        <div className="flex w-full flex-col gap-3">
          <Choice label="Left value" options={LEFT.map((o) => ({ value: o.key, label: o.key }))} value={left} onChange={setLeft} />
          <Choice<Operator> label="Operator" options={[{ value: "+", label: "+" }, { value: "===", label: "===" }]} value={op} onChange={setOp} />
          <Choice label="Right value" options={RIGHT.map((o) => ({ value: o.key, label: o.key }))} value={right} onChange={setRight} />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3" style={mono}>
          <Chip value={a} />
          <span className="text-ink">{op}</span>
          <Chip value={b} />
          <span className="text-ink-faint">gives</span>
          <Chip value={result} strong />
        </div>
        <p className="small m-0 text-ink-secondary" aria-live="polite">
          {`${formatValue(a)} ${op} ${formatValue(b)} is ${formatValue(result)}, a ${typeof result}. `}
          {explainCombination(a, b, op)}
        </p>
      </div>
    </DiagramFrame>
  );
}

function Chip({ value, strong = false }: { value: Value; strong?: boolean }) {
  return (
    <span
      className="inline-flex flex-col items-start gap-1 rounded-control border px-3 py-2"
      style={{ borderColor: strong ? "var(--accent)" : "var(--diagram-border)" }}
    >
      <span className="text-ink" style={{ font: "500 16px/20px var(--font-mono)" }}>
        {formatValue(value)}
      </span>
      <span className="eyebrow text-diagram-ink">{typeof value}</span>
    </span>
  );
}

/* 1.03 ------------------------------------------------------------------ */

export function StateTrace() {
  return (
    <TraceView
      title="Watch the boxes change"
      description="An eight-line program. Each step shows which variables exist and what each one holds."
      lines={PROGRAM_STATE}
      prompt="Before you start, predict the last line's output. Watch best closely near the end."
    />
  );
}

/* 1.04 ------------------------------------------------------------------ */

export function EvaluationOrder() {
  const [choice, setChoice] = useState(EVALUATIONS[0].expression);
  const [step, setStep] = useState(0);
  const evaluation = EVALUATIONS.find((e) => e.expression === choice)!;
  const total = evaluation.steps.length;

  return (
    <DiagramFrame
      title="Evaluate in order"
      description="Choose an expression, then step through it. The highlighted part is worked out next, following precedence and left-to-right order."
      controls={<Stepper step={step} total={total} onStep={(s) => setStep(Math.max(0, Math.min(total, s)))} label="Reduction" />}
    >
      <div className="flex flex-col gap-4">
        <Choice
          label="Expression"
          options={EVALUATIONS.map((e) => ({ value: e.expression, label: e.expression }))}
          value={choice}
          onChange={(value) => {
            setChoice(value);
            setStep(0);
          }}
        />
        <ol className="m-0 flex list-none flex-col gap-2 p-0" style={{ font: "500 18px/28px var(--font-mono)" }}>
          <li className="text-ink">
            <Highlighted text={evaluation.expression} part={evaluation.steps[step]?.part ?? null} />
          </li>
          {evaluation.steps.slice(0, step).map((s, i) => (
            <li key={i} className="text-ink">
              <span className="text-ink-faint">= </span>
              <Highlighted text={s.result} part={evaluation.steps[i + 1]?.part ?? null} />
            </li>
          ))}
        </ol>
        <p className="small m-0 min-h-10 text-ink-secondary" aria-live="polite">
          {step < total
            ? evaluation.steps[step].why
            : `Done. The expression has the value ${evaluation.steps[total - 1].result}.`}
        </p>
      </div>
    </DiagramFrame>
  );
}

function Highlighted({ text, part }: { text: string; part: string | null }) {
  const at = part ? text.indexOf(part) : -1;
  if (!part || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark
        className="rounded-[2px] px-0.5 text-ink"
        style={{ background: "var(--accent-soft)", boxShadow: "inset 0 -2px 0 var(--accent)" }}
      >
        {part}
      </mark>
      {text.slice(at + part.length)}
    </>
  );
}

export function RemainderWheel() {
  const [n, setN] = useState(10);
  const [d, setD] = useState("4");
  const size = Number(d);
  const r = n % size;
  const q = Math.floor(n / size);
  const cx = 110;
  const cy = 110;
  const radius = 80;

  return (
    <DiagramFrame
      title="Remainder as a wheel"
      description="Counting n steps round a wheel of d slots. The slot you land on is n % d, and the number of full turns is Math.floor(n / d)."
      controls={
        <div className="flex w-full flex-col gap-3">
          <Slider label="n, the number of steps" min={0} max={23} value={n} onChange={setN} />
          <Choice
            label="d, the number of slots"
            options={["3", "4", "6", "8"].map((v) => ({ value: v, label: `d = ${v}` }))}
            value={d}
            onChange={setD}
          />
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-6">
        <svg viewBox="0 0 220 220" className="w-[200px] flex-none" role="img" aria-label={`${n} % ${size} is ${r}`}>
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--diagram-border)" />
          {Array.from({ length: size }, (_, i) => {
            const angle = (i / size) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            const landed = i === r;
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={16}
                  fill={landed ? "var(--accent-strong)" : "var(--diagram-background)"}
                  stroke={landed ? "var(--accent)" : "var(--diagram-border)"}
                  strokeWidth={landed ? 2 : 1}
                />
                <text x={x} y={y + 5} textAnchor="middle" fill={landed ? "var(--on-accent)" : "var(--diagram-text)"} style={mono}>
                  {i}
                </text>
              </g>
            );
          })}
          <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text-primary)" style={{ font: "500 20px/24px var(--font-mono)" }}>
            {r}
          </text>
          <text x={cx} y={cy + 16} textAnchor="middle" fill="var(--text-faint)" style={{ font: "var(--text-eyebrow)" }}>
            {`${q} FULL ${q === 1 ? "TURN" : "TURNS"}`}
          </text>
        </svg>
        <div className="flex flex-col gap-2" style={{ font: "500 16px/24px var(--font-mono)" }} aria-live="polite">
          <span className="text-ink">{`${n} % ${size} = ${r}`}</span>
          <span className="text-ink-secondary">{`Math.floor(${n} / ${size}) = ${q}`}</span>
          <span className="caption text-ink-faint" style={{ fontFamily: "var(--font-sans)" }}>
            {`${n} = ${q} × ${size} + ${r}`}
          </span>
        </div>
      </div>
    </DiagramFrame>
  );
}

/* 1.05 ------------------------------------------------------------------ */

const MEDALS = [
  { min: 90, medal: "gold" },
  { min: 70, medal: "silver" },
  { min: 50, medal: "bronze" },
];

export function BranchExplorer() {
  const [score, setScore] = useState(75);
  const [order, setOrder] = useState<"right" | "reversed">("right");
  const checks = order === "right" ? MEDALS : [...MEDALS].reverse();
  const hit = checks.findIndex((c) => score >= c.min);
  const medal = hit === -1 ? "none" : checks[hit].medal;

  const rows = [
    ...checks.map((c, i) => ({
      code: `${i === 0 ? "if" : "} else if"} (score >= ${c.min}) {`,
      body: `  medal = "${c.medal}";`,
      index: i,
    })),
    { code: "} else {", body: '  medal = "none";', index: checks.length },
  ];

  return (
    <DiagramFrame
      title="Follow the branch"
      description="An else if chain that awards a medal. Conditions are checked from the top, and only the first true branch runs."
      controls={
        <div className="flex w-full flex-col gap-3">
          <Slider label="score" min={0} max={100} value={score} onChange={setScore} />
          <Choice<"right" | "reversed">
            label="Order of the checks"
            options={[
              { value: "right", label: "Highest first" },
              { value: "reversed", label: "Lowest first" },
            ]}
            value={order}
            onChange={setOrder}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <ol className="m-0 flex list-none flex-col gap-1 p-0" style={mono}>
          {rows.map((row) => {
            const isElse = row.index === checks.length;
            const checked = hit === -1 ? true : row.index <= hit;
            const taken = isElse ? hit === -1 : row.index === hit;
            const condition = isElse ? null : score >= checks[row.index].min;
            const state = taken ? "runs" : checked ? (isElse ? "" : "false") : "not checked";
            return (
              <li
                key={row.index}
                className="flex flex-col rounded-control border px-3 py-2"
                style={{
                  borderColor: taken ? "var(--accent)" : "var(--diagram-border)",
                  opacity: checked ? 1 : 0.5,
                }}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="whitespace-pre text-ink">{row.code}</span>
                  <span className="eyebrow text-diagram-ink">
                    {condition === null ? state.toUpperCase() : taken ? "TRUE · RUNS" : state.toUpperCase()}
                  </span>
                </span>
                <span className={taken ? "whitespace-pre text-ink" : "whitespace-pre text-ink-faint"}>{row.body}</span>
              </li>
            );
          })}
          <li className="px-3 text-ink-faint">{"}"}</li>
        </ol>
        <p className="small m-0 text-ink-secondary" aria-live="polite">
          {`With score = ${score}, medal is "${medal}".`}
          {order === "reversed" && score >= 70
            ? " Checking the lowest boundary first means a high score stops at the first check, so gold and silver can never be reached."
            : ""}
        </p>
      </div>
    </DiagramFrame>
  );
}

/* 1.06 ------------------------------------------------------------------ */

export function LoopTrace() {
  return (
    <TraceView
      title="Step through a for loop"
      description="A loop that adds points for three waves. Watch the order: start, check, body, step, check again."
      lines={PROGRAM_LOOP}
      prompt="Predict how many times the line inside the loop will run, then step through to check."
    />
  );
}

export function LoopTiles() {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(6);
  const [step, setStep] = useState(1);
  const [cmp, setCmp] = useState<"<" | "<=">("<");
  const values: number[] = [];
  for (let i = start; cmp === "<" ? i < end : i <= end; i += step) values.push(i);
  const width = 13;
  const tile = 24;

  return (
    <DiagramFrame
      title="Draw a row of tiles"
      description="for (let i = start; i < end; i += step) draws one tile at column i. Change the numbers to see which tiles are drawn and how many times the loop runs."
      controls={
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap gap-4">
            <Slider label="start" min={0} max={6} value={start} onChange={setStart} />
            <Slider label="end" min={0} max={12} value={end} onChange={setEnd} />
            <Slider label="step" min={1} max={4} value={step} onChange={setStep} />
          </div>
          <Choice<"<" | "<=">
            label="Comparison"
            options={[
              { value: "<", label: "i < end" },
              { value: "<=", label: "i <= end" },
            ]}
            value={cmp}
            onChange={setCmp}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <code className="text-ink" style={{ font: "500 15px/22px var(--font-mono)" }}>
          {`for (let i = ${start}; i ${cmp} ${end}; i += ${step})`}
        </code>
        <svg viewBox={`0 0 ${width * tile + 8} ${tile + 28}`} className="w-full max-w-[480px]" role="img" aria-label={`Tiles drawn at columns ${values.join(", ") || "none"}`}>
          {Array.from({ length: width }, (_, i) => {
            const drawn = values.includes(i);
            const isEnd = i === end;
            return (
              <g key={i} transform={`translate(${4 + i * tile},4)`}>
                <rect
                  width={tile - 4}
                  height={tile - 4}
                  rx={2}
                  fill={drawn ? "var(--illustration-mid)" : "transparent"}
                  stroke={isEnd ? "var(--diagram-text)" : "var(--diagram-border)"}
                  strokeDasharray={drawn ? undefined : "3 2"}
                />
                <text x={(tile - 4) / 2} y={tile + 14} textAnchor="middle" fill="var(--text-faint)" style={{ font: "var(--text-eyebrow)" }}>
                  {i}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="small m-0 text-ink-secondary" aria-live="polite">
          {values.length === 0
            ? "The condition is false straight away, so the loop body never runs."
            : `The loop runs ${values.length} ${values.length === 1 ? "time" : "times"}, with i = ${values.join(", ")}. After that, i is ${values[values.length - 1] + step}, the condition is false, and the loop stops.`}
        </p>
      </div>
    </DiagramFrame>
  );
}
