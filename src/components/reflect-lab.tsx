import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ReflectLab({
  prompt,
  minChars,
  onComplete,
}: {
  prompt: string;
  minChars: number;
  onComplete: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const ready = text.trim().length >= minChars;

  return (
    <div className="space-y-3">
      <p className="text-sm text-fg">{prompt}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="w-full resize-y rounded-[var(--radius-md)] border border-border bg-raised px-3 py-2.5 text-sm text-fg outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs tabular-nums text-subtle">
          {text.trim().length}/{minChars}
        </p>
        <Button disabled={!ready} onClick={() => onComplete(text.trim())}>
          Registrar reflexão
        </Button>
      </div>
    </div>
  );
}
