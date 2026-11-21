import { connection } from "next/server";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb, isDatabaseConfigured } from "@/db/client";
import { userExists } from "@/server/auth/core";
import { getCurrentSession } from "@/server/auth/session";
import { AuthShell, FormSkeleton, Notice } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage({ searchParams }: PageProps<"/signin">) {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to Frame"
      lead="Type or paste your passphrase. This device stays signed in for 90 days."
    >
      <Suspense fallback={<FormSkeleton />}>
        <SignInContent searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function SignInContent({ searchParams }: { searchParams: PageProps<"/signin">["searchParams"] }) {
  await connection();
  if (!isDatabaseConfigured()) {
    return <Notice>Frame cannot reach its database right now. Please try again in a minute.</Notice>;
  }
  if (!(await userExists(getDb()))) {
    return (
      <Notice>
        There is no account yet.{" "}
        <Link href="/setup" className="text-link">
          Set up Frame
        </Link>{" "}
        with the setup code from Vercel.
      </Notice>
    );
  }
  if (await getCurrentSession()) redirect("/");
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/";
  return (
    <div>
      <SignInForm next={next} />
      <p className="foot">
        Forgotten your passphrase? In Vercel, add an environment variable called RESET_TOKEN, then open /reset on this
        site to choose a new one.
      </p>
    </div>
  );
}
