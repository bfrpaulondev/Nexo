import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ChatTurn, Faculty } from "@/data/types";
import { FACULTY } from "@/data/faculty";
import { askTutor } from "@/lib/ai-tutor";
import { useProgress } from "@/lib/progress";
import { TutorIris } from "./tutor-iris";
import { cn } from "@/lib/utils";

const START_MSG =
  "Dá a aula: explica o ponto central em três passos curtos e faz-me uma pergunta de verificação no fim.";

export function AulaChat({
  lessonId,
  lessonTitle,
  notes,
  practice,
  faculty,
  opening,
  allowConsult,
}: {
  lessonId: string;
  lessonTitle: string;
  notes: string;
  practice: string;
  faculty: Faculty;
  opening: string[];
  allowConsult?: boolean;
}) {
  const stored = useProgress((s) => s.chats[lessonId]);
  const setChat = useProgress((s) => s.setChat);
  const seed: ChatTurn[] = [
    { role: "tutor", text: opening.join("\n\n"), speaker: faculty.name },
  ];
  const [log, setLog] = useState<ChatTurn[]>(stored?.length ? stored : seed);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [who, setWho] = useState(faculty);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const el = scroller.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
    return () => window.cancelAnimationFrame(id);
  }, [log, busy]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setInput("");
    const next: ChatTurn[] = [...log, { role: "you", text: message }];
    setLog(next);
    setBusy(true);
    try {
      const res = await askTutor({
        data: {
          message,
          facultyId: who.id,
          lessonTitle,
          notes,
          practice,
          history: next.slice(0, -1),
        },
      });
      const full = [
        ...next,
        {
          role: "tutor" as const,
          text: res.text,
          speaker: who.name,
        },
      ];
      setLog(full);
      setChat(lessonId, full);
    } catch {
      const full: ChatTurn[] = [
        ...next,
        {
          role: "tutor",
          text: "Não consegui falar com o modelo agora. Tenta outra vez.",
          speaker: who.name,
        },
      ];
      setLog(full);
    } finally {
      setBusy(false);
    }
  }

  function switchFaculty(id: string) {
    const f = FACULTY.find((x) => x.id === id);
    if (!f || f.id === who.id) return;
    setWho(f);
    const full = [
      ...log,
      {
        role: "tutor" as const,
        text: `${f.name} entra na sala (${f.model}). ${f.style}`,
        speaker: f.name,
      },
    ];
    setLog(full);
    setChat(lessonId, full);
  }

  return (
    <section className="flex min-h-[32rem] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface lg:sticky lg:top-16 lg:max-h-[calc(100vh-5.5rem)]">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <TutorIris
            size={48}
            mood={busy ? "think" : "talk"}
            core={who.core}
            ring={who.ring}
            lamp={who.lamp}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-fg">
              {who.name} · {who.model}
            </p>
            <p className="truncate text-xs text-muted">{who.role} · GLM-5.3</p>
          </div>
        </div>
        {allowConsult ? (
          <label className="shrink-0 text-xs text-subtle">
            Consultar
            <select
              value={who.id}
              onChange={(e) => switchFaculty(e.target.value)}
              className="ml-2 h-9 rounded-[var(--radius-sm)] border border-border bg-raised px-2 text-xs text-fg"
            >
              {FACULTY.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </header>

      <div ref={scroller} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {log.map((m, i) => (
          <div key={`${i}-${m.role}`} className={cn(m.role === "you" && "pl-6")}>
            <p className="text-[11px] uppercase tracking-wide text-subtle">
              {m.role === "you" ? "Tu" : m.speaker ?? who.name}
            </p>
            <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-fg">{m.text}</p>
          </div>
        ))}
        {busy ? <p className="text-sm text-muted">{who.name} a pensar…</p> : null}
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {who.starters.map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => void send(s === "Dá a aula" ? START_MSG : s)}
              className="h-9 rounded-full border border-border bg-raised px-3 text-xs text-muted hover:text-fg disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <textarea
            value={input}
            rows={2}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder={`Fala com ${who.name}…`}
            className="min-h-11 flex-1 resize-none rounded-[var(--radius-sm)] border border-border bg-raised px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" disabled={busy || !input.trim()} className="self-end">
            Enviar
          </Button>
        </form>
      </div>
    </section>
  );
}
