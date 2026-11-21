import { Suspense } from "react";
import type { Metadata } from "next";
import { Page } from "@/components/frame/Page";
import { AccountDetails } from "@/components/auth/AccountDetails";
import { ChangePassphraseForm } from "@/components/auth/ChangePassphraseForm";
import { SessionsList } from "@/components/auth/SessionsList";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <Page>
      <header className="page-head">
        <p className="eyebrow">Account</p>
        <h1>Settings</h1>
        <p className="lede">Your passphrase, the devices signed in to Frame, and your account.</p>
      </header>

      <section className="section">
        <div>
          <h2>Passphrase</h2>
          <p className="desc">Changing it signs out every other device.</p>
        </div>
        <div>
          <ChangePassphraseForm />
        </div>
      </section>

      <section className="section">
        <div>
          <h2>Devices</h2>
          <p className="desc">Every device signed in to Frame. Each sign-out asks first.</p>
        </div>
        <Suspense fallback={<div className="h-24" aria-hidden="true" />}>
          <SessionsList />
        </Suspense>
      </section>

      <section className="section">
        <div>
          <h2>Account</h2>
          <p className="desc">Frame has one learner, and you sign in with a passphrase.</p>
        </div>
        <Suspense fallback={<div className="h-24" aria-hidden="true" />}>
          <AccountDetails />
        </Suspense>
      </section>
    </Page>
  );
}
