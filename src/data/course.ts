import { facultyById } from "./faculty";
import { LESSONS_M1_M4 } from "./lessons-m1-m4";
import { LESSONS_M5_M9 } from "./lessons-m5-m9";
import { TRACKS } from "./tracks";
import type { Exercise, Lesson, Section, TrackId } from "./types";

export { TRACKS, facultyById };
export type { Lesson, TrackId };

export const LESSONS: Lesson[] = [...LESSONS_M1_M4, ...LESSONS_M5_M9].sort(
  (a, b) => a.order - b.order,
);

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

export function facultyForLesson(lesson: Lesson) {
  const track = TRACKS.find((t) => t.id === lesson.track);
  return facultyById(track?.facultyId ?? "iris");
}

export function flattenSection(s: Section): string {
  if (s.type === "text") return [s.title, s.body].filter(Boolean).join("\n");
  if (s.type === "callout") return s.body;
  if (s.type === "steps") return [s.title, s.items.map((i) => `- ${i}`).join("\n")].filter(Boolean).join("\n");
  return [s.title, s.code].filter(Boolean).join("\n");
}

export function lessonNotes(lesson: Lesson) {
  return lesson.sections.map(flattenSection).join("\n\n").slice(0, 2800);
}

export function practiceBrief(ex: Exercise) {
  if (ex.kind === "quiz") return `Quiz: ${ex.questions.map((q) => q.prompt).join(" | ")}`;
  if (ex.kind === "prompt") return `Laboratório de prompt: ${ex.exercise.task}`;
  if (ex.kind === "python") return `Laboratório Python: ${ex.exercise.intro}`;
  return `Reflexão: ${ex.prompt}`;
}
