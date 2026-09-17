export type TrackId =
  | "m1"
  | "m2"
  | "m3"
  | "m4"
  | "m5"
  | "m6"
  | "m7"
  | "m8"
  | "m9";

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

export type ChatTurn = { role: "you" | "tutor"; text: string; speaker?: string };

export type Faculty = {
  id: string;
  name: string;
  model: string;
  role: string;
  style: string;
  system: string;
  starters: string[];
  temperature: number;
  core: string;
  ring: string;
  lamp: string;
};

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
  n: number;
  label: string;
  learn: string;
  practice: string;
  facultyId: string;
};
