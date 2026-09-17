import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { IrisChat } from "@/components/iris-chat";
import { LessonBody } from "@/components/lesson-body";
import { PromptLab } from "@/components/prompt-lab";
import { PythonLab } from "@/components/python-lab";
import { QuizPanel } from "@/components/quiz-panel";
import { ReflectLab } from "@/components/reflect-lab";
import { Button } from "@/components/ui/button";
import { TutorSpeech } from "@/components/tutor-speech";
import { lessonById, nextLesson, prevLesson, TRACKS } from "@/data/course";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/aula/$lessonId")({
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const lesson = lessonById(lessonId);
  if (!lesson) {
    return (
      <div className="min-h-screen bg-bg px-4 py-16 text-center">
        <p className="text-fg">Aula não encontrada.</p>
        <Link to="/" className="mt-4 inline-block text-sm text-accent">
          Voltar
        </Link>
      </div>
    );
  }

  const current = lesson;

  const mark = useProgress((s) => s.mark);
  const progress = useProgress((s) => s.byLesson[current.id]);
  const track = TRACKS.find((t) => t.id === current.track);
  const next = nextLesson(current.id);
  const prev = prevLesson(current.id);
  const ctx = current.sections
    .map((s) => {
      if (s.type === "text") return s.body;
      if (s.type === "callout") return s.body;
      return "";
    })
    .filter(Boolean)
    .join("\n")
    .slice(0, 800);

  function complete() {
    mark(current.id, { completed: true });
  }

  return (
    <div className="min-h-screen bg-bg pb-28">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-xs uppercase tracking-wide text-subtle">
          {track?.label} · aula {current.order}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl">{current.title}</h1>
        <p className="mt-2 text-sm text-muted">{current.summary}</p>

        <div className="mt-6">
          <TutorSpeech lines={current.tutor} />
        </div>

        <div className="mt-8">
          <LessonBody sections={current.sections} />
        </div>

        <section className="mt-10 rounded-[var(--radius-lg)] border border-border bg-surface p-5">
          <h2 className="text-xl font-medium">Prática</h2>
          <div className="mt-4">
            {current.exercise.kind === "quiz" ? (
              <QuizPanel
                questions={current.exercise.questions}
                onComplete={(score, total) => {
                  mark(current.id, { quizScore: score, quizTotal: total, completed: true });
                }}
              />
            ) : null}
            {current.exercise.kind === "prompt" ? (
              <PromptLab
                exercise={current.exercise.exercise}
                onComplete={(score) => mark(current.id, { promptScore: score, completed: true })}
              />
            ) : null}
            {current.exercise.kind === "python" ? (
              <PythonLab
                exercise={current.exercise.exercise}
                onComplete={() => mark(current.id, { pythonOk: true, completed: true })}
              />
            ) : null}
            {current.exercise.kind === "reflect" ? (
              <ReflectLab
                prompt={current.exercise.prompt}
                minChars={current.exercise.minChars}
                onComplete={(text) => mark(current.id, { reflection: text, completed: true })}
              />
            ) : null}
          </div>
        </section>

        <nav className="mt-8 flex flex-wrap items-center justify-between gap-3">
          {prev ? (
            <Button variant="secondary" asChild>
              <Link to="/aula/$lessonId" params={{ lessonId: prev.id }}>
                Aula anterior
              </Link>
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap gap-2">
            {!progress?.completed ? (
              <Button variant="ghost" onClick={complete}>
                Marcar como lida
              </Button>
            ) : null}
            {next ? (
              <Button asChild>
                <Link to="/aula/$lessonId" params={{ lessonId: next.id }}>
                  Próxima aula
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/">Voltar ao mapa</Link>
              </Button>
            )}
          </div>
        </nav>
      </main>
      <IrisChat lessonTitle={current.title} context={ctx} />
    </div>
  );
}
