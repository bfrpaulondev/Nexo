import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, MessageSquare, PenLine } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { AulaChat } from "@/components/aula-chat";
import { LessonBody } from "@/components/lesson-body";
import { PromptLab } from "@/components/prompt-lab";
import { PythonLab } from "@/components/python-lab";
import { QuizPanel } from "@/components/quiz-panel";
import { ReflectLab } from "@/components/reflect-lab";
import { Button } from "@/components/ui/button";
import {
  facultyForLesson,
  lessonById,
  lessonNotes,
  nextLesson,
  practiceBrief,
  prevLesson,
  TRACKS,
} from "@/data/course";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aula/$lessonId")({
  component: LessonPage,
});

type Panel = "aula" | "notas" | "pratica";

function LessonPage() {
  const { lessonId } = Route.useParams();
  const [panel, setPanel] = useState<Panel>("aula");
  const mark = useProgress((s) => s.mark);
  const byLesson = useProgress((s) => s.byLesson);
  const lesson = lessonById(lessonId);

  useEffect(() => {
    setPanel("aula");
  }, [lessonId]);

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

  const faculty = facultyForLesson(lesson);
  const progress = byLesson[lesson.id];
  const track = TRACKS.find((t) => t.id === lesson.track);
  const next = nextLesson(lesson.id);
  const prev = prevLesson(lesson.id);

  const tabs: { id: Panel; label: string; icon: typeof MessageSquare }[] = [
    { id: "aula", label: faculty.name, icon: MessageSquare },
    { id: "notas", label: "Notas", icon: BookOpen },
    { id: "pratica", label: "Prática", icon: PenLine },
  ];

  return (
    <div className="min-h-screen bg-bg pb-16">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-xs uppercase tracking-wide text-subtle">
          Módulo {track?.n} · {track?.label} · {faculty.name}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl">{lesson.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">{lesson.summary}</p>

        <div className="mt-6 flex gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1 lg:hidden">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setPanel(t.id)}
              className={cn(
                "flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] text-xs",
                panel === t.id ? "bg-raised text-fg" : "text-muted",
              )}
            >
              <t.icon className="size-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className={cn(panel !== "aula" && "max-lg:hidden")}>
            <AulaChat
              key={lesson.id}
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              notes={lessonNotes(lesson)}
              practice={practiceBrief(lesson.exercise)}
              faculty={faculty}
              opening={lesson.tutor}
              allowConsult={lesson.track === "m9"}
            />
          </div>
          <div className="space-y-8">
            <div className={cn(panel !== "notas" && "max-lg:hidden")}>
              <LessonBody sections={lesson.sections} />
            </div>
            <section
              className={cn(
                "rounded-[var(--radius-lg)] border border-border bg-surface p-5",
                panel !== "pratica" && "max-lg:hidden",
              )}
            >
              <h2 className="text-xl font-medium">Prática</h2>
              <p className="mt-1 text-sm text-muted">{track?.practice}</p>
              <div className="mt-4">
                {lesson.exercise.kind === "quiz" ? (
                  <QuizPanel
                    questions={lesson.exercise.questions}
                    onComplete={(score, total) => {
                      mark(lesson.id, { quizScore: score, quizTotal: total, completed: true });
                    }}
                  />
                ) : null}
                {lesson.exercise.kind === "prompt" ? (
                  <PromptLab
                    exercise={lesson.exercise.exercise}
                    onComplete={(score) => mark(lesson.id, { promptScore: score, completed: true })}
                  />
                ) : null}
                {lesson.exercise.kind === "python" ? (
                  <PythonLab
                    exercise={lesson.exercise.exercise}
                    onComplete={() => mark(lesson.id, { pythonOk: true, completed: true })}
                  />
                ) : null}
                {lesson.exercise.kind === "reflect" ? (
                  <ReflectLab
                    prompt={lesson.exercise.prompt}
                    minChars={lesson.exercise.minChars}
                    onComplete={(text) => mark(lesson.id, { reflection: text, completed: true })}
                  />
                ) : null}
              </div>
            </section>
          </div>
        </div>

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
              <Button variant="ghost" onClick={() => mark(lesson.id, { completed: true })}>
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
    </div>
  );
}
