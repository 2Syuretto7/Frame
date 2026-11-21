import { redirect } from "next/navigation";
import { GRAPH } from "@/curriculum/graph";
import { deriveStates } from "@/curriculum/status";
import { nextLesson } from "@/lessons/next";

/** /learn always means "the lesson I should do next". */
export default function LearnPage() {
  redirect(`/learn/${nextLesson(deriveStates(GRAPH, new Map())).id}`);
}
