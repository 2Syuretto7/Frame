"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function describe(iso: string, now: Date): string {
  const then = new Date(iso);
  const minutes = Math.round((now.getTime() - then.getTime()) / 60_000);
  if (minutes < 2) return "just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  const sameDay = then.toDateString() === now.toDateString();
  const time = then.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `today at ${time}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (then.toDateString() === yesterday.toDateString()) return `yesterday at ${time}`;
  return then.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** A time shown in your own time zone, which only the browser knows. */
export function LocalTime({ iso }: { iso: string }) {
  const text = useSyncExternalStore(
    subscribe,
    () => describe(iso, new Date()),
    () => null,
  );
  return <time dateTime={iso}>{text ?? ""}</time>;
}
