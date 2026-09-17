import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { IrisChat } from "@/components/iris-chat";
import { TutorIris } from "@/components/tutor-iris";
import { LESSONS, TRACKS, lessonsInTrack } from "@/data/course";
import { completedCount, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const byLesson = useProgress((s) => s.byLesson);
  const done = completedCount(byLesson);
  const next = LESSONS.find((l) => !byLesson[l.id]?.completed) ?? LESSONS[0];

  return (
    <div className="min-h-screen bg-bg pb-24">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <TutorIris mood="idle" size={132} />
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.18em] text-subtle">Academia</p>
            <h1 className="mt-2 text-4xl text-fg sm:text-5xl">NEXO</h1>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">
              Curso interativo do básico ao expert: prompts, RAG, function calling,
              orquestração e agentes em Python — com a tutora Íris ao lado.
            </p>
            <Link
              to="/aula/$lessonId"
              params={{ lessonId: next.id }}
              className="mt-5 inline-flex h-12 items-center rounded-[var(--radius-sm)] bg-accent px-5 text-sm font-medium text-accent-fg"
            >
              {done === 0 ? "Começar pela fundação" : `Continuar: ${next.title}`}
            </Link>
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          {TRACKS.map((t) => {
            const list = lessonsInTrack(t.id);
            const c = list.filter((l) => byLesson[l.id]?.completed).length;
            return (
              <article
                key={t.id}
                className="rounded-[var(--radius-lg)] border border-border bg-surface p-5"
              >
                <p className="text-xs uppercase tracking-wide text-subtle">{t.level}</p>
                <h2 className="mt-1 text-2xl font-medium">{t.label}</h2>
                <p className="mt-2 text-sm text-muted">{t.blurb}</p>
                <p className="mt-4 text-xs tabular-nums text-subtle">
                  {c}/{list.length} concluídas
                </p>
                <ul className="mt-3 space-y-1.5">
                  {list.map((l) => (
                    <li key={l.id}>
                      <Link
                        to="/aula/$lessonId"
                        params={{ lessonId: l.id }}
                        className="flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-sm)] px-2 text-sm hover:bg-raised"
                      >
                        <span className="text-fg">{l.title}</span>
                        <span className="shrink-0 text-xs tabular-nums text-subtle">
                          {byLesson[l.id]?.completed ? "feita" : `${l.minutes} min`}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </section>
      </main>
      <IrisChat />
    </div>
  );
}
