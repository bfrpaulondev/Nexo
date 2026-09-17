import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Faculty } from "@/data/types";
import { facultyById } from "@/data/faculty";
import { askTutor } from "@/lib/ai-tutor";
import { TutorIris } from "./tutor-iris";

export function IrisChat({ faculty }: { faculty?: Faculty }) {
  const f = faculty ?? facultyById("iris");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<{ role: "you" | "tutor"; text: string }[]>([]);

  async function send() {
    const message = input.trim();
    if (!message || busy) return;
    setInput("");
    const next = [...log, { role: "you" as const, text: message }];
    setLog(next);
    setBusy(true);
    const res = await askTutor({
      data: {
        message,
        facultyId: f.id,
        lessonTitle: "Mapa da academia NEXO",
        notes:
          "Nove módulos, cada um com um professor de IA. A aula acontece no chat. Prática em todas as aulas.",
        history: log,
      },
    });
    setBusy(false);
    setLog([...next, { role: "tutor", text: res.text }]);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-30 flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm text-fg shadow-lg"
      >
        <TutorIris size={36} mood="idle" core={f.core} ring={f.ring} lamp={f.lamp} />
        Falar com a Íris
      </button>
    );
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-30 mx-auto flex max-h-[70vh] w-auto max-w-md flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-xl sm:right-4 sm:bottom-4 sm:left-auto sm:w-[380px]">
      <header className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <TutorIris size={40} mood={busy ? "think" : "talk"} core={f.core} ring={f.ring} lamp={f.lamp} />
          <div>
            <p className="text-sm font-medium">{f.name}</p>
            <p className="text-xs text-muted">{f.role}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Fechar
        </Button>
      </header>
      <div className="min-h-40 flex-1 space-y-3 overflow-y-auto p-3">
        {log.length === 0 ? (
          <p className="text-sm text-muted">
            Directora da NEXO. Pergunta pelo percurso, por um módulo, ou por que a aula é um chat.
          </p>
        ) : (
          log.map((m, i) => (
            <p key={i} className="text-sm">
              <span className="text-subtle">{m.role === "you" ? "Tu" : f.name} · </span>
              {m.text}
            </p>
          ))
        )}
      </div>
      <form
        className="flex gap-2 border-t border-border p-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="A tua pergunta"
          className="h-11 flex-1 rounded-[var(--radius-sm)] border border-border bg-raised px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" disabled={busy || !input.trim()}>
          Enviar
        </Button>
      </form>
    </div>
  );
}
