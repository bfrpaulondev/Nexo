import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LESSONS } from "@/data/course";
import type { ChatTurn } from "@/data/types";

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
  chats: Record<string, ChatTurn[]>;
  mark: (id: string, patch: Partial<LessonProgress>) => void;
  setChat: (id: string, turns: ChatTurn[]) => void;
  reset: () => void;
};

const CHAT_CAP = 20;

export const useProgress = create<Store>()(
  persist(
    (set) => ({
      name: "",
      setName: (name) => set({ name }),
      byLesson: {},
      chats: {},
      mark: (id, patch) =>
        set((s) => ({
          byLesson: {
            ...s.byLesson,
            [id]: { ...s.byLesson[id], ...patch },
          },
        })),
      setChat: (id, turns) =>
        set((s) => ({
          chats: { ...s.chats, [id]: turns.slice(-CHAT_CAP) },
        })),
      reset: () => set({ byLesson: {}, chats: {}, name: "" }),
    }),
    { name: "nexo-progress-v3" },
  ),
);

export function completedCount(byLesson: Record<string, LessonProgress>) {
  return LESSONS.filter((l) => byLesson[l.id]?.completed).length;
}
