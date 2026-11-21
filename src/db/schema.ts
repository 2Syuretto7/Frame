import { sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  check,
  index,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Frame has exactly one learner. The check constraint pins the only possible
 * id to 1, so a second account cannot exist even if application code were bypassed.
 */
export const user = pgTable(
  "user",
  {
    id: smallint("id").primaryKey().default(1),
    passphraseHash: text("passphrase_hash").notNull(),
    name: text("name").notNull().default("Arnav"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("user_single_row", sql`${t.id} = 1`)],
);

/** One row per signed-in device. Only a SHA-256 hash of the session token is stored. */
export const authSession = pgTable(
  "auth_session",
  {
    tokenHash: text("token_hash").primaryKey(),
    userId: smallint("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    deviceLabel: text("device_label").notNull(),
    userAgent: text("user_agent").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("auth_session_expires_idx").on(t.expiresAt)],
);

/** Every sign-in, setup and reset attempt, for rate limiting. Addresses are stored only as hashes. */
export const loginAttempt = pgTable(
  "login_attempt",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    kind: text("kind").notNull(),
    ipHash: text("ip_hash").notNull(),
    success: boolean("success").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("login_attempt_ip_idx").on(t.kind, t.ipHash, t.createdAt),
    index("login_attempt_time_idx").on(t.kind, t.createdAt),
  ],
);

/**
 * The curriculum graph, copied from `src/curriculum` on each production deploy so
 * the planner can query it. The repository stays the source of truth. Nodes that
 * leave the graph are marked retired rather than deleted, so history keeps its links.
 */
export const node = pgTable(
  "node",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    phase: smallint("phase").notNull(),
    track: text("track").notNull(),
    kind: text("kind").notNull(),
    goal: text("goal").notNull(),
    sessions: smallint("sessions").notNull(),
    position: smallint("position").notNull(),
    retired: boolean("retired").notNull().default(false),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("node_phase_idx").on(t.phase, t.position)],
);

/** A prerequisite or related link between two nodes, with a note on why they connect. */
export const edge = pgTable(
  "edge",
  {
    fromId: text("from_id")
      .notNull()
      .references(() => node.id, { onDelete: "cascade" }),
    toId: text("to_id")
      .notNull()
      .references(() => node.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    note: text("note"),
  },
  (t) => [primaryKey({ columns: [t.fromId, t.toId, t.type] }), index("edge_to_idx").on(t.toId)],
);
