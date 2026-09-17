import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LESSONS } from "@/data/course";

export type LessonProgress = {
  completed: boolean;
  quizScore?: number;
  quizTotal?: number;
  promptScore?: number;
  pythonOk?: boolean;
  reflection?: string;
};

type Store = {
  name: string;
  setName: (n: string) => void;
  byLesson: Record<string, LessonProgress>;
  mark: (id: string, patch: Partial<LessonProgress>) => void;
  reset: () => void;
};

export const useProgress = create<Store>()(
  persist(
    (set) => ({
      name: "",
      setName: (name) => set({ name }),
      byLesson: {},
      mark: (id, patch) =>
        set((s) => ({
          byLesson: {
            ...s.byLesson,
            [id]: { ...s.byLesson[id], ...patch },
          },
        })),
      reset: () => set({ byLesson: {}, name: "" }),
    }),
    { name: "nexo-progress-v1" },
  ),
);

export function completedCount(byLesson: Record<string, LessonProgress>) {
  return LESSONS.filter((l) => byLesson[l.id]?.completed).length;
}
