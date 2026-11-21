CREATE TABLE "edge" (
	"from_id" text NOT NULL,
	"to_id" text NOT NULL,
	"type" text NOT NULL,
	"note" text,
	CONSTRAINT "edge_from_id_to_id_type_pk" PRIMARY KEY("from_id","to_id","type")
);
--> statement-breakpoint
CREATE TABLE "node" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"phase" smallint NOT NULL,
	"track" text NOT NULL,
	"kind" text NOT NULL,
	"goal" text NOT NULL,
	"sessions" smallint NOT NULL,
	"position" smallint NOT NULL,
	"retired" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "edge" ADD CONSTRAINT "edge_from_id_node_id_fk" FOREIGN KEY ("from_id") REFERENCES "public"."node"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edge" ADD CONSTRAINT "edge_to_id_node_id_fk" FOREIGN KEY ("to_id") REFERENCES "public"."node"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "edge_to_idx" ON "edge" USING btree ("to_id");--> statement-breakpoint
CREATE INDEX "node_phase_idx" ON "node" USING btree ("phase","position");