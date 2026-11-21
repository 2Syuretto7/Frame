import { lesson as l101 } from "./1.01";
import { lesson as l102 } from "./1.02";
import { lesson as l103 } from "./1.03";
import { lesson as l104 } from "./1.04";
import { lesson as l105 } from "./1.05";
import { lesson as l106 } from "./1.06";
import type { Lesson } from "./types";

/** Every written lesson, keyed by node id, in teaching order. */
export const LESSONS: Record<string, Lesson> = Object.fromEntries(
  [l101, l102, l103, l104, l105, l106].map((lesson) => [lesson.id, lesson]),
);

export function hasLesson(id: string): boolean {
  return id in LESSONS;
}

/** Node ids that have a lesson, for links from the map and the static build. */
export const LESSON_IDS = Object.keys(LESSONS);
