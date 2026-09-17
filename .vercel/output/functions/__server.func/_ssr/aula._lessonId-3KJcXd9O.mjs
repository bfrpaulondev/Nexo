import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route } from "./router-D_hJw81X.mjs";
import { a as TRACKS, f as nextLesson, l as gradePrompt, m as useProgress, n as Button, o as TutorIris, p as prevLesson, r as IrisChat, s as cn, t as AppHeader, u as lessonById } from "./iris-chat-IQL-qC7C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/aula._lessonId-3KJcXd9O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CodeBlock({ code, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "overflow-hidden rounded-[var(--radius-md)] border border-border bg-raised",
		children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
			className: "border-b border-border px-3 py-2 text-xs text-muted",
			children: title
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "overflow-x-auto p-3 text-[12.5px] leading-relaxed text-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code })
		})]
	});
}
function LessonBody({ sections }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: sections.map((s, i) => {
			if (s.type === "text") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [s.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-xl font-medium",
				children: s.title
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[15px] leading-relaxed text-muted",
				children: s.body
			})] }, i);
			if (s.type === "code") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
				code: s.code,
				title: s.title
			}, i);
			if (s.type === "steps") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [s.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 text-xl font-medium",
				children: s.title
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-2",
				children: s.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2.5 text-sm text-fg",
					children: item
				}, item))
			})] }, i);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("rounded-[var(--radius-md)] border px-4 py-3 text-sm", s.tone === "key" && "border-accent/40 bg-raised", s.tone === "tip" && "border-border bg-surface text-muted", s.tone === "warn" && "border-warn/40 bg-surface"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-xs font-medium uppercase tracking-wide text-subtle",
					children: s.tone === "key" ? "Princípio" : s.tone === "tip" ? "Nota" : "Cuidado"
				}), s.body]
			}, i);
		})
	});
}
function PromptLab({ exercise, onComplete }) {
	const [text, setText] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	async function grade() {
		setBusy(true);
		try {
			const res = await gradePrompt({ data: {
				student: text,
				task: exercise.task,
				rubric: exercise.rubric,
				spec: exercise.hiddenSpec
			} });
			if (res.ok) {
				setResult({
					score: res.score,
					feedback: res.feedback
				});
				if (res.score >= 60) onComplete(res.score);
			}
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg",
				children: exercise.task
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "list-disc space-y-1 pl-5 text-sm text-muted",
				children: exercise.rubric.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: r }, r))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: text,
				onChange: (e) => setText(e.target.value),
				rows: 10,
				placeholder: "Escreva o prompt aqui…",
				className: "w-full resize-y rounded-[var(--radius-md)] border border-border bg-raised px-3 py-2.5 font-mono text-sm text-fg outline-none focus:ring-2 focus:ring-ring"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy || text.trim().length < 40,
					onClick: () => void grade(),
					children: busy ? "Avaliando…" : "Avaliar prompt"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					type: "button",
					onClick: () => setText(exercise.sample),
					children: "Ver exemplo"
				})]
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-medium tabular-nums",
					children: [
						"Nota ",
						result.score,
						"/100"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: result.feedback
				})]
			}) : null
		]
	});
}
var pyodidePromise = null;
function loadScript(src) {
	return new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${src}"]`)) {
			resolve();
			return;
		}
		const s = document.createElement("script");
		s.src = src;
		s.async = true;
		s.onload = () => resolve();
		s.onerror = () => reject(/* @__PURE__ */ new Error("Falha ao carregar o motor Python"));
		document.head.appendChild(s);
	});
}
async function getPyodide() {
	if (!pyodidePromise) pyodidePromise = (async () => {
		const url = "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/";
		await loadScript(`${url}pyodide.js`);
		if (!window.loadPyodide) throw new Error("Pyodide indisponível");
		return window.loadPyodide({ indexURL: url });
	})();
	return pyodidePromise;
}
async function runPython(code) {
	const py = await getPyodide();
	let out = "";
	py.setStdout({ batched: (s) => {
		out += s;
	} });
	py.setStderr({ batched: (s) => {
		out += s;
	} });
	try {
		await py.runPythonAsync(code);
		return {
			ok: true,
			output: out.trim() || "(sem saída)"
		};
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		return {
			ok: false,
			output: `${out}\n${msg}`.trim()
		};
	}
}
function PythonLab({ exercise, onComplete }) {
	const [code, setCode] = (0, import_react.useState)(exercise.starter);
	const [output, setOutput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [passed, setPassed] = (0, import_react.useState)(false);
	async function run(withTests) {
		setBusy(true);
		setOutput(withTests ? "Carregando Python no navegador…" : "Executando…");
		const res = await runPython(withTests ? `${code}\n\n${exercise.tests}` : code);
		setBusy(false);
		setOutput(res.output);
		if (withTests && res.ok && res.output.includes("ok")) {
			setPassed(true);
			onComplete();
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: exercise.intro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: code,
				onChange: (e) => setCode(e.target.value),
				spellCheck: false,
				rows: 14,
				className: "w-full resize-y rounded-[var(--radius-md)] border border-border bg-raised px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-fg outline-none focus:ring-2 focus:ring-ring"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void run(true),
						children: busy ? "Rodando…" : "Rodar testes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						disabled: busy,
						onClick: () => void run(false),
						children: "Executar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						type: "button",
						onClick: () => setCode(exercise.solution),
						children: "Ver solução"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "min-h-16 overflow-x-auto rounded-[var(--radius-md)] border border-border bg-bg p-3 font-mono text-xs text-muted",
				children: output || "A saída aparece aqui. O motor Python roda no seu navegador."
			}),
			passed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ok",
				children: "Testes ok. Aula pode ser marcada como concluída."
			}) : null
		]
	});
}
function QuizPanel({ questions, onComplete }) {
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const score = (0, import_react.useMemo)(() => {
		return questions.filter((q) => answers[q.id] === q.answer).length;
	}, [answers, questions]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [questions.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
					className: "text-sm font-medium text-fg",
					children: [
						i + 1,
						". ",
						q.prompt
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: q.options.map((opt, idx) => {
						const selected = answers[q.id] === idx;
						const correct = submitted && idx === q.answer;
						const wrong = submitted && selected && idx !== q.answer;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: cn("flex min-h-11 cursor-pointer items-start gap-3 rounded-[var(--radius-sm)] border px-3 py-2.5 text-sm", selected && !submitted && "border-accent bg-raised", correct && "border-ok bg-raised", wrong && "border-danger", !selected && !correct && "border-border hover:bg-raised"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								className: "mt-1",
								name: q.id,
								disabled: submitted,
								checked: selected,
								onChange: () => setAnswers((a) => ({
									...a,
									[q.id]: idx
								}))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt })]
						}, opt);
					})
				}),
				submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: q.explain
				}) : null
			]
		}, q.id)), !submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			disabled: Object.keys(answers).length < questions.length,
			onClick: () => {
				setSubmitted(true);
				onComplete(score, questions.length);
			},
			children: "Conferir"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-fg",
			children: [
				score,
				" de ",
				questions.length,
				" corretas."
			]
		})]
	});
}
function ReflectLab({ prompt, minChars, onComplete }) {
	const [text, setText] = (0, import_react.useState)("");
	const ready = text.trim().length >= minChars;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg",
				children: prompt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: text,
				onChange: (e) => setText(e.target.value),
				rows: 8,
				className: "w-full resize-y rounded-[var(--radius-md)] border border-border bg-raised px-3 py-2.5 text-sm text-fg outline-none focus:ring-2 focus:ring-ring"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs tabular-nums text-subtle",
					children: [
						text.trim().length,
						"/",
						minChars
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !ready,
					onClick: () => onComplete(text.trim()),
					children: "Registrar reflexão"
				})]
			})
		]
	});
}
function TutorSpeech({ lines }) {
	const [i, setI] = (0, import_react.useState)(0);
	const [shown, setShown] = (0, import_react.useState)("");
	const [mood, setMood] = (0, import_react.useState)("talk");
	(0, import_react.useEffect)(() => {
		const full = lines[i] ?? "";
		setShown("");
		setMood("talk");
		let n = 0;
		const id = window.setInterval(() => {
			n += 1;
			setShown(full.slice(0, n));
			if (n >= full.length) {
				window.clearInterval(id);
				setMood("idle");
			}
		}, 16);
		return () => window.clearInterval(id);
	}, [i, lines]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorIris, {
			mood,
			size: 88
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-subtle",
					children: "Íris"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 min-h-16 text-[15px] leading-relaxed text-fg",
					children: [shown, mood === "talk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-0.5 inline-block h-4 w-px bg-accent align-middle" }) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-9 rounded-[var(--radius-sm)] px-3 text-xs text-muted hover:text-fg",
						disabled: i === 0,
						onClick: () => setI((x) => Math.max(0, x - 1)),
						children: "Anterior"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-9 rounded-[var(--radius-sm)] px-3 text-xs text-muted hover:text-fg",
						disabled: i >= lines.length - 1,
						onClick: () => setI((x) => Math.min(lines.length - 1, x + 1)),
						children: "Continuar"
					})]
				})
			]
		})]
	});
}
function LessonPage() {
	const { lessonId } = Route.useParams();
	const lesson = lessonById(lessonId);
	if (!lesson) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg px-4 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-fg",
			children: "Aula não encontrada."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-4 inline-block text-sm text-accent",
			children: "Voltar"
		})]
	});
	const current = lesson;
	const mark = useProgress((s) => s.mark);
	const progress = useProgress((s) => s.byLesson[current.id]);
	const track = TRACKS.find((t) => t.id === current.track);
	const next = nextLesson(current.id);
	const prev = prevLesson(current.id);
	const ctx = current.sections.map((s) => {
		if (s.type === "text") return s.body;
		if (s.type === "callout") return s.body;
		return "";
	}).filter(Boolean).join("\n").slice(0, 800);
	function complete() {
		mark(current.id, { completed: true });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg pb-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-4 py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs uppercase tracking-wide text-subtle",
						children: [
							track?.label,
							" · aula ",
							current.order
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-3xl sm:text-4xl",
						children: current.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: current.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorSpeech, { lines: current.tutor })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonBody, { sections: current.sections })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10 rounded-[var(--radius-lg)] border border-border bg-surface p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-medium",
							children: "Prática"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [
								current.exercise.kind === "quiz" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizPanel, {
									questions: current.exercise.questions,
									onComplete: (score, total) => {
										mark(current.id, {
											quizScore: score,
											quizTotal: total,
											completed: true
										});
									}
								}) : null,
								current.exercise.kind === "prompt" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromptLab, {
									exercise: current.exercise.exercise,
									onComplete: (score) => mark(current.id, {
										promptScore: score,
										completed: true
									})
								}) : null,
								current.exercise.kind === "python" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PythonLab, {
									exercise: current.exercise.exercise,
									onComplete: () => mark(current.id, {
										pythonOk: true,
										completed: true
									})
								}) : null,
								current.exercise.kind === "reflect" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReflectLab, {
									prompt: current.exercise.prompt,
									minChars: current.exercise.minChars,
									onComplete: (text) => mark(current.id, {
										reflection: text,
										completed: true
									})
								}) : null
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "mt-8 flex flex-wrap items-center justify-between gap-3",
						children: [prev ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/aula/$lessonId",
								params: { lessonId: prev.id },
								children: "Aula anterior"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [!progress?.completed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: complete,
								children: "Marcar como lida"
							}) : null, next ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/aula/$lessonId",
									params: { lessonId: next.id },
									children: "Próxima aula"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									children: "Voltar ao mapa"
								})
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IrisChat, {
				lessonTitle: current.title,
				context: ctx
			})
		]
	});
}
//#endregion
export { LessonPage as component };
