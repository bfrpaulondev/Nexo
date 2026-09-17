import type { Track } from "./types";

export const TRACKS: Track[] = [
  {
    id: "fundacao",
    label: "Fundação",
    level: "Base",
    blurb: "Como o modelo lê, gera e erra — o chão de tudo.",
  },
  {
    id: "prompt",
    label: "Prompt avançado",
    level: "Técnica",
    blurb: "CoT, ToT, ReAct, meta-prompt e encadeamento.",
  },
  {
    id: "rag",
    label: "RAG e ferramentas",
    level: "Sistema",
    blurb: "Busca, memória, function calling e contexto vivo.",
  },
  {
    id: "agentes",
    label: "Agentes",
    level: "Orquestração",
    blurb: "Loops, multi-agentes e Python de verdade.",
  },
  {
    id: "expert",
    label: "Expert",
    level: "Produção",
    blurb: "Evals, custo, guardrails e arquitetura.",
  },
];
