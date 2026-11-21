import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/shell/TopBar";
import { LessonView } from "@/components/lesson/LessonView";
import { GRAPH } from "@/curriculum/graph";
import { LESSON_IDS, LESSONS } from "@/lessons";

export function generateStaticParams() {
  return LESSON_IDS.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[id]">): Promise<Metadata> {
  const { id } = await params;
  const node = GRAPH.byId.get(id);
  return { title: node ? `${node.id} ${node.title}` : "Lesson" };
}

export default async function LessonPage({ params }: PageProps<"/learn/[id]">) {
  const { id } = await params;
  const lesson = LESSONS[id];
  if (!lesson) notFound();
  return (
    <div className="shell">
      <TopBar />
      <LessonView lesson={lesson} />
    </div>
  );
}
