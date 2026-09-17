import { useState } from "react";
import { Button } from "@/components/ui/button";
import { askIris } from "@/lib/ai-tutor";
import { TutorIris } from "./tutor-iris";

export function IrisChat({
  lessonTitle,
  context,
}: {
  lessonTitle?: string;
  context?: string;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<{ role: "you" | "iris"; text: string }[]>([]);

  async function send() {
    const message = input.trim();
    if (!message || busy) return;
    setInput("");
    setLog((l) => [...l, { role: "you", text: message }]);
    setBusy(true);
    const res = await askIris({ data: { message, lessonTitle, context } });
    setBusy(false);
    setLog((l) => [
      ...l,
      { role: "iris", text: res.ok ? res.text : res.error },
    ]);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-30 flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm text-fg shadow-lg"
      >
        <TutorIris size={36} mood="idle" />
        Perguntar à Íris
      </button>
    );
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-30 mx-auto flex max-h-[70vh] w-auto max-w-md flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-xl sm:right-4 sm:bottom-4 sm:left-auto sm:w-[380px]">
      <header className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <TutorIris size={40} mood={busy ? "think" : "talk"} />
          <div>
            <p className="text-sm font-medium">Íris</p>
            <p className="text-xs text-muted">Tutora</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Fechar
        </Button>
      </header>
      <div className="min-h-40 flex-1 space-y-3 overflow-y-auto p-3">
        {log.length === 0 ? (
          <p className="text-sm text-muted">
            Dúvida sobre a aula, um prompt travado, ou um loop de agente — manda aqui.
          </p>
        ) : (
          log.map((m, i) => (
            <p key={i} className="text-sm">
              <span className="text-subtle">{m.role === "you" ? "Você" : "Íris"} · </span>
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
          placeholder="Sua pergunta"
          className="h-11 flex-1 rounded-[var(--radius-sm)] border border-border bg-raised px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" disabled={busy || !input.trim()}>
          Enviar
        </Button>
      </form>
    </div>
  );
}
