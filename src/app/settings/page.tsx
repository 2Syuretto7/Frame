import type { Metadata } from "next";
import { ThemeSelector } from "@/components/frame/ThemeSelector";
import { Page } from "@/components/frame/Page";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <Page showSettings={false}>
      <section className="flex max-w-[720px] flex-col gap-12 pt-12 pb-24">
        <h1 className="heading-2 m-0 text-ink">Settings</h1>
        <ThemeSelector />
        <p className="caption m-0 text-ink-faint">
          Your theme is remembered on this device for now. Sessions, devices and AI usage join this page with
          your account in Milestone 2.
        </p>
      </section>
    </Page>
  );
}
