import type { Lesson } from "./types";

export const LESSONS_FUNDACAO: Lesson[] = [
  {
    id: "tokens",
    track: "fundacao",
    order: 1,
    title: "Como um LLM realmente pensa",
    minutes: 8,
    summary: "Tokens, contexto, temperatura e por que o modelo não ‘sabe’ — ele prevê.",
    tutor: [
      "Olá. Eu sou a Íris. Vou te levar do básico ao expert em prompt, agentes e orquestração.",
      "Primeiro: um modelo de linguagem não consulta um banco de verdades. Ele prevê o próximo token.",
      "Se você entender isso, seus prompts deixam de ser pedidos mágicos e viram contratos.",
    ],
    sections: [
      {
        type: "text",
        title: "O contrato mental",
        body: "Um LLM recebe uma sequência de tokens e estima a probabilidade do próximo. Tudo — raciocínio, código, mentira convincente — nasce dessa previsão. O prompt é o contexto que enviesa essa distribuição. Sem contexto claro, o modelo completa o que for mais comum no treino, não o que você queria.",
      },
      {
        type: "steps",
        title: "Peças que você precisa nomear",
        items: [
          "Token: fatia de texto (não exatamente uma palavra).",
          "Janela de contexto: memória de curto prazo da conversa + system + ferramentas.",
          "Temperatura: 0 é quase determinístico; alto é exploratório.",
          "System prompt: regras estáveis. User: a tarefa. Assistant: a resposta.",
        ],
      },
      {
        type: "callout",
        tone: "key",
        body: "Trate o modelo como um estagiário brilhante e amnésico. Tudo que ele precisa para acertar tem que estar no contexto desta chamada.",
      },
      {
        type: "code",
        title: "Uma chamada é só isto",
        lang: "python",
        code: `messages = [
    {"role": "system", "content": "Você extrai JSON. Sem prosa."},
    {"role": "user", "content": "Pedido: 2 cafés, mesa 4"},
]
# O modelo completa assistant.content — nada mais.`,
      },
    ],
    exercise: {
      kind: "quiz",
      questions: [
        {
          id: "q1",
          prompt: "O que um LLM faz, no fundo, a cada passo?",
          options: [
            "Consulta um índice de fatos e devolve a fonte",
            "Prevê o próximo token condicionado ao contexto",
            "Executa Python internamente para raciocinar",
            "Lê a internet em tempo real",
          ],
          answer: 1,
          explain: "Tudo é previsão de próximo token. Ferramentas e busca só entram se você as ligar no sistema.",
        },
        {
          id: "q2",
          prompt: "Por que temperatura baixa ajuda em extração JSON?",
          options: [
            "Aumenta criatividade do formato",
            "Reduz variação e favorece o caminho mais provável",
            "Aumenta a janela de contexto",
            "Desliga o system prompt",
          ],
          answer: 1,
          explain: "Tarefas de formato rígido pedem baixa aleatoriedade.",
        },
        {
          id: "q3",
          prompt: "Onde devem viver regras estáveis do produto?",
          options: [
            "Só no user, a cada mensagem",
            "No system (ou no developer) e reafirmadas quando críticas",
            "Na temperatura",
            "No nome do modelo",
          ],
          answer: 1,
          explain: "System é o lugar das invariantes. User carrega a instância da tarefa.",
        },
      ],
    },
  },
  {
    id: "anatomia",
    track: "fundacao",
    order: 2,
    title: "Anatomia de um prompt que funciona",
    minutes: 10,
    summary: "Papel, objetivo, contexto, restrições, formato e exemplos — nesta ordem.",
    tutor: [
      "Prompt não é um parágrafo bonito. É uma especificação.",
      "A ordem que eu uso: papel, objetivo, contexto, restrições, formato, exemplos, e o input.",
    ],
    sections: [
      {
        type: "text",
        title: "Seis blocos",
        body: "A maior falha de quem começa é misturar tudo. Separe blocos. O modelo lê da esquerda para a direita e dá peso ao que está recente — mas estrutura clara vence truques de posição na maior parte das tarefas.",
      },
      {
        type: "code",
        title: "Esqueleto",
        lang: "text",
        code: `PAPEL: analista de suporte sênior
OBJETIVO: classificar o ticket e propor a próxima ação
CONTEXTO: {politica} {historico}
RESTRIÇÕES: não invente SLA; se faltar dado, diga o que falta
FORMATO: JSON {categoria, urgencia, acao, lacunas[]}
EXEMPLOS: ...
INPUT: {ticket}`,
      },
      {
        type: "callout",
        tone: "tip",
        body: "Peça o formato duas vezes: na restrição (‘só JSON’) e num schema. Modelos obedecem melhor a schema + exemplo do que a um adjetivo (‘seja conciso’).",
      },
    ],
    exercise: {
      kind: "prompt",
      exercise: {
        task: "Escreva um prompt completo para extrair de um e-mail: nome do cliente, valor, prazo e se há reclamação. Saída em JSON.",
        rubric: [
          "Define um papel",
          "Define o objetivo em uma frase",
          "Lista campos de saída",
          "Diz o que fazer se um campo não existir",
          "Pede JSON (e só JSON, ou JSON em fence)",
        ],
        sample: `PAPEL: extrator de dados de e-mail comercial
OBJETIVO: extrair nome, valor, prazo e reclamacao_bool
RESTRIÇÕES: nunca invente números; use null se ausente
FORMATO: {"nome": string|null, "valor": number|null, "prazo": string|null, "reclamacao": boolean}
INPUT: {{email}}`,
        hiddenSpec: "O prompt deve especificar extração estruturada de e-mail com campos nome, valor, prazo e reclamação, incluindo tratamento de ausência.",
      },
    },
  },
  {
    id: "fewshot",
    track: "fundacao",
    order: 3,
    title: "Zero-shot, few-shot e papéis",
    minutes: 9,
    summary: "Quando um exemplo vale mais que um parágrafo de instrução.",
    tutor: [
      "Zero-shot basta quando a tarefa é comum. Few-shot entra quando o estilo, o limite ou o caso extremo importam.",
      "Exemplos ruins ensinam o erro. Escolha casos que cubram o bordo, não só o caminho feliz.",
    ],
    sections: [
      {
        type: "text",
        title: "Três modos",
        body: "Zero-shot: só a instrução. Few-shot: 1–5 pares input→output. Role prompting: um papel que ativa um estilo e um conjunto de heurísticas (‘você é revisor de contratos’). Papel sozinho não substitui restrições.",
      },
      {
        type: "steps",
        title: "Few-shot que não quebra",
        items: [
          "Mostre o formato exato da saída nos exemplos.",
          "Inclua um caso negativo (recusar, pedir dado, devolver null).",
          "Mantenha o mesmo schema em todos os exemplos.",
          "Não coloque a resposta no user se o padrão da API espera assistant.",
        ],
      },
      {
        type: "code",
        title: "Exemplo de bordo",
        lang: "text",
        code: `IN: "oi"
OUT: {"intencao": "smalltalk", "acao": "cumprimentar"}

IN: "cancela pedido 882, cliente irritado"
OUT: {"intencao": "cancelar", "acao": "confirmar_id_e_politica"}`,
      },
    ],
    exercise: {
      kind: "quiz",
      questions: [
        {
          id: "q1",
          prompt: "Quando few-shot é mais útil?",
          options: [
            "Sempre, quanto mais exemplos melhor",
            "Quando o formato ou os casos de bordo não são óbvios",
            "Só em modelos pequenos",
            "Nunca, o system prompt basta",
          ],
          answer: 1,
          explain: "Few-shot é caro em tokens. Use para formato e bordos, não para encher contexto.",
        },
        {
          id: "q2",
          prompt: "Qual exemplo falta com mais frequência?",
          options: [
            "O caso feliz perfeito",
            "O caso em que o modelo deve recusar ou devolver null",
            "Um poema",
            "A biografia do usuário",
          ],
          answer: 1,
          explain: "Sem o negativo, o modelo preenche lacunas com invenção.",
        },
      ],
    },
  },
  {
    id: "formato",
    track: "fundacao",
    order: 4,
    title: "Controlar o formato",
    minutes: 8,
    summary: "JSON, XML, markdown — e o que fazer quando o modelo foge do schema.",
    tutor: [
      "Formato é a primeira alavanca de confiabilidade. Sem ele, você não consegue avaliar nem encadear.",
      "No Python, você vai validar com um schema. No prompt, você antecipa essa validação.",
    ],
    sections: [
      {
        type: "text",
        title: "Contrato de saída",
        body: "Defina schema, tipos, enums e o comportamento de campo ausente. Depois, no código, parseie e rejeite. Se falhar, peça reparo com o erro do parser — não recomece do zero.",
      },
      {
        type: "code",
        title: "Reparar em vez de rezar",
        lang: "python",
        code: `def complete_json(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        return repair(text, error=str(e))  # nova chamada só com o erro`,
      },
      {
        type: "callout",
        tone: "warn",
        body: "Não peça ‘JSON ou uma explicação’. Isso destrói o parser. Explique dentro de um campo, nunca fora do objeto.",
      },
    ],
    exercise: {
      kind: "python",
      exercise: {
        intro: "Implemente parse_or_none: se o texto for JSON objeto, devolva o dict; senão None. Sem lançar exceção.",
        starter: `import json

def parse_or_none(text: str):
    # TODO
    pass
`,
        tests: `
assert parse_or_none('{"a": 1}') == {"a": 1}
assert parse_or_none("nao e json") is None
assert parse_or_none("[1,2]") is None
print("ok")
`,
        solution: `import json

def parse_or_none(text: str):
    try:
        data = json.loads(text)
    except Exception:
        return None
    return data if isinstance(data, dict) else None
`,
      },
    },
  },
];
