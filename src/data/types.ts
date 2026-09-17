export type TrackId = "fundacao" | "prompt" | "rag" | "agentes" | "expert";

export type Section =
  | { type: "text"; title?: string; body: string }
  | { type: "code"; title?: string; lang: "python" | "text" | "json"; code: string }
  | { type: "callout"; tone: "tip" | "warn" | "key"; body: string }
  | { type: "steps"; title?: string; items: string[] };

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};

export type PromptExercise = {
  task: string;
  rubric: string[];
  sample: string;
  hiddenSpec: string;
};

export type PythonExercise = {
  intro: string;
  starter: string;
  tests: string;
  solution: string;
};

export type Exercise =
  | { kind: "quiz"; questions: QuizQuestion[] }
  | { kind: "prompt"; exercise: PromptExercise }
  | { kind: "python"; exercise: PythonExercise }
  | { kind: "reflect"; prompt: string; minChars: number };

export type Lesson = {
  id: string;
  track: TrackId;
  order: number;
  title: string;
  minutes: number;
  summary: string;
  tutor: string[];
  sections: Section[];
  exercise: Exercise;
};

export type Track = {
  id: TrackId;
  label: string;
  level: string;
  blurb: string;
};
