import { LESSONS_AGENTES } from "./lessons-agentes";
import { LESSONS_EXPERT } from "./lessons-expert";
import { LESSONS_FUNDACAO } from "./lessons-fundacao";
import { LESSONS_PROMPT } from "./lessons-prompt";
import { LESSONS_RAG } from "./lessons-rag";
import { TRACKS } from "./tracks";
import type { Lesson, TrackId } from "./types";

export { TRACKS };
export type { Lesson, TrackId };

export const LESSONS: Lesson[] = [
  ...LESSONS_FUNDACAO,
  ...LESSONS_PROMPT,
  ...LESSONS_RAG,
  ...LESSONS_AGENTES,
  ...LESSONS_EXPERT,
].sort((a, b) => a.order - b.order);

export function lessonById(id: string) {
  return LESSONS.find((l) => l.id === id);
}

export function lessonsInTrack(track: TrackId) {
  return LESSONS.filter((l) => l.track === track);
}

export function nextLesson(id: string) {
  const i = LESSONS.findIndex((l) => l.id === id);
  return i >= 0 ? LESSONS[i + 1] : undefined;
}

export function prevLesson(id: string) {
  const i = LESSONS.findIndex((l) => l.id === id);
  return i > 0 ? LESSONS[i - 1] : undefined;
}
