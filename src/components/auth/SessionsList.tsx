import { getDb } from "@/db/client";
import { listSessions } from "@/server/auth/core";
import { requireSession } from "@/server/auth/session";
import { signOut, signOutDevice, signOutEverywhere, signOutOtherDevices } from "@/server/auth/actions";
import { Tag } from "@/components/midnight";
import { ConfirmAction } from "@/components/frame/ConfirmAction";
import { LocalTime } from "@/components/frame/LocalTime";

/** Every device signed in to Frame, with a way to sign each one out. Every sign-out asks first. */
export async function SessionsList() {
  const current = await requireSession();
  const sessions = await listSessions(getDb());
  const others = sessions.filter((s) => s.tokenHash !== current.tokenHash).length;

  return (
    <div className="flex flex-col gap-6">
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {sessions.map((s) => {
          const isCurrent = s.tokenHash === current.tokenHash;
          return (
            <li
              key={s.tokenHash}
              className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-raised p-4"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="small text-ink">{s.deviceLabel}</span>
                  {isCurrent ? <Tag>This device</Tag> : null}
                </div>
                <span className="caption text-ink-secondary">
                  {isCurrent ? (
                    "Active now"
                  ) : (
                    <>
                      Last active <LocalTime iso={s.lastSeenAt.toISOString()} />
                    </>
                  )}
                </span>
              </div>
              {isCurrent ? (
                <ConfirmAction
                  variant="ghost"
                  label="Sign out"
                  question="Sign out of this device?"
                  confirmLabel="Yes, sign out"
                  action={signOut}
                />
              ) : (
                <ConfirmAction
                  variant="ghost"
                  label="Sign out"
                  question={`Sign out ${s.deviceLabel}?`}
                  confirmLabel="Yes, sign it out"
                  action={signOutDevice}
                  fields={{ tokenHash: s.tokenHash }}
                />
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap gap-3">
        {others > 0 ? (
          <ConfirmAction
            label="Sign out other devices"
            question={`Sign out the ${others === 1 ? "other device" : `${others} other devices`}? This one stays signed in.`}
            confirmLabel="Yes, sign them out"
            action={signOutOtherDevices}
          />
        ) : null}
        <ConfirmAction
          label="Sign out everywhere"
          question="Sign out every device, including this one?"
          confirmLabel="Yes, sign out everywhere"
          action={signOutEverywhere}
        />
      </div>
    </div>
  );
}
