import type { Metadata } from "next";
import { ArrowRight, Boxes } from "lucide-react";
import {
  Button,
  CodeWindow,
  FeatureCard,
  StatusBadge,
  StatusTile,
  Tag,
  TextField,
} from "@/components/midnight";
import { Page } from "@/components/frame/Page";
import { ThemeSelector } from "@/components/frame/ThemeSelector";

export const metadata: Metadata = { title: "Design reference" };

const SURFACES = [
  ["--background", "Page ground"],
  ["--background-secondary", "Raised surfaces"],
  ["--surface-hover", "Hover fill"],
  ["--border", "Hairlines"],
  ["--border-input", "Input outlines"],
  ["--diagram-background", "Diagram ground"],
] as const;

const TEXT = [
  ["--text-primary", "Primary text"],
  ["--text-secondary", "Secondary text"],
  ["--text-faint", "Faint text"],
  ["--accent", "Accent"],
  ["--link", "Link"],
  ["--diagram-text", "Diagram labels"],
] as const;

const LEARNING_STATES = [
  { state: "Locked", token: "--idle", badge: "paused", label: "Locked" },
  { state: "Learning now", token: "--accent", badge: "progress", label: "Learning" },
  { state: "Learnt", token: "--success", badge: "complete", label: "Learnt" },
  { state: "Review due", token: "--warning", badge: "pending", label: "Review due" },
  { state: "Failed check or misconception", token: "--error", badge: "failed", label: "Needs repair" },
] as const;

const ILLUSTRATION = ["--illustration-deep", "--illustration-mid", "--illustration-warm", "--illustration-cool", "--illustration-sun"] as const;

const TYPE_STYLES = [
  ["display", "Display 44"],
  ["heading-1", "Heading 1, 40"],
  ["heading-2", "Heading 2, 24"],
  ["lead", "Lead 18, used for lesson prose"],
  ["body", "Body 16"],
  ["small", "Small 14"],
  ["caption", "Caption 12"],
  ["code", "Code 12"],
  ["eyebrow", "EYEBROW 11"],
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6 border-t border-line pt-12">
      <h2 className="heading-2 m-0 text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-10 w-10 flex-none rounded-control border border-line"
        style={{ background: `var(${token})` }}
        aria-hidden="true"
      />
      <span className="flex flex-col">
        <span className="small text-ink">{label}</span>
        <code className="code text-ink-faint">{token}</code>
      </span>
    </div>
  );
}

/** A private reference page for reviewing the Midnight port in both themes. */
export default function DesignPage() {
  return (
    <Page>
      <div className="flex flex-col gap-12 pt-12 pb-32">
        <header className="flex max-w-[720px] flex-col gap-4">
          <div>
            <Tag>Reference</Tag>
          </div>
          <h1 className="heading-1 m-0 text-ink">Midnight in Frame</h1>
          <p className="lead m-0 text-ink-secondary">
            Every token and component Frame uses, drawn from the Midnight design system. Switch the theme
            below to check both.
          </p>
        </header>

        <ThemeSelector />

        <Section title="Type">
          <div className="flex flex-col gap-4">
            {TYPE_STYLES.map(([cls, label]) => (
              <div key={cls} className="flex flex-col gap-1">
                <span className={`${cls} text-ink`}>{label}</span>
                <code className="caption text-ink-faint">.{cls}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Colour">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...SURFACES, ...TEXT].map(([token, label]) => (
              <Swatch key={token} token={token} label={label} />
            ))}
          </div>
          <h3 className="small m-0 pt-6 text-ink">Illustration, for diagrams only</h3>
          <div className="flex flex-wrap gap-3">
            {ILLUSTRATION.map((token) => (
              <span
                key={token}
                title={token}
                className="h-10 w-16 rounded-control"
                style={{ background: `var(${token})` }}
              />
            ))}
          </div>
        </Section>

        <Section title="Colour means a learning state">
          <div className="flex flex-col gap-3">
            {LEARNING_STATES.map((row) => (
              <div key={row.state} className="flex flex-wrap items-center gap-4">
                <span className="w-[260px] text-ink-secondary">{row.state}</span>
                <StatusBadge status={row.badge}>{row.label}</StatusBadge>
                <code className="caption text-ink-faint">{row.token}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">
              Learn
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Button>
            <Button variant="secondary">Open the map</Button>
            <Button variant="ghost">Settings</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
          <p className="caption m-0 text-ink-faint">One primary button per view. Hover it to see the navy wipe.</p>
        </Section>

        <Section title="Status, tags and tiles">
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="active" />
            <StatusBadge status="complete" />
            <StatusBadge status="progress" />
            <StatusBadge status="pending" />
            <StatusBadge status="failed" />
            <StatusBadge status="paused" />
            <StatusBadge status="new" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Tag>Review</Tag>
            <Tag>New idea</Tag>
            <Tag>Phase 2</Tag>
            <Tag>Project</Tag>
          </div>
          <div className="grid gap-3 rounded-sheet border border-line p-3 sm:grid-cols-2">
            <StatusTile name="Vectors as arrows" type="Phase 2 · maths" status="complete" />
            <StatusTile name="The dot product" type="Phase 2 · maths" status="pending" />
            <StatusTile name="Fixed timestep" type="Phase 2 · systems" status="progress" active />
            <StatusTile name="Steering behaviours" type="Phase 4 · systems" status="paused" />
          </div>
        </Section>

        <Section title="Code window">
          <CodeWindow
            title="rainfall.ts"
            status="complete"
            lines={[
              { text: "const speed = 240; // pixels per second", tone: "keyword" },
              { text: "player.x += speed * dt;" },
              { text: 'console.log("frame", frameCount);', tone: "string" },
              { time: "00:01.6", text: "3 of 3 checks passed", tone: "success" },
            ]}
            className="max-w-[560px]"
          />
        </Section>

        <Section title="Fields and cards">
          <TextField label="Passphrase" type="password" placeholder="seven random words" hint="Paste it on any device." />
          <TextField label="Passphrase" type="password" defaultValue="wrong" error="That passphrase did not match." />
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Boxes size={18} strokeWidth={1.5} />}
              title="Rainfall"
              description="Your first complete game, built from Phase 1."
            />
          </div>
        </Section>
      </div>
    </Page>
  );
}
