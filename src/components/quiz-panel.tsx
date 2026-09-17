import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/data/types";
import { cn } from "@/lib/utils";

export function QuizPanel({
  questions,
  onComplete,
}: {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    return questions.filter((q) => answers[q.id] === q.answer).length;
  }, [answers, questions]);

  return (
    <div className="space-y-5">
      {questions.map((q, i) => (
        <fieldset key={q.id} className="space-y-2">
          <legend className="text-sm font-medium text-fg">
            {i + 1}. {q.prompt}
          </legend>
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              const selected = answers[q.id] === idx;
              const correct = submitted && idx === q.answer;
              const wrong = submitted && selected && idx !== q.answer;
              return (
                <label
                  key={opt}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-start gap-3 rounded-[var(--radius-sm)] border px-3 py-2.5 text-sm",
                    selected && !submitted && "border-accent bg-raised",
                    correct && "border-ok bg-raised",
                    wrong && "border-danger",
                    !selected && !correct && "border-border hover:bg-raised",
                  )}
                >
                  <input
                    type="radio"
                    className="mt-1"
                    name={q.id}
                    disabled={submitted}
                    checked={selected}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
          {submitted ? <p className="text-sm text-muted">{q.explain}</p> : null}
        </fieldset>
      ))}
      {!submitted ? (
        <Button
          disabled={Object.keys(answers).length < questions.length}
          onClick={() => {
            setSubmitted(true);
            onComplete(score, questions.length);
          }}
        >
          Conferir
        </Button>
      ) : (
        <p className="text-sm text-fg">
          {score} de {questions.length} corretas.
        </p>
      )}
    </div>
  );
}
