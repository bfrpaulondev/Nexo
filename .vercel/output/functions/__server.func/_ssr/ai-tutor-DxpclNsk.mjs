import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-tutor-DxpclNsk.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SYSTEM = `Você é a Íris, tutora da academia NEXO (prompt engineering, orquestração de IAs e agentes).
Fale em português do Brasil, tom direto, sem elogio vazio, sem emoji.
Respostas curtas (máx. 180 palavras). Ensine com contratos, exemplos e correções concretas.
Se o aluno colar um prompt, critique com rubrica: papel, objetivo, restrições, formato, bordos.
Nunca invente APIs. Se faltar contexto, faça uma pergunta.`;
var askIris_createServerFn_handler = createServerRpc({
	id: "175dc3c021eff0421da7c49d45e17b3f90c02a455a9954d390f4367e6a855f9d",
	name: "askIris",
	filename: "src/lib/ai-tutor.ts"
}, (opts) => askIris.__executeServer(opts));
var askIris = createServerFn({ method: "POST" }).validator((input) => input).handler(askIris_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "A tutora está indisponível neste momento."
	};
	const user = [
		data.lessonTitle ? `Aula atual: ${data.lessonTitle}` : "",
		data.context ? `Contexto da aula:\n${data.context.slice(0, 1200)}` : "",
		data.message.slice(0, 2e3)
	].filter(Boolean).join("\n\n");
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 420,
			temperature: .4,
			messages: [{
				role: "system",
				content: SYSTEM
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: "Não consegui responder agora. Tente de novo."
	};
	return {
		ok: true,
		text: (await res.json()).choices[0]?.message.content ?? ""
	};
});
var gradePrompt_createServerFn_handler = createServerRpc({
	id: "d5b7a3d738aa851a7c4f6a649b87fc5a4550661ba903122a5242836037b9e82f",
	name: "gradePrompt",
	filename: "src/lib/ai-tutor.ts"
}, (opts) => gradePrompt.__executeServer(opts));
var gradePrompt = createServerFn({ method: "POST" }).validator((input) => input).handler(gradePrompt_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) {
		const local = localGrade(data.student, data.rubric);
		return {
			ok: true,
			score: local.score,
			feedback: local.feedback,
			local: true
		};
	}
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 350,
			temperature: .2,
			messages: [{
				role: "system",
				content: "Você avalia prompts de alunos. Responda SOMENTE JSON: {\"score\":0-100,\"feedback\":\"...\"}. Português, sem markdown."
			}, {
				role: "user",
				content: `Tarefa: ${data.task}\nEspecificação: ${data.spec}\nRubrica:\n- ${data.rubric.join("\n- ")}\n\nPrompt do aluno:\n${data.student.slice(0, 2500)}`
			}]
		})
	});
	if (!res.ok) {
		const local = localGrade(data.student, data.rubric);
		return {
			ok: true,
			score: local.score,
			feedback: local.feedback,
			local: true
		};
	}
	const raw = (await res.json()).choices[0]?.message.content ?? "";
	try {
		const jsonStart = raw.indexOf("{");
		const jsonEnd = raw.lastIndexOf("}");
		const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
		return {
			ok: true,
			score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
			feedback: String(parsed.feedback ?? ""),
			local: false
		};
	} catch {
		const local = localGrade(data.student, data.rubric);
		return {
			ok: true,
			score: local.score,
			feedback: raw.slice(0, 600) || local.feedback,
			local: true
		};
	}
});
function localGrade(student, rubric) {
	const t = student.toLowerCase();
	let hits = 0;
	const notes = [];
	for (const r of rubric) if (r.toLowerCase().split(/\W+/).filter((w) => w.length > 4).slice(0, 3).some((k) => t.includes(k)) || t.length > 80) hits += 1;
	else notes.push(`Faltou cobrir: ${r}`);
	if (t.includes("json") || t.includes("formato")) hits += .25;
	if (t.includes("não") || t.includes("nao") || t.includes("null")) hits += .25;
	const score = Math.round(hits / (rubric.length + .5) * 100);
	return {
		score: Math.max(10, Math.min(95, score)),
		feedback: notes.length ? notes.join(" ") : "Estrutura reconhecível. Refine restrições e o caso em que o dado falta."
	};
}
//#endregion
export { askIris_createServerFn_handler, gradePrompt_createServerFn_handler };
