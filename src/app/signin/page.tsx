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
    <AuthShell title="Sign in" lead="Paste or type your passphrase. You will stay signed in on this device.">
      <Suspense fallback={<FormSkeleton />}>
        <SignInContent searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function SignInContent({ searchParams }: { searchParams: PageProps<"/signin">["searchParams"] }) {
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
    <div className="flex flex-col gap-8">
      <SignInForm next={next} />
      <p className="caption m-0 text-ink-faint">
        Forgotten your passphrase? In Vercel, add an environment variable called RESET_TOKEN, then open /reset on this
        site to choose a new one.
      </p>
    </div>
  );
}
