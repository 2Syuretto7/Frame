import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { isDatabaseConfigured } from "@/db/client";
import { AuthShell, FormSkeleton } from "@/components/auth/AuthShell";
import { ResetForm } from "@/components/auth/ResetForm";

export const metadata: Metadata = { title: "Reset passphrase" };

/** Exists only while RESET_TOKEN is set in Vercel. Your progress is untouched. */
export default function ResetPage() {
  return (
    <AuthShell
      title="Choose a new passphrase"
      lead="Your progress stays as it is. Every device will be signed out, then this one signed back in."
    >
      <Suspense fallback={<FormSkeleton />}>
        <ResetContent />
      </Suspense>
    </AuthShell>
  );
}

async function ResetContent() {
  await connection();
  if (!isDatabaseConfigured() || !process.env.RESET_TOKEN) notFound();
  return (
    <div className="flex flex-col gap-6">
      <ResetForm />
      <p className="caption m-0 text-ink-faint">
        When you are done, delete RESET_TOKEN from Vercel so this page disappears again.
      </p>
    </div>
  );
}
