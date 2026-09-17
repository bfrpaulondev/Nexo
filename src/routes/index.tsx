import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { IrisChat } from "@/components/iris-chat";
import { TutorIris } from "@/components/tutor-iris";
import { facultyById } from "@/data/faculty";
import { LESSONS, TRACKS, lessonsInTrack } from "@/data/course";
import { completedCount, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const byLesson = useProgress((s) => s.byLesson);
  const done = completedCount(byLesson);
  const next = LESSONS.find((l) => !byLesson[l.id]?.completed) ?? LESSONS[0];
  const iris = facultyById("iris");

  return (
    <div className="min-h-screen bg-bg pb-24">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <TutorIris mood="idle" size={132} core={iris.core} ring={iris.ring} lamp={iris.lamp} />
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.18em] text-subtle">Academia</p>
            <h1 className="mt-2 text-4xl text-fg sm:text-5xl">NEXO</h1>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">
              Nove módulos, nove professores. O chat corre no GLM-5.3 da
              NVIDIA — do uso responsável até orquestração de agentes.
            </p>
            <Link
              to="/aula/$lessonId"
              params={{ lessonId: next.id }}
              className="mt-5 inline-flex h-12 items-center rounded-[var(--radius-sm)] bg-accent px-5 text-sm font-medium text-accent-fg"
            >
              {done === 0 ? "Começar com a Lena" : `Continuar: ${next.title}`}
            </Link>
          </div>
        </section>

        <section className="mt-12 grid gap-3 sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Um modelo por módulo",
              d: "Cada especialidade tem um professor com contrato próprio: crítico, conversa, spec, pesquisa, loops, agentes, supervisão, métrica, direcção.",
            },
            {
              n: "02",
              t: "A aula é o chat",
              d: "Não é um PDF com um chatbot ao lado. Perguntas, correcções e exemplos no fio — o sítio onde vais trabalhar com IAs.",
            },
            {
              n: "03",
              t: "Prática em todas",
              d: "Quiz, laboratório de prompt, Python no browser ou reflexão. Sem prática a fluência não conta.",
            },
          ].map((s) => (
            <article
              key={s.n}
              className="rounded-[var(--radius-lg)] border border-border bg-surface p-5"
            >
              <p className="text-xs tabular-nums text-subtle">{s.n}</p>
              <h2 className="mt-2 text-lg font-medium">{s.t}</h2>
              <p className="mt-2 text-sm text-muted">{s.d}</p>
            </article>
          ))}
        </section>

        <section className="mt-14">
          <p className="text-xs uppercase tracking-[0.18em] text-subtle">Corpo docente</p>
          <h2 className="mt-2 text-2xl">Nove modelos, uma casa</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            O motor é o mesmo. O que muda é o contrato: temperatura, rubrica,
            o que recusa. É a lição do módulo 8, visível desde o primeiro dia.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((t) => {
              const f = facultyById(t.facultyId);
              const first = lessonsInTrack(t.id)[0];
              return (
                <li key={t.id}>
                  <Link
                    to="/aula/$lessonId"
                    params={{ lessonId: first.id }}
                    className="flex min-h-24 items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-4 hover:bg-raised"
                  >
                    <TutorIris size={44} core={f.core} ring={f.ring} lamp={f.lamp} />
                    <span className="min-w-0">
                      <span className="block text-xs text-subtle">
                        {f.name} · {f.model}
                      </span>
                      <span className="mt-0.5 block font-medium text-fg">{t.label}</span>
                      <span className="mt-1 block text-sm text-muted">{f.style}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-14">
          <p className="text-xs uppercase tracking-[0.18em] text-subtle">Percurso</p>
          <h2 className="mt-2 text-2xl">Do entendimento ao projecto</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            A ordem não é acidental: primeiro perceber o que a IA finge, depois
            conversar e especificar, só então RAG, loops, agentes, portas humanas
            e métrica. O projecto junta o corpo docente.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((t) => {
              const list = lessonsInTrack(t.id);
              const c = list.filter((l) => byLesson[l.id]?.completed).length;
              const f = facultyById(t.facultyId);
              return (
                <article
                  key={t.id}
                  className="rounded-[var(--radius-lg)] border border-border bg-surface p-5"
                >
                  <div className="flex items-start gap-3">
                    <TutorIris size={48} core={f.core} ring={f.ring} lamp={f.lamp} />
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-subtle">
                        Módulo {t.n} · {f.name}
                      </p>
                      <h3 className="mt-1 text-xl font-medium">{t.label}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted">{t.learn}</p>
                  <p className="mt-2 text-sm text-fg">Prática: {t.practice}</p>
                  <p className="mt-3 text-xs tabular-nums text-subtle">
                    {c}/{list.length} concluídas
                  </p>
                  <ul className="mt-2 space-y-1">
                    {list.map((l) => (
                      <li key={l.id}>
                        <Link
                          to="/aula/$lessonId"
                          params={{ lessonId: l.id }}
                          className="flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-sm)] px-1 text-sm hover:bg-raised"
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
          </div>
        </section>
      </main>
      <IrisChat />
    </div>
  );
}
