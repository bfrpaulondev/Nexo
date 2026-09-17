import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PromptExercise } from "@/data/types";
import { gradePrompt } from "@/lib/ai-tutor";

export function PromptLab({
  exercise,
  onComplete,
}: {
  exercise: PromptExercise;
  onComplete: (score: number) => void;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);

  async function grade() {
    setBusy(true);
    try {
      const res = await gradePrompt({
        data: {
          student: text,
          task: exercise.task,
          rubric: exercise.rubric,
          spec: exercise.hiddenSpec,
        },
      });
      if (res.ok) {
        setResult({ score: res.score, feedback: res.feedback });
        if (res.score >= 60) onComplete(res.score);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-fg">{exercise.task}</p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
        {exercise.rubric.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="Escreva o prompt aqui…"
        className="w-full resize-y rounded-[var(--radius-md)] border border-border bg-raised px-3 py-2.5 font-mono text-sm text-fg outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex flex-wrap gap-2">
        <Button disabled={busy || text.trim().length < 40} onClick={() => void grade()}>
          {busy ? "Avaliando…" : "Avaliar prompt"}
        </Button>
        <Button
          variant="ghost"
          type="button"
          onClick={() => setText(exercise.sample)}
        >
          Ver exemplo
        </Button>
      </div>
      {result ? (
        <div className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3">
          <p className="text-sm font-medium tabular-nums">Nota {result.score}/100</p>
          <p className="mt-1 text-sm text-muted">{result.feedback}</p>
        </div>
      ) : null}
    </div>
  );
}
