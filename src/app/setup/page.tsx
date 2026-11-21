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
    return <Notice>Frame cannot reach its database right now. Please try again in a minute.</Notice>;
  }
  if (await userExists(getDb())) notFound();
  if (!process.env.SETUP_TOKEN) {
    return (
      <Notice>
        Setting up needs a setup code. In Vercel, add an environment variable called SETUP_TOKEN, redeploy, then reload
        this page.
      </Notice>
    );
  }
  return <SetupForm />;
}
