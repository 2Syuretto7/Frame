"use client";

import { useSyncExternalStore } from "react";
import { greetingFor } from "@/lib/greeting";

const subscribe = () => () => {};

/**
 * The greeting depends on your local time, which the server cannot know,
 * so it is worked out in the browser. Until then the line keeps its height.
 */
export function Greeting({ name }: { name: string }) {
  const text = useSyncExternalStore(
    subscribe,
    () => greetingFor(new Date(), name),
    () => null,
  );
  return (
    <h1 className="heading-1 m-0 min-h-[43px] text-ink" aria-live="polite">
      {text ?? " "}
    </h1>
  );
}
