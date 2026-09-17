import type { Lesson } from "./types";

export const LESSONS_PROMPT: Lesson[] = [
  {
    id: "cot",
    track: "prompt",
    order: 5,
    title: "Chain of Thought",
    minutes: 10,
    summary: "Forçar o raciocínio visível antes da resposta — e quando não fazer isso.",
    tutor: [
      "Chain of Thought é simples: o modelo pensa em voz alta antes de concluir.",
      "Isso ajuda em matemática, diagnóstico e políticas. Atrasa e vaza raciocínio em tarefas de formato curto.",
    ],
    sections: [
      {
        type: "text",
        title: "A receita",
        body: "Peça passos numerados, depois a resposta final num campo isolado. ‘Pense passo a passo’ funciona, mas é vago. Melhor: ‘liste premissas, teste cada uma, só então conclua’.",
      },
      {
        type: "code",
        title: "CoT estruturado",
        lang: "text",
        code: `Raciocine em:
1. dados que você tem
2. dados que faltam
3. hipóteses
4. teste de cada hipótese
Resposta final em <answer> com uma linha.`,
      },
      {
        type: "callout",
        tone: "key",
        body: "Separe raciocínio e resposta. O raciocínio é para o modelo (e para você depurar). A resposta é para o sistema.",
      },
    ],
    exercise: {
      kind: "prompt",
      exercise: {
        task: "Escreva um prompt CoT para decidir se um reembolso de R$ 180, pedido 12 dias após a compra, deve ser aprovado, dado que a política é 7 dias salvo defeito de fabricação.",
        rubric: [
          "Pede passos de raciocínio",
          "Cita a política como premissa",
          "Separa a decisão final",
          "Prevê o caso de defeito vs. atraso simples",
        ],
        sample: `Use a política: reembolso em 7 dias, exceto defeito.
Passos: (1) prazo (2) motivo (3) exceção (4) decisão.
Resposta final: APROVAR | NEGAR | PEDIR_EVIDENCIA.`,
        hiddenSpec: "Decisão de reembolso com política de 7 dias e exceção de defeito, usando raciocínio explícito e decisão final isolada.",
      },
    },
  },
  {
    id: "tot",
    track: "prompt",
    order: 6,
    title: "Self-consistency e Tree of Thoughts",
    minutes: 11,
    summary: "Vários caminhos, voto e busca em árvore — o custo de acertar mais.",
    tutor: [
      "Self-consistency: gere N raciocínios independentes e vote na resposta.",
      "Tree of Thoughts: explore ramos, avalie, poda os fracos. É orquestração, não um único prompt milagroso.",
    ],
    sections: [
      {
        type: "text",
        title: "Quando pagar o custo",
        body: "Essas técnicas multiplicam tokens. Use em decisões irreversíveis (jurídico, arquitetura, diagnóstico). Não use em classificação barata.",
      },
      {
        type: "steps",
        title: "Self-consistency em 4 passos",
        items: [
          "Fixe temperatura média (0.5–0.8) para diversificar caminhos.",
          "Gere 3–7 CoTs independentes.",
          "Extraia só a resposta final de cada um.",
          "Vote. Em empate, peça um juiz com os candidatos.",
        ],
      },
      {
        type: "code",
        title: "Esqueleto Python",
        lang: "python",
        code: `def majority(answers: list[str]) -> str:
    from collections import Counter
    return Counter(answers).most_common(1)[0][0]`,
      },
    ],
    exercise: {
      kind: "python",
      exercise: {
        intro: "Implemente majority(answers) que devolve a string mais frequente. Empate: a primeira que alcançou a maior contagem (ordem estável).",
        starter: `from collections import Counter

def majority(answers: list[str]) -> str:
    # TODO
    pass
`,
        tests: `
assert majority(["a","b","a"]) == "a"
assert majority(["x","y","y","x"]) == "x"
assert majority(["unico"]) == "unico"
print("ok")
`,
        solution: `from collections import Counter

def majority(answers: list[str]) -> str:
    counts = Counter(answers)
    best = max(counts.values())
    for a in answers:
        if counts[a] == best:
            return a
    raise ValueError("empty")
`,
      },
    },
  },
  {
    id: "react",
    track: "prompt",
    order: 7,
    title: "ReAct: raciocinar e agir",
    minutes: 12,
    summary: "O loop Thought → Action → Observation que sustenta agentes.",
    tutor: [
      "ReAct é o coração dos agentes. O modelo não precisa saber o mundo: ele age, observa, e continua.",
      "Seu trabalho de expert é limitar as ações, parsear a ação, e cortar o loop.",
    ],
    sections: [
      {
        type: "text",
        title: "O loop",
        body: "Thought: o que falta. Action: nome da ferramenta + argumentos. Observation: o que o mundo devolveu. Repita até Action = finish. Sem parser rígido, o loop vira prosa.",
      },
      {
        type: "code",
        title: "Formato de ação",
        lang: "text",
        code: `Thought: preciso do preço do SKU 44
Action: lookup_price
ActionInput: {"sku": "44"}
Observation: 19.90
Thought: já posso responder
Action: finish
ActionInput: {"preco": 19.90}`,
      },
      {
        type: "callout",
        tone: "warn",
        body: "Nunca deixe o modelo inventar o nome da ferramenta. Liste o catálogo. Se a ação for desconhecida, devolva erro como observation — não como crash.",
      },
    ],
    exercise: {
      kind: "quiz",
      questions: [
        {
          id: "q1",
          prompt: "O que deve acontecer se o modelo pedir uma ferramenta que não existe?",
          options: [
            "Executar a mais parecida em silêncio",
            "Devolver observation de erro e deixar o loop continuar",
            "Encerrar o processo do servidor",
            "Aumentar a temperatura",
          ],
          answer: 1,
          explain: "Erro observável é informação. O agente pode corrigir o nome ou desistir com finish.",
        },
        {
          id: "q2",
          prompt: "Qual é o critério típico de parada?",
          options: [
            "Sempre 20 passos",
            "Action finish, ou teto de passos, ou ferramenta de parada",
            "Quando o thought fica longo",
            "Quando o usuário fecha a aba",
          ],
          answer: 1,
          explain: "Sem teto, o agente gira para sempre. Sem finish, você não tem contrato de saída.",
        },
      ],
    },
  },
  {
    id: "meta",
    track: "prompt",
    order: 8,
    title: "Meta-prompting e encadeamento",
    minutes: 10,
    summary: "Um prompt que escreve outro, e pipelines de etapas com estado.",
    tutor: [
      "Meta-prompting: você pede ao modelo para criticar e reescrever o prompt.",
      "Encadeamento: cada etapa tem um contrato. O expert desenha o grafo, não um prompt único de 4 mil palavras.",
    ],
    sections: [
      {
        type: "steps",
        title: "Pipeline clássico",
        items: [
          "Extrair (JSON cru).",
          "Validar (schema).",
          "Raciocinar (CoT + decisão).",
          "Redigir (tom humano, sem números inventados).",
          "Revisar (constituição: o que nunca pode sair).",
        ],
      },
      {
        type: "code",
        title: "Estado entre etapas",
        lang: "python",
        code: `state = {"input": raw, "facts": None, "decision": None, "draft": None}

def extract(state): ...
def decide(state): ...
def draft(state): ...

for step in (extract, decide, draft):
    state = step(state)`,
      },
      {
        type: "callout",
        tone: "tip",
        body: "Não peça ao mesmo prompt para ser extrator e poeta. Especialização vence.",
      },
    ],
    exercise: {
      kind: "reflect",
      prompt:
        "Descreva um pipeline de 3 etapas para um assistente que responde perguntas sobre um PDF interno. Nomeie o contrato de entrada e saída de cada etapa.",
      minChars: 180,
    },
  },
];
