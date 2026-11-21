import Link from "next/link";

/** Until Frame has a logo, its name is set as a wordmark in the sans face at 500. */
export function Wordmark() {
  return (
    <Link
      href="/"
      className="rounded-control text-[18px] leading-6 font-medium tracking-[-0.01em] text-ink no-underline"
    >
      Frame
    </Link>
  );
}
