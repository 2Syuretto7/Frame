import { getDb } from "@/db/client";
import { listSessions } from "@/server/auth/core";
import { requireSession } from "@/server/auth/session";
import { signOut, signOutDevice, signOutEverywhere, signOutOtherDevices } from "@/server/auth/actions";
import { Tag } from "@/components/ui";
import { ConfirmAction } from "@/components/frame/ConfirmAction";
import { LocalTime } from "@/components/frame/LocalTime";

/** Every device signed in to Frame, with a way to sign each one out. Every sign-out asks first. */
export async function SessionsList() {
  const current = await requireSession();
  const sessions = await listSessions(getDb());
  const others = sessions.filter((s) => s.tokenHash !== current.tokenHash).length;

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <ul className="device-list">
        {sessions.map((s) => {
          const isCurrent = s.tokenHash === current.tokenHash;
          return (
            <li key={s.tokenHash}>
              <div className="min-w-0">
                <p className="device-name">
                  {s.deviceLabel}
                  {isCurrent ? <Tag>This device</Tag> : null}
                </p>
                <p className="hint">
                  {isCurrent ? (
                    "Active now"
                  ) : (
                    <>
                      Last active <LocalTime iso={s.lastSeenAt.toISOString()} />
                    </>
                  )}
                </p>
              </div>
              {isCurrent ? (
                <ConfirmAction
                  variant="ghost"
                  size="sm"
                  label="Sign out"
                  question="Sign out of this device?"
                  confirmLabel="Yes, sign out"
                  action={signOut}
                />
              ) : (
                <ConfirmAction
                  variant="ghost"
                  size="sm"
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
          variant="danger"
          label="Sign out everywhere"
          question="Sign out every device, including this one?"
          confirmLabel="Yes, sign out everywhere"
          action={signOutEverywhere}
        />
      </div>
    </div>
  );
}
