export function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <figure className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-raised">
      {title ? (
        <figcaption className="border-b border-border px-3 py-2 text-xs text-muted">{title}</figcaption>
      ) : null}
      <pre className="overflow-x-auto p-3 text-[12.5px] leading-relaxed text-fg">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
