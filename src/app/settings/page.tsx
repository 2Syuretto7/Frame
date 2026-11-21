import { Suspense } from "react";
import type { Metadata } from "next";
import { ThemeSelector } from "@/components/frame/ThemeSelector";
import { Page } from "@/components/frame/Page";
import { SessionsList } from "@/components/auth/SessionsList";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <Page showSettings={false}>
      <section className="flex max-w-[720px] flex-col gap-12 pt-12 pb-24">
        <h1 className="heading-2 m-0 text-ink">Settings</h1>
        <ThemeSelector />
        <div className="flex flex-col gap-4">
          <h2 className="small m-0 text-ink">Signed-in devices</h2>
          <Suspense fallback={<div className="h-24 rounded-card border border-line" aria-hidden="true" />}>
            <SessionsList />
          </Suspense>
        </div>
        <p className="caption m-0 text-ink-faint">
          Your theme is remembered on each device. AI usage joins this page when the tutor and practice arrive.
        </p>
      </section>
    </Page>
  );
}
