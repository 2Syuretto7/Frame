import { Suspense } from "react";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/midnight";
import { ThemeSelector } from "@/components/frame/ThemeSelector";
import { Page } from "@/components/frame/Page";
import { EscapeTo } from "@/components/frame/EscapeTo";
import { AccountDetails } from "@/components/auth/AccountDetails";
import { SessionsList } from "@/components/auth/SessionsList";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <Page>
      <EscapeTo href="/" />
      <section className="flex flex-col gap-12 pt-8 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="heading-1 m-0 text-ink">Settings</h1>
          <Button href="/" variant="secondary">
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
            Back to home
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="heading-2 m-0 text-ink">Account</h2>
          <Suspense fallback={<div className="h-36 rounded-card border border-line" aria-hidden="true" />}>
            <AccountDetails />
          </Suspense>
        </div>
        <ThemeSelector />
        <div className="flex flex-col gap-4">
          <h2 className="heading-2 m-0 text-ink">Signed-in devices</h2>
          <Suspense fallback={<div className="h-24 rounded-card border border-line" aria-hidden="true" />}>
            <SessionsList />
          </Suspense>
        </div>
      </section>
    </Page>
  );
}
