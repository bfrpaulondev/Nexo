import type { Lesson } from "./types";

export const LESSONS_EXPERT: Lesson[] = [
  {
    id: "evals",
    track: "expert",
    order: 16,
    title: "Avaliação sistemática",
    minutes: 12,
    summary: "Rubricas, golden sets, juízes LLM e o que não medir.",
    tutor: [
      "Expert não ‘acha que o prompt melhorou’. Expert mede.",
      "Monte um conjunto dourado pequeno e cruel — os casos que quebram o sistema.",
    ],
    sections: [
      {
        type: "steps",
        title: "Kit mínimo de eval",
        items: [
          "Golden set: 30–100 casos com saída esperada ou rubrica.",
          "Métricas objetivas: parse ok, campos presentes, citação válida.",
          "Juiz LLM: só para tom e cobertura, com rubrica fechada.",
          "Regressão: todo prompt novo corre o set.",
        ],
      },
      {
        type: "code",
        title: "Score simples",
        lang: "python",
        code: `def score(pred, gold):
    return {
        "parse": pred is not None,
        "exact": pred == gold,
        "keys": set(pred) == set(gold) if pred and gold else False,
    }`,
      },
      {
        type: "callout",
        tone: "warn",
        body: "Não use o mesmo modelo como único juiz do próprio output em produção crítica. Calibre o juiz com um humano em 20 casos.",
      },
    ],
    exercise: {
      kind: "python",
      exercise: {
        intro: "Implemente f1_keys(pred, gold) — F1 entre conjuntos de chaves de dois dicts. Se pred for None, devolva 0.0.",
        starter: `def f1_keys(pred, gold: dict) -> float:
    # TODO
    pass
`,
        tests: `
assert abs(f1_keys({"a":1,"b":2}, {"a":1,"c":3}) - 0.5) < 1e-9
assert f1_keys(None, {"a":1}) == 0.0
assert f1_keys({"a":1}, {"a":1}) == 1.0
print("ok")
`,
        solution: `def f1_keys(pred, gold: dict) -> float:
    if not pred:
        return 0.0
    p, g = set(pred), set(gold)
    if not p and not g:
        return 1.0
    inter = len(p & g)
    prec = inter / len(p) if p else 0.0
    rec = inter / len(g) if g else 0.0
    if prec + rec == 0:
        return 0.0
    return 2 * prec * rec / (prec + rec)
`,
      },
    },
  },
  {
    id: "custo",
    track: "expert",
    order: 17,
    title: "Custo, latência e guardrails",
    minutes: 11,
    summary: "Orçamento real, cache, modelos baratos no roteador, constituição.",
    tutor: [
      "Produção é a arte de recusar trabalho caro.",
      "Roteie o fácil para um modelo pequeno. Cacheie. Corte o loop. Aí sim, o modelo grande.",
    ],
    sections: [
      {
        type: "steps",
        title: "Alavancas",
        items: [
          "Cache de prompts idênticos e de recuperações.",
          "Classificador barato antes do agente caro.",
          "Max tokens baixo em ferramentas e alto só na redação final.",
          "Guardrail: lista de recusa, PII, e schema na porta de saída.",
        ],
      },
      {
        type: "callout",
        tone: "key",
        body: "Constituição: 8–15 regras negativas (‘nunca invente jurisprudência’). Coloque-as no system e num revisor final.",
      },
    ],
    exercise: {
      kind: "quiz",
      questions: [
        {
          id: "q1",
          prompt: "Qual o primeiro corte de custo em um agente ReAct?",
          options: [
            "Pedir ao modelo para ‘ser breve’",
            "Teto de passos + ferramentas mínimas + cache",
            "Remover o system prompt",
            "Aumentar k do RAG para 50",
          ],
          answer: 1,
          explain: "Passos e ferramentas são multiplicadores. ‘Seja breve’ quase não muda o loop.",
        },
        {
          id: "q2",
          prompt: "Onde o guardrail de saída deve viver?",
          options: [
            "Só na temperatura",
            "No código, depois da geração, além do prompt",
            "No CSS",
            "No nome do agente",
          ],
          answer: 1,
          explain: "Prompt é persuasão. Código é garantia.",
        },
      ],
    },
  },
  {
    id: "producao",
    track: "expert",
    order: 18,
    title: "Arquitetura de produção",
    minutes: 12,
    summary: "Observabilidade, filas, idempotência e o que frameworks não resolvem.",
    tutor: [
      "O diagrama de produção: gateway → roteador → (RAG | agente) → validador → auditoria.",
      "Cada seta tem timeout, cada ação de ferramenta é idempotente se puder.",
    ],
    sections: [
      {
        type: "text",
        title: "O que logar",
        body: "Prompt versionado, modelo, tokens, ferramentas chamadas, latência por passo, parse ok/fail, e um id de correlação. Sem isso, você não faz eval em produção.",
      },
      {
        type: "steps",
        title: "Checklist de expert",
        items: [
          "Versionar prompts como código.",
          "Feature-flag de modelo.",
          "Dead-letter para loops que estouram orçamento.",
          "Reprodução: gravar seed, tools, e input.",
        ],
      },
    ],
    exercise: {
      kind: "reflect",
      prompt:
        "Desenhe em texto o caminho de um ticket de suporte desde a chegada até a resposta, nomeando 5 componentes e um risco de cada um.",
      minChars: 220,
    },
  },
  {
    id: "capstone",
    track: "expert",
    order: 19,
    title: "Capstone: desenhe o sistema",
    minutes: 16,
    summary: "Você une tudo: prompt, RAG, agente, eval e orçamento.",
    tutor: [
      "Última aula. Sem receita única. Quero o seu desenho.",
      "Se o sistema que você descrever tiver contrato, teto e eval, você saiu do nível de ‘usuário de chat’.",
    ],
    sections: [
      {
        type: "text",
        title: "O problema",
        body: "Uma empresa quer um agente que responde dúvidas internas (política de férias, reembolso, acesso a sistemas) com documentos oficiais, escala para humano quando a política for ambígua, e nunca inventa um direito.",
      },
      {
        type: "steps",
        title: "O que o entregável precisa ter",
        items: [
          "Grafo (quem chama quem).",
          "Ferramentas e schemas.",
          "Política de recusa.",
          "Golden set: 5 casos (incluindo um ambíguo e um fora de escopo).",
          "Orçamento de passos.",
        ],
      },
    ],
    exercise: {
      kind: "prompt",
      exercise: {
        task: "Escreva o documento de desenho em um único prompt-especificação: grafo, ferramentas, recusa, 5 casos de teste, orçamento. Trate como se fosse o system + runbook do produto.",
        rubric: [
          "Há um grafo ou pipeline nomeado",
          "Há pelo menos duas ferramentas",
          "Há regra de recusa / NÃO_SEI / humano",
          "Há casos de teste",
          "Há orçamento (passos ou tokens)",
        ],
        sample: `Sistema: roteador → RAG políticas → agente ReAct (buscar_doc, abrir_ticket) → validador.
Recusa: se trecho não cobrir, ESCALAR_HUMANO.
Testes: férias 30 dias; reembolso dia 12; acesso VPN; pergunta de fofoca; PDF contraditório.
Orçamento: 6 passos, k=6, modelo pequeno no roteador.`,
        hiddenSpec: "Arquitetura de agente interno de RH/políticas com RAG, recusa, ferramentas e eval.",
      },
    },
  },
];
