import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getDb, isDatabaseConfigured } from "@/db/client";
import { userExists } from "@/server/auth/core";
import { AuthShell, FormSkeleton, Notice } from "@/components/auth/AuthShell";
import { SetupForm } from "@/components/auth/SetupForm";

export const metadata: Metadata = { title: "Set up" };

/** Works only until the one account exists. After that it is a plain "not found". */
export default function SetupPage() {
  return (
    <AuthShell
      title="Set up Frame"
      lead="Create the one account Frame will ever have. After this, sign-up is locked for good."
    >
      <Suspense fallback={<FormSkeleton />}>
        <SetupContent />
      </Suspense>
    </AuthShell>
  );
}

async function SetupContent() {
  await connection();
  if (!isDatabaseConfigured()) {
    return <Notice>Frame&apos;s database is not connected yet. Finish Task C in the plan, then reload this page.</Notice>;
  }
  if (await userExists(getDb())) notFound();
  if (!process.env.SETUP_TOKEN) {
    return <Notice>Add a SETUP_TOKEN variable in Vercel and redeploy, as described in Task C.</Notice>;
  }
  return <SetupForm />;
}
