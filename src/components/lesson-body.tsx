import { CodeBlock } from "@/components/code-block";
import type { Section } from "@/data/types";
import { cn } from "@/lib/utils";

export function LessonBody({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-6">
      {sections.map((s, i) => {
        if (s.type === "text") {
          return (
            <section key={i}>
              {s.title ? <h3 className="mb-2 text-xl font-medium">{s.title}</h3> : null}
              <p className="text-[15px] leading-relaxed text-muted">{s.body}</p>
            </section>
          );
        }
        if (s.type === "code") {
          return <CodeBlock key={i} code={s.code} title={s.title} />;
        }
        if (s.type === "steps") {
          return (
            <section key={i}>
              {s.title ? <h3 className="mb-3 text-xl font-medium">{s.title}</h3> : null}
              <ol className="space-y-2">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2.5 text-sm text-fg"
                  >
                    {item}
                  </li>
                ))}
              </ol>
            </section>
          );
        }
        return (
          <aside
            key={i}
            className={cn(
              "rounded-[var(--radius-md)] border px-4 py-3 text-sm",
              s.tone === "key" && "border-accent/40 bg-raised",
              s.tone === "tip" && "border-border bg-surface text-muted",
              s.tone === "warn" && "border-warn/40 bg-surface",
            )}
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-subtle">
              {s.tone === "key" ? "Princípio" : s.tone === "tip" ? "Nota" : "Cuidado"}
            </p>
            {s.body}
          </aside>
        );
      })}
    </div>
  );
}
