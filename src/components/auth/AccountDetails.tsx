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
    <dl className="kv">
      {rows.map(([term, value]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
