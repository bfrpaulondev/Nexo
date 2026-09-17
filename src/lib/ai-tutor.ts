import { createServerFn } from "@tanstack/react-start";
import { facultyById } from "@/data/faculty";
import type { Faculty } from "@/data/types";

type HistoryTurn = { role: "you" | "tutor"; text: string };

type AskInput = {
  message: string;
  facultyId?: string;
  lessonTitle?: string;
  notes?: string;
  practice?: string;
  history?: HistoryTurn[];
};

export const askTutor = createServerFn({ method: "POST" })
  .validator((input: AskInput) => input)
  .handler(async ({ data }) => {
    const faculty = facultyById(data.facultyId ?? "iris");
    const messages = buildTutorMessages(data, faculty);
    try {
      const { nvidiaChat } = await import("@/lib/nvidia.server");
      const text = await nvidiaChat(messages, {
        temperature: faculty.temperature,
        maxTokens: 1024,
      });
      if (text) return { ok: true as const, text };
    } catch (err) {
      console.error("[nexo] nvidia tutor failed", err);
    }

    const xai = await grokChat(messages, faculty.temperature, 380);
    if (xai) return { ok: true as const, text: xai };

    return { ok: true as const, text: localTeach(data, faculty) };
  });

function buildTutorMessages(data: AskInput, faculty: Faculty) {
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: faculty.system },
  ];

  const briefing = [
    data.lessonTitle ? `Aula: ${data.lessonTitle}` : "",
    data.notes ? `Notas da aula (currículo):\n${data.notes.slice(0, 900)}` : "",
    data.practice ? `Prática prevista:\n${data.practice.slice(0, 600)}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  if (briefing) {
    messages.push({
      role: "user",
      content: `Material da aula (não é o aluno a falar):\n${briefing}`,
    });
    messages.push({
      role: "assistant",
      content: "Recebi as notas. Ensino só a partir delas e faço perguntas de verificação.",
    });
  }

  for (const turn of (data.history ?? []).slice(-8)) {
    const text = turn.text.slice(0, 1200);
    if (!text) continue;
    messages.push({
      role: turn.role === "you" ? "user" : "assistant",
      content: text,
    });
  }

  messages.push({ role: "user", content: data.message.slice(0, 2000) });
  return messages;
}

async function grokChat(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  temperature: number,
  maxTokens: number,
) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      max_tokens: maxTokens,
      temperature,
      messages,
    }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return body.choices?.[0]?.message?.content?.trim() || null;
}

function localTeach(data: AskInput, faculty: Faculty) {
  const beats = (data.notes ?? "")
    .split(/\n\n+/)
    .map((b) => b.replace(/\s+/g, " ").trim())
    .filter((b) => b.length > 24);
  const msg = data.message.toLowerCase();
  const lead = `${faculty.name} (${faculty.model}).`;
  const title = data.lessonTitle ? ` ${data.lessonTitle}.` : "";

  if (
    msg.includes("dá a aula") ||
    msg.includes("da a aula") ||
    msg.includes("explica o ponto") ||
    msg.includes("três passos") ||
    msg.includes("tres passos")
  ) {
    const steps = beats.slice(0, 3).map((b, i) => `${i + 1}. ${b.slice(0, 240)}`);
    return `${lead}${title}\n\n${steps.join("\n\n") || faculty.style}\n\nPergunta: se tirares o tom confiante desta matéria, o que ainda se aguenta?`;
  }

  if (msg.includes("testa") || msg.includes("parágrafo") || msg.includes("paragrafo")) {
    return `${lead} Fecha as notas. ${data.practice ?? "Explica o princípio desta aula em duas frases."}\n\nDepois diz que evidência pedias ao modelo.`;
  }

  const words = msg.split(/\W+/).filter((w) => w.length > 4);
  const hit =
    beats.find((b) => words.some((w) => b.toLowerCase().includes(w))) ?? beats[0] ?? faculty.style;
  return `${lead}\n\n${hit.slice(0, 520)}\n\n${faculty.style} Responde em uma frase, ou pede um exemplo.`;
}

export const gradePrompt = createServerFn({ method: "POST" })
  .validator((input: { student: string; task: string; rubric: string[]; spec: string }) => input)
  .handler(async ({ data }) => {
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      {
        role: "system",
        content:
          'Avalias prompts de alunos da NEXO. Responde SOMENTE JSON: {"score":0-100,"feedback":"..."}. Português europeu, sem markdown, sem raciocínio.',
      },
      {
        role: "user",
        content: `Tarefa: ${data.task}\nEspecificação: ${data.spec}\nRubrica:\n- ${data.rubric.join("\n- ")}\n\nPrompt do aluno:\n${data.student.slice(0, 2500)}`,
      },
    ];

    const glm = await (async () => {
      try {
        const { nvidiaChat } = await import("@/lib/nvidia.server");
        return await nvidiaChat(messages, { temperature: 0.2, maxTokens: 1024 });
      } catch (err) {
        console.error("[nexo] nvidia grade failed", err);
        return null;
      }
    })();
    const raw = glm || (await grokChat(messages, 0.2, 350)) || "";
    if (raw) {
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
        return {
          ok: true as const,
          score: local.score,
          feedback: raw.slice(0, 600) || local.feedback,
          local: true,
        };
      }
    }

    const local = localGrade(data.student, data.rubric);
    return { ok: true as const, score: local.score, feedback: local.feedback, local: true };
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
      : "Estrutura reconhecível. Refina restrições e o caso em que o dado falta.",
  };
}
