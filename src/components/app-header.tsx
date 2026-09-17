import { Link } from "@tanstack/react-router";
import { LESSONS } from "@/data/course";
import { completedCount, useProgress } from "@/lib/progress";

export function AppHeader() {
  const byLesson = useProgress((s) => s.byLesson);
  const done = completedCount(byLesson);
  const pct = Math.round((done / LESSONS.length) * 100);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link to="/" className="font-display text-lg tracking-tight text-fg">
          NEXO
        </Link>
        <div className="flex items-center gap-3">
          <p className="hidden text-xs tabular-nums text-muted sm:block">
            {done}/{LESSONS.length} aulas
          </p>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-raised">
            <div
              className="h-full bg-accent transition-[width] duration-[var(--motion-fast)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
