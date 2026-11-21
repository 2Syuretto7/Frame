import { getDb } from "@/db/client";
import { listSessions } from "@/server/auth/core";
import { requireSession } from "@/server/auth/session";
import { signOut, signOutDevice, signOutEverywhere, signOutOtherDevices } from "@/server/auth/actions";
import { Button, Tag } from "@/components/midnight";
import { LocalTime } from "@/components/frame/LocalTime";

/** Every device signed in to Frame, with a way to sign each one out. */
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
              className={`flex flex-wrap items-center justify-between gap-3 rounded-card border bg-raised p-4 ${
                isCurrent ? "border-accent" : "border-line"
              }`}
            >
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="small text-ink">{s.deviceLabel}</span>
                  {isCurrent ? <Tag>This device</Tag> : null}
                </div>
                <span className="caption text-ink-faint">
                  Signed in <LocalTime iso={s.createdAt.toISOString()} />, last used{" "}
                  <LocalTime iso={s.lastSeenAt.toISOString()} />
                </span>
              </div>
              <form action={isCurrent ? signOut : signOutDevice}>
                <input type="hidden" name="tokenHash" value={s.tokenHash} />
                <Button type="submit" variant="ghost">
                  Sign out
                </Button>
              </form>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap gap-3">
        {others > 0 ? (
          <form action={signOutOtherDevices}>
            <Button type="submit" variant="secondary">
              Sign out other devices
            </Button>
          </form>
        ) : null}
        <form action={signOutEverywhere}>
          <Button type="submit" variant="secondary">
            Sign out everywhere
          </Button>
        </form>
      </div>
    </div>
  );
}
