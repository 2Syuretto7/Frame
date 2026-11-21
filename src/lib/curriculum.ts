/**
 * The six phases of the year. The full knowledge graph arrives in Milestone 3;
 * until then this is enough for the home page's progress line.
 */
export interface PhaseSummary {
  number: number;
  title: string;
  weeks: string;
  nodeCount: number;
  game: string;
}

export const PHASES: PhaseSummary[] = [
  { number: 1, title: "Programming and the game loop", weeks: "1 to 9", nodeCount: 18, game: "Rainfall" },
  { number: 2, title: "Motion and the maths of movement", weeks: "10 to 18", nodeCount: 15, game: "Drift" },
  { number: 3, title: "Structure, worlds and sound", weeks: "19 to 27", nodeCount: 15, game: "Lantern" },
  { number: 4, title: "Physics, probability and game AI", weeks: "28 to 36", nodeCount: 18, game: "Undercroft" },
  { number: 5, title: "Design, interfaces, polish and performance", weeks: "37 to 45", nodeCount: 14, game: "Tidepool" },
  { number: 6, title: "Tools, shipping and independence", weeks: "46 to 52", nodeCount: 9, game: "Your capstone" },
];

export const LEARNER_NAME = "Arnav";
