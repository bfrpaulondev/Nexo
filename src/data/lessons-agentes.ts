import type { Lesson } from "./types";

export const LESSONS_AGENTES: Lesson[] = [
  {
    id: "anatomia-agente",
    track: "agentes",
    order: 12,
    title: "Anatomia de um agente",
    minutes: 12,
    summary: "Objetivo, política, ferramentas, memória, teto e critério de sucesso.",
    tutor: [
      "Um agente é um loop com orçamento. Sem teto, sem critério, sem catálogo — não é agente, é um chat com pretensão.",
      "Desenhe essas seis peças no papel antes de abrir um framework.",
    ],
    sections: [
      {
        type: "steps",
        title: "As seis peças",
        items: [
          "Objetivo: o que conta como feito.",
          "Política: o que é proibido (constituição).",
          "Ferramentas: catálogo mínimo.",
          "Memória: o que atravessa passos.",
          "Orçamento: max passos, max tokens, max tempo.",
          "Observabilidade: trace de thought/action/observation.",
        ],
      },
      {
        type: "code",
        title: "Loop mínimo",
        lang: "python",
        code: `def run(goal, tools, budget=8):
    obs = None
    for i in range(budget):
        thought, action, args = plan(goal, obs, tools)
        if action == "finish":
            return args
        obs = act(action, args, tools)
    return {"erro": "orcamento"}`,
      },
      {
        type: "callout",
        tone: "tip",
        body: "Frameworks (LangChain, CrewAI, AutoGen, LangGraph) implementam isso. Se você não souber o loop, o framework só esconde o bug.",
      },
    ],
    exercise: {
      kind: "quiz",
      questions: [
        {
          id: "q1",
          prompt: "Qual peça evita um agente que gira para sempre?",
          options: [
            "Um system prompt poético",
            "Orçamento (passos/tokens/tempo) + finish",
            "Mais ferramentas",
            "Temperatura 1.5",
          ],
          answer: 1,
          explain: "Sem orçamento, até um finish mal parseado vira loop infinito.",
        },
        {
          id: "q2",
          prompt: "Por que o trace importa?",
          options: [
            "É só estética",
            "Permite eval, debug e auditoria de cada ação",
            "Substitui as ferramentas",
            "Aumenta a janela de contexto automaticamente",
          ],
          answer: 1,
          explain: "Você não otimiza o que não vê. Trace é o log do agente.",
        },
      ],
    },
  },
  {
    id: "orquestracao",
    track: "agentes",
    order: 13,
    title: "Padrões de orquestração",
    minutes: 12,
    summary: "Sequencial, paralelo, roteador, supervisor — escolher o grafo certo.",
    tutor: [
      "Orquestração é desenhar quem fala, quando, e com que estado.",
      "Comece simples: pipeline sequencial. Só adicione um supervisor quando houver especialização real.",
    ],
    sections: [
      {
        type: "text",
        title: "Quatro grafos",
        body: "Sequencial: A → B → C. Paralelo: A e B, depois merge. Roteador: um classificador escolhe um especialista. Supervisor: um agente delega, revisa e decide parar. Hierarquia custa latência e tokens; pague só se a tarefa tiver papéis distintos.",
      },
      {
        type: "code",
        title: "Roteador",
        lang: "python",
        code: `def route(ticket: str) -> str:
    # modelo devolve um enum, não prosa
    return classify(ticket)  # "billing" | "tech" | "legal"

HANDLERS = {"billing": billing_agent, "tech": tech_agent, "legal": legal_agent}`,
      },
      {
        type: "callout",
        tone: "key",
        body: "O contrato entre agentes é JSON, não conversa solta. Conversas soltas não avaliam.",
      },
    ],
    exercise: {
      kind: "prompt",
      exercise: {
        task: "Escreva o system prompt de um supervisor que coordena três trabalhadores: pesquisador, analista e redator. Ele só pode delegar ou finalizar. Saída sempre JSON.",
        rubric: [
          "Lista os três papéis",
          "Restringe ações a delegar ou finalizar",
          "Pede JSON",
          "Define critério de término",
        ],
        sample: `Você é o supervisor. Trabalhadores: pesquisador, analista, redator.
Ações: {"op":"delegate","to":"...","brief":"..."} ou {"op":"finish","deliverable":"..."}
Finalize só quando houver rascunho revisado pelo analista.`,
        hiddenSpec: "Supervisor de três agentes com delegação e finish em JSON.",
      },
    },
  },
  {
    id: "multi",
    track: "agentes",
    order: 14,
    title: "Multi-agentes na prática",
    minutes: 11,
    summary: "Especialistas, handoff, conflitos e o juiz.",
    tutor: [
      "Multi-agente não é várias instâncias do mesmo prompt. É especialização com handoff explícito.",
      "Quando dois especialistas discordam, um juiz com rubrica decide — não um empate poético.",
    ],
    sections: [
      {
        type: "steps",
        title: "Handoff limpo",
        items: [
          "O emissor escreve um brief: objetivo, evidências, o que não fazer.",
          "O receptor não vê o thought interno do emissor, só o brief.",
          "O supervisor guarda o estado canônico.",
        ],
      },
      {
        type: "code",
        title: "Mini Crew em Python",
        lang: "python",
        code: `def crew(query):
    notas = pesquisador(query)
    analise = analista(query, notas)
    texto = redator(query, analise)
    return juiz(texto, rubrica="fatos só das notas")`,
      },
    ],
    exercise: {
      kind: "python",
      exercise: {
        intro: "Implemente handoff(brief, history) que anexa o brief à lista history e devolve a nova lista (sem mutar a original).",
        starter: `def handoff(brief: dict, history: list) -> list:
    # TODO
    pass
`,
        tests: `
h = [{"from": "s"}]
n = handoff({"from": "a", "msg": "x"}, h)
assert n[-1]["msg"] == "x"
assert len(h) == 1
print("ok")
`,
        solution: `def handoff(brief: dict, history: list) -> list:
    return history + [brief]
`,
      },
    },
  },
  {
    id: "loop-python",
    track: "agentes",
    order: 15,
    title: "Lab: loop ReAct em Python",
    minutes: 14,
    summary: "Você escreve o motor. Ferramentas de verdade, teto e finish.",
    tutor: [
      "Agora você constrói o motor. Sem framework. Se isto ficar sólido, LangGraph vira açúcar.",
      "Leia o starter. Complete act e run até os testes passarem.",
    ],
    sections: [
      {
        type: "text",
        title: "O que o motor precisa",
        body: "Um dicionário de ferramentas, um planejador (aqui, determinístico para o exercício), parser de ação, teto, e finish.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "No mundo real o planejador é o LLM. Aqui ele é uma função para você isolar o loop.",
      },
    ],
    exercise: {
      kind: "python",
      exercise: {
        intro: "Complete a classe Agent. act executa a ferramenta ou devolve ERRO. run itera até finish ou teto.",
        starter: `class Agent:
    def __init__(self, tools: dict, budget: int = 4):
        self.tools = tools
        self.budget = budget
        self.trace = []

    def act(self, name, args):
        # TODO: chamar ferramenta ou "ERRO"
        pass

    def run(self, plan_steps: list):
        # plan_steps: lista de (name, args). name "finish" encerra.
        # TODO
        pass
`,
        tests: `
tools = {"inc": lambda x: x + 1, "dbl": lambda x: x * 2}
ag = Agent(tools, budget=5)
assert ag.act("inc", 3) == 4
assert ag.act("nope", 1) == "ERRO"
out = ag.run([("inc", 1), ("dbl", 2), ("finish", {"ok": True})])
assert out == {"ok": True}
ag2 = Agent(tools, budget=2)
assert ag2.run([("inc", 0), ("inc", 0), ("inc", 0)]) == {"erro": "orcamento"}
print("ok")
`,
        solution: `class Agent:
    def __init__(self, tools: dict, budget: int = 4):
        self.tools = tools
        self.budget = budget
        self.trace = []

    def act(self, name, args):
        fn = self.tools.get(name)
        if fn is None:
            return "ERRO"
        return fn(args)

    def run(self, plan_steps: list):
        for i, (name, args) in enumerate(plan_steps):
            if i >= self.budget:
                return {"erro": "orcamento"}
            if name == "finish":
                return args
            obs = self.act(name, args)
            self.trace.append((name, args, obs))
        return {"erro": "orcamento"}
`,
      },
    },
  },
];
