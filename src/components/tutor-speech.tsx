import { useEffect, useState } from "react";
import type { Faculty } from "@/data/types";
import { TutorIris, type IrisMood } from "./tutor-iris";

export function TutorSpeech({ lines, faculty }: { lines: string[]; faculty: Faculty }) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState("");
  const [mood, setMood] = useState<IrisMood>("talk");

  useEffect(() => {
    setI(0);
  }, [lines]);

  useEffect(() => {
    const full = lines[i] ?? "";
    setShown("");
    setMood("talk");
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setShown(full.slice(0, n));
      if (n >= full.length) {
        window.clearInterval(id);
        setMood("idle");
      }
    }, 16);
    return () => window.clearInterval(id);
  }, [i, lines]);

  return (
    <div className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-4">
      <TutorIris mood={mood} size={88} core={faculty.core} ring={faculty.ring} lamp={faculty.lamp} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-subtle">
          {faculty.name} · {faculty.model}
        </p>
        <p className="mt-1 min-h-16 text-[15px] leading-relaxed text-fg">
          {shown}
          {mood === "talk" ? (
            <span className="ml-0.5 inline-block h-4 w-px bg-accent align-middle" />
          ) : null}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="h-9 rounded-[var(--radius-sm)] px-3 text-xs text-muted hover:text-fg"
            disabled={i === 0}
            onClick={() => setI((x) => Math.max(0, x - 1))}
          >
            Anterior
          </button>
          <button
            type="button"
            className="h-9 rounded-[var(--radius-sm)] px-3 text-xs text-muted hover:text-fg"
            disabled={i >= lines.length - 1}
            onClick={() => setI((x) => Math.min(lines.length - 1, x + 1))}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
