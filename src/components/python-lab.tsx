import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PythonExercise } from "@/data/types";
import { runPython } from "@/lib/pyodide";

export function PythonLab({
  exercise,
  onComplete,
}: {
  exercise: PythonExercise;
  onComplete: () => void;
}) {
  const [code, setCode] = useState(exercise.starter);
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [passed, setPassed] = useState(false);

  async function run(withTests: boolean) {
    setBusy(true);
    setOutput(withTests ? "Carregando Python no navegador…" : "Executando…");
    const payload = withTests ? `${code}\n\n${exercise.tests}` : code;
    const res = await runPython(payload);
    setBusy(false);
    setOutput(res.output);
    if (withTests && res.ok && res.output.includes("ok")) {
      setPassed(true);
      onComplete();
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">{exercise.intro}</p>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        rows={14}
        className="w-full resize-y rounded-[var(--radius-md)] border border-border bg-raised px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-fg outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex flex-wrap gap-2">
        <Button disabled={busy} onClick={() => void run(true)}>
          {busy ? "Rodando…" : "Rodar testes"}
        </Button>
        <Button variant="secondary" disabled={busy} onClick={() => void run(false)}>
          Executar
        </Button>
        <Button variant="ghost" type="button" onClick={() => setCode(exercise.solution)}>
          Ver solução
        </Button>
      </div>
      <pre className="min-h-16 overflow-x-auto rounded-[var(--radius-md)] border border-border bg-bg p-3 font-mono text-xs text-muted">
        {output || "A saída aparece aqui. O motor Python roda no seu navegador."}
      </pre>
      {passed ? <p className="text-sm text-ok">Testes ok. Aula pode ser marcada como concluída.</p> : null}
    </div>
  );
}
