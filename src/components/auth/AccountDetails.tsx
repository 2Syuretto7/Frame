import { getDb } from "@/db/client";
import { getAccount } from "@/server/auth/core";
import { requireSession } from "@/server/auth/session";
import { LocalDate } from "@/components/frame/LocalTime";

/** Who is signed in, since when, and how. */
export async function AccountDetails() {
  await requireSession();
  const account = await getAccount(getDb());
  if (!account) return null;
  const rows: [string, React.ReactNode][] = [
    ["Name", account.name],
    ["Learning since", <LocalDate key="since" iso={account.createdAt.toISOString()} />],
    ["Sign-in", "Passphrase"],
    ["Passphrase last changed", <LocalDate key="changed" iso={account.passphraseChangedAt.toISOString()} />],
  ];
  return (
    <dl className="m-0 grid grid-cols-1 rounded-card border border-line bg-raised sm:grid-cols-2">
      {rows.map(([term, value], i) => (
        <div
          key={term}
          className={`flex flex-col gap-1 p-4 ${i > 0 ? "border-t border-line" : ""} ${i === 1 ? "sm:border-t-0 sm:border-l" : ""} ${i === 3 ? "sm:border-l" : ""}`}
        >
          <dt className="caption text-ink-secondary">{term}</dt>
          <dd className="small m-0 text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
