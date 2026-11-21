"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/components/midnight/cx";

export interface ContentsItem {
  id: string;
  title: string;
}

/**
 * The lesson's parts, always in view: a column beside the lesson on laptops and
 * a bar under the header on phones and tablets. The part you are reading is marked.
 */
export function LessonContents({ items, variant }: { items: readonly ContentsItem[]; variant: "bar" | "side" }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const bar = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const pick = () => {
      // The current part is the last one whose top has passed a line a quarter of the way down.
      const line = window.innerHeight * 0.25;
      let current = sections[0]?.id ?? "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      setActive(current);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [items]);

  // Keep the current part visible in the phone bar without scrolling the page.
  useEffect(() => {
    const list = bar.current;
    const link = list?.querySelector<HTMLElement>(`[data-part="${active}"]`);
    if (!list || !link) return;
    const left = link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  const index = Math.max(
    0,
    items.findIndex((item) => item.id === active),
  );

  if (variant === "bar") {
    return (
      <nav
        aria-label="Parts of this lesson"
        className="sticky top-0 z-10 -mx-[var(--gutter)] border-b border-line bg-ground px-[var(--gutter)] lg:hidden"
      >
        <ol ref={bar} className="m-0 flex list-none gap-1 overflow-x-auto p-0 py-2 [scrollbar-width:none]">
          {items.map((item, i) => (
            <li key={item.id} className="flex-none">
              <a
                href={`#${item.id}`}
                data-part={item.id}
                aria-current={item.id === active ? "location" : undefined}
                className={cx(
                  "flex h-9 items-center rounded-control px-3 text-[14px] leading-5 font-medium whitespace-nowrap no-underline",
                  item.id === active ? "bg-accent-soft text-ink" : "text-ink-secondary hover:text-ink",
                )}
              >
                {`${i + 1}. ${item.title}`}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="Parts of this lesson" className="sticky top-8 flex flex-col gap-3">
      <p className="eyebrow m-0 text-ink-secondary">{`PART ${index + 1} OF ${items.length}`}</p>
      <ol className="m-0 flex list-none flex-col border-l border-line p-0">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={item.id === active ? "location" : undefined}
              className={cx(
                "-ml-px flex border-l-2 py-1.5 pl-3 text-[14px] leading-5 no-underline transition-colors",
                item.id === active
                  ? "border-accent font-medium text-ink"
                  : "border-transparent text-ink-secondary hover:text-ink",
              )}
            >
              {`${i + 1}. ${item.title}`}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
