/** A short greeting for the local time of day. */
export function greetingFor(date: Date, name: string): string {
  const hour = date.getHours();
  if (hour < 5) return `Working late, ${name}`;
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}
