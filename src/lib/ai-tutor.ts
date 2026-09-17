import { createServerFn } from "@tanstack/react-start";

const SYSTEM = `Você é a Íris, tutora da academia NEXO (prompt engineering, orquestração de IAs e agentes).
Fale em português do Brasil, tom direto, sem elogio vazio, sem emoji.
Respostas curtas (máx. 180 palavras). Ensine com contratos, exemplos e correções concretas.
Se o aluno colar um prompt, critique com rubrica: papel, objetivo, restrições, formato, bordos.
Nunca invente APIs. Se faltar contexto, faça uma pergunta.`;

export const askIris = createServerFn({ method: "POST" })
  .validator((input: { message: string; lessonTitle?: string; context?: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "A tutora está indisponível neste momento." };

    const user = [
      data.lessonTitle ? `Aula atual: ${data.lessonTitle}` : "",
      data.context ? `Contexto da aula:\n${data.context.slice(0, 1200)}` : "",
      data.message.slice(0, 2000),
    ]
      .filter(Boolean)
      .join("\n\n");

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 420,
        temperature: 0.4,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: "Não consegui responder agora. Tente de novo." };
    }

    const body = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    return { ok: true as const, text: body.choices[0]?.message.content ?? "" };
  });

export const gradePrompt = createServerFn({ method: "POST" })
  .validator((input: { student: string; task: string; rubric: string[]; spec: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      const local = localGrade(data.student, data.rubric);
      return { ok: true as const, score: local.score, feedback: local.feedback, local: true };
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 350,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "Você avalia prompts de alunos. Responda SOMENTE JSON: {\"score\":0-100,\"feedback\":\"...\"}. Português, sem markdown.",
          },
          {
            role: "user",
            content: `Tarefa: ${data.task}\nEspecificação: ${data.spec}\nRubrica:\n- ${data.rubric.join("\n- ")}\n\nPrompt do aluno:\n${data.student.slice(0, 2500)}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const local = localGrade(data.student, data.rubric);
      return { ok: true as const, score: local.score, feedback: local.feedback, local: true };
    }

    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    const raw = body.choices[0]?.message.content ?? "";
    try {
      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");
      const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as {
        score: number;
        feedback: string;
      };
      return {
        ok: true as const,
        score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
        feedback: String(parsed.feedback ?? ""),
        local: false,
      };
    } catch {
      const local = localGrade(data.student, data.rubric);
      return { ok: true as const, score: local.score, feedback: raw.slice(0, 600) || local.feedback, local: true };
    }
  });

function localGrade(student: string, rubric: string[]) {
  const t = student.toLowerCase();
  let hits = 0;
  const notes: string[] = [];
  for (const r of rubric) {
    const keys = r
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 4)
      .slice(0, 3);
    const ok = keys.some((k) => t.includes(k)) || t.length > 80;
    if (ok) hits += 1;
    else notes.push(`Faltou cobrir: ${r}`);
  }
  if (t.includes("json") || t.includes("formato")) hits += 0.25;
  if (t.includes("não") || t.includes("nao") || t.includes("null")) hits += 0.25;
  const score = Math.round((hits / (rubric.length + 0.5)) * 100);
  return {
    score: Math.max(10, Math.min(95, score)),
    feedback: notes.length
      ? notes.join(" ")
      : "Estrutura reconhecível. Refine restrições e o caso em que o dado falta.",
  };
}
