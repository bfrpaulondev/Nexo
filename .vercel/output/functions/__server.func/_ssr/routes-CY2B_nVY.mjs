import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as TRACKS, c as completedCount, d as lessonsInTrack, i as LESSONS, m as useProgress, o as TutorIris, r as IrisChat, t as AppHeader } from "./iris-chat-IQL-qC7C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CY2B_nVY.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const byLesson = useProgress((s) => s.byLesson);
	const done = completedCount(byLesson);
	const next = LESSONS.find((l) => !byLesson[l.id]?.completed) ?? LESSONS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-4 py-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex flex-col items-start gap-6 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorIris, {
						mood: "idle",
						size: 132
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.18em] text-subtle",
								children: "Academia"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 text-4xl text-fg sm:text-5xl",
								children: "NEXO"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-[16px] leading-relaxed text-muted",
								children: "Curso interativo do básico ao expert: prompts, RAG, function calling, orquestração e agentes em Python — com a tutora Íris ao lado."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/aula/$lessonId",
								params: { lessonId: next.id },
								className: "mt-5 inline-flex h-12 items-center rounded-[var(--radius-sm)] bg-accent px-5 text-sm font-medium text-accent-fg",
								children: done === 0 ? "Começar pela fundação" : `Continuar: ${next.title}`
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-12 grid gap-4 sm:grid-cols-2",
					children: TRACKS.map((t) => {
						const list = lessonsInTrack(t.id);
						const c = list.filter((l) => byLesson[l.id]?.completed).length;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-[var(--radius-lg)] border border-border bg-surface p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-wide text-subtle",
									children: t.level
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 text-2xl font-medium",
									children: t.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: t.blurb
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-4 text-xs tabular-nums text-subtle",
									children: [
										c,
										"/",
										list.length,
										" concluídas"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-1.5",
									children: list.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/aula/$lessonId",
										params: { lessonId: l.id },
										className: "flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-sm)] px-2 text-sm hover:bg-raised",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-fg",
											children: l.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 text-xs tabular-nums text-subtle",
											children: byLesson[l.id]?.completed ? "feita" : `${l.minutes} min`
										})]
									}) }, l.id))
								})
							]
						}, t.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IrisChat, {})
		]
	});
}
//#endregion
export { Home as component };
