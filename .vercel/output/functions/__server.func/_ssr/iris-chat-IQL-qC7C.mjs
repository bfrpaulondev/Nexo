import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/iris-chat-IQL-qC7C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LESSONS_AGENTES = [
	{
		id: "anatomia-agente",
		track: "agentes",
		order: 12,
		title: "Anatomia de um agente",
		minutes: 12,
		summary: "Objetivo, política, ferramentas, memória, teto e critério de sucesso.",
		tutor: ["Um agente é um loop com orçamento. Sem teto, sem critério, sem catálogo — não é agente, é um chat com pretensão.", "Desenhe essas seis peças no papel antes de abrir um framework."],
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
					"Observabilidade: trace de thought/action/observation."
				]
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
    return {"erro": "orcamento"}`
			},
			{
				type: "callout",
				tone: "tip",
				body: "Frameworks (LangChain, CrewAI, AutoGen, LangGraph) implementam isso. Se você não souber o loop, o framework só esconde o bug."
			}
		],
		exercise: {
			kind: "quiz",
			questions: [{
				id: "q1",
				prompt: "Qual peça evita um agente que gira para sempre?",
				options: [
					"Um system prompt poético",
					"Orçamento (passos/tokens/tempo) + finish",
					"Mais ferramentas",
					"Temperatura 1.5"
				],
				answer: 1,
				explain: "Sem orçamento, até um finish mal parseado vira loop infinito."
			}, {
				id: "q2",
				prompt: "Por que o trace importa?",
				options: [
					"É só estética",
					"Permite eval, debug e auditoria de cada ação",
					"Substitui as ferramentas",
					"Aumenta a janela de contexto automaticamente"
				],
				answer: 1,
				explain: "Você não otimiza o que não vê. Trace é o log do agente."
			}]
		}
	},
	{
		id: "orquestracao",
		track: "agentes",
		order: 13,
		title: "Padrões de orquestração",
		minutes: 12,
		summary: "Sequencial, paralelo, roteador, supervisor — escolher o grafo certo.",
		tutor: ["Orquestração é desenhar quem fala, quando, e com que estado.", "Comece simples: pipeline sequencial. Só adicione um supervisor quando houver especialização real."],
		sections: [
			{
				type: "text",
				title: "Quatro grafos",
				body: "Sequencial: A → B → C. Paralelo: A e B, depois merge. Roteador: um classificador escolhe um especialista. Supervisor: um agente delega, revisa e decide parar. Hierarquia custa latência e tokens; pague só se a tarefa tiver papéis distintos."
			},
			{
				type: "code",
				title: "Roteador",
				lang: "python",
				code: `def route(ticket: str) -> str:
    # modelo devolve um enum, não prosa
    return classify(ticket)  # "billing" | "tech" | "legal"

HANDLERS = {"billing": billing_agent, "tech": tech_agent, "legal": legal_agent}`
			},
			{
				type: "callout",
				tone: "key",
				body: "O contrato entre agentes é JSON, não conversa solta. Conversas soltas não avaliam."
			}
		],
		exercise: {
			kind: "prompt",
			exercise: {
				task: "Escreva o system prompt de um supervisor que coordena três trabalhadores: pesquisador, analista e redator. Ele só pode delegar ou finalizar. Saída sempre JSON.",
				rubric: [
					"Lista os três papéis",
					"Restringe ações a delegar ou finalizar",
					"Pede JSON",
					"Define critério de término"
				],
				sample: `Você é o supervisor. Trabalhadores: pesquisador, analista, redator.
Ações: {"op":"delegate","to":"...","brief":"..."} ou {"op":"finish","deliverable":"..."}
Finalize só quando houver rascunho revisado pelo analista.`,
				hiddenSpec: "Supervisor de três agentes com delegação e finish em JSON."
			}
		}
	},
	{
		id: "multi",
		track: "agentes",
		order: 14,
		title: "Multi-agentes na prática",
		minutes: 11,
		summary: "Especialistas, handoff, conflitos e o juiz.",
		tutor: ["Multi-agente não é várias instâncias do mesmo prompt. É especialização com handoff explícito.", "Quando dois especialistas discordam, um juiz com rubrica decide — não um empate poético."],
		sections: [{
			type: "steps",
			title: "Handoff limpo",
			items: [
				"O emissor escreve um brief: objetivo, evidências, o que não fazer.",
				"O receptor não vê o thought interno do emissor, só o brief.",
				"O supervisor guarda o estado canônico."
			]
		}, {
			type: "code",
			title: "Mini Crew em Python",
			lang: "python",
			code: `def crew(query):
    notas = pesquisador(query)
    analise = analista(query, notas)
    texto = redator(query, analise)
    return juiz(texto, rubrica="fatos só das notas")`
		}],
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
`
			}
		}
	},
	{
		id: "loop-python",
		track: "agentes",
		order: 15,
		title: "Lab: loop ReAct em Python",
		minutes: 14,
		summary: "Você escreve o motor. Ferramentas de verdade, teto e finish.",
		tutor: ["Agora você constrói o motor. Sem framework. Se isto ficar sólido, LangGraph vira açúcar.", "Leia o starter. Complete act e run até os testes passarem."],
		sections: [{
			type: "text",
			title: "O que o motor precisa",
			body: "Um dicionário de ferramentas, um planejador (aqui, determinístico para o exercício), parser de ação, teto, e finish."
		}, {
			type: "callout",
			tone: "tip",
			body: "No mundo real o planejador é o LLM. Aqui ele é uma função para você isolar o loop."
		}],
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
`
			}
		}
	}
];
var LESSONS_EXPERT = [
	{
		id: "evals",
		track: "expert",
		order: 16,
		title: "Avaliação sistemática",
		minutes: 12,
		summary: "Rubricas, golden sets, juízes LLM e o que não medir.",
		tutor: ["Expert não ‘acha que o prompt melhorou’. Expert mede.", "Monte um conjunto dourado pequeno e cruel — os casos que quebram o sistema."],
		sections: [
			{
				type: "steps",
				title: "Kit mínimo de eval",
				items: [
					"Golden set: 30–100 casos com saída esperada ou rubrica.",
					"Métricas objetivas: parse ok, campos presentes, citação válida.",
					"Juiz LLM: só para tom e cobertura, com rubrica fechada.",
					"Regressão: todo prompt novo corre o set."
				]
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
    }`
			},
			{
				type: "callout",
				tone: "warn",
				body: "Não use o mesmo modelo como único juiz do próprio output em produção crítica. Calibre o juiz com um humano em 20 casos."
			}
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
`
			}
		}
	},
	{
		id: "custo",
		track: "expert",
		order: 17,
		title: "Custo, latência e guardrails",
		minutes: 11,
		summary: "Orçamento real, cache, modelos baratos no roteador, constituição.",
		tutor: ["Produção é a arte de recusar trabalho caro.", "Roteie o fácil para um modelo pequeno. Cacheie. Corte o loop. Aí sim, o modelo grande."],
		sections: [{
			type: "steps",
			title: "Alavancas",
			items: [
				"Cache de prompts idênticos e de recuperações.",
				"Classificador barato antes do agente caro.",
				"Max tokens baixo em ferramentas e alto só na redação final.",
				"Guardrail: lista de recusa, PII, e schema na porta de saída."
			]
		}, {
			type: "callout",
			tone: "key",
			body: "Constituição: 8–15 regras negativas (‘nunca invente jurisprudência’). Coloque-as no system e num revisor final."
		}],
		exercise: {
			kind: "quiz",
			questions: [{
				id: "q1",
				prompt: "Qual o primeiro corte de custo em um agente ReAct?",
				options: [
					"Pedir ao modelo para ‘ser breve’",
					"Teto de passos + ferramentas mínimas + cache",
					"Remover o system prompt",
					"Aumentar k do RAG para 50"
				],
				answer: 1,
				explain: "Passos e ferramentas são multiplicadores. ‘Seja breve’ quase não muda o loop."
			}, {
				id: "q2",
				prompt: "Onde o guardrail de saída deve viver?",
				options: [
					"Só na temperatura",
					"No código, depois da geração, além do prompt",
					"No CSS",
					"No nome do agente"
				],
				answer: 1,
				explain: "Prompt é persuasão. Código é garantia."
			}]
		}
	},
	{
		id: "producao",
		track: "expert",
		order: 18,
		title: "Arquitetura de produção",
		minutes: 12,
		summary: "Observabilidade, filas, idempotência e o que frameworks não resolvem.",
		tutor: ["O diagrama de produção: gateway → roteador → (RAG | agente) → validador → auditoria.", "Cada seta tem timeout, cada ação de ferramenta é idempotente se puder."],
		sections: [{
			type: "text",
			title: "O que logar",
			body: "Prompt versionado, modelo, tokens, ferramentas chamadas, latência por passo, parse ok/fail, e um id de correlação. Sem isso, você não faz eval em produção."
		}, {
			type: "steps",
			title: "Checklist de expert",
			items: [
				"Versionar prompts como código.",
				"Feature-flag de modelo.",
				"Dead-letter para loops que estouram orçamento.",
				"Reprodução: gravar seed, tools, e input."
			]
		}],
		exercise: {
			kind: "reflect",
			prompt: "Desenhe em texto o caminho de um ticket de suporte desde a chegada até a resposta, nomeando 5 componentes e um risco de cada um.",
			minChars: 220
		}
	},
	{
		id: "capstone",
		track: "expert",
		order: 19,
		title: "Capstone: desenhe o sistema",
		minutes: 16,
		summary: "Você une tudo: prompt, RAG, agente, eval e orçamento.",
		tutor: ["Última aula. Sem receita única. Quero o seu desenho.", "Se o sistema que você descrever tiver contrato, teto e eval, você saiu do nível de ‘usuário de chat’."],
		sections: [{
			type: "text",
			title: "O problema",
			body: "Uma empresa quer um agente que responde dúvidas internas (política de férias, reembolso, acesso a sistemas) com documentos oficiais, escala para humano quando a política for ambígua, e nunca inventa um direito."
		}, {
			type: "steps",
			title: "O que o entregável precisa ter",
			items: [
				"Grafo (quem chama quem).",
				"Ferramentas e schemas.",
				"Política de recusa.",
				"Golden set: 5 casos (incluindo um ambíguo e um fora de escopo).",
				"Orçamento de passos."
			]
		}],
		exercise: {
			kind: "prompt",
			exercise: {
				task: "Escreva o documento de desenho em um único prompt-especificação: grafo, ferramentas, recusa, 5 casos de teste, orçamento. Trate como se fosse o system + runbook do produto.",
				rubric: [
					"Há um grafo ou pipeline nomeado",
					"Há pelo menos duas ferramentas",
					"Há regra de recusa / NÃO_SEI / humano",
					"Há casos de teste",
					"Há orçamento (passos ou tokens)"
				],
				sample: `Sistema: roteador → RAG políticas → agente ReAct (buscar_doc, abrir_ticket) → validador.
Recusa: se trecho não cobrir, ESCALAR_HUMANO.
Testes: férias 30 dias; reembolso dia 12; acesso VPN; pergunta de fofoca; PDF contraditório.
Orçamento: 6 passos, k=6, modelo pequeno no roteador.`,
				hiddenSpec: "Arquitetura de agente interno de RH/políticas com RAG, recusa, ferramentas e eval."
			}
		}
	}
];
var LESSONS_FUNDACAO = [
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
			"Se você entender isso, seus prompts deixam de ser pedidos mágicos e viram contratos."
		],
		sections: [
			{
				type: "text",
				title: "O contrato mental",
				body: "Um LLM recebe uma sequência de tokens e estima a probabilidade do próximo. Tudo — raciocínio, código, mentira convincente — nasce dessa previsão. O prompt é o contexto que enviesa essa distribuição. Sem contexto claro, o modelo completa o que for mais comum no treino, não o que você queria."
			},
			{
				type: "steps",
				title: "Peças que você precisa nomear",
				items: [
					"Token: fatia de texto (não exatamente uma palavra).",
					"Janela de contexto: memória de curto prazo da conversa + system + ferramentas.",
					"Temperatura: 0 é quase determinístico; alto é exploratório.",
					"System prompt: regras estáveis. User: a tarefa. Assistant: a resposta."
				]
			},
			{
				type: "callout",
				tone: "key",
				body: "Trate o modelo como um estagiário brilhante e amnésico. Tudo que ele precisa para acertar tem que estar no contexto desta chamada."
			},
			{
				type: "code",
				title: "Uma chamada é só isto",
				lang: "python",
				code: `messages = [
    {"role": "system", "content": "Você extrai JSON. Sem prosa."},
    {"role": "user", "content": "Pedido: 2 cafés, mesa 4"},
]
# O modelo completa assistant.content — nada mais.`
			}
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
						"Lê a internet em tempo real"
					],
					answer: 1,
					explain: "Tudo é previsão de próximo token. Ferramentas e busca só entram se você as ligar no sistema."
				},
				{
					id: "q2",
					prompt: "Por que temperatura baixa ajuda em extração JSON?",
					options: [
						"Aumenta criatividade do formato",
						"Reduz variação e favorece o caminho mais provável",
						"Aumenta a janela de contexto",
						"Desliga o system prompt"
					],
					answer: 1,
					explain: "Tarefas de formato rígido pedem baixa aleatoriedade."
				},
				{
					id: "q3",
					prompt: "Onde devem viver regras estáveis do produto?",
					options: [
						"Só no user, a cada mensagem",
						"No system (ou no developer) e reafirmadas quando críticas",
						"Na temperatura",
						"No nome do modelo"
					],
					answer: 1,
					explain: "System é o lugar das invariantes. User carrega a instância da tarefa."
				}
			]
		}
	},
	{
		id: "anatomia",
		track: "fundacao",
		order: 2,
		title: "Anatomia de um prompt que funciona",
		minutes: 10,
		summary: "Papel, objetivo, contexto, restrições, formato e exemplos — nesta ordem.",
		tutor: ["Prompt não é um parágrafo bonito. É uma especificação.", "A ordem que eu uso: papel, objetivo, contexto, restrições, formato, exemplos, e o input."],
		sections: [
			{
				type: "text",
				title: "Seis blocos",
				body: "A maior falha de quem começa é misturar tudo. Separe blocos. O modelo lê da esquerda para a direita e dá peso ao que está recente — mas estrutura clara vence truques de posição na maior parte das tarefas."
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
INPUT: {ticket}`
			},
			{
				type: "callout",
				tone: "tip",
				body: "Peça o formato duas vezes: na restrição (‘só JSON’) e num schema. Modelos obedecem melhor a schema + exemplo do que a um adjetivo (‘seja conciso’)."
			}
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
					"Pede JSON (e só JSON, ou JSON em fence)"
				],
				sample: `PAPEL: extrator de dados de e-mail comercial
OBJETIVO: extrair nome, valor, prazo e reclamacao_bool
RESTRIÇÕES: nunca invente números; use null se ausente
FORMATO: {"nome": string|null, "valor": number|null, "prazo": string|null, "reclamacao": boolean}
INPUT: {{email}}`,
				hiddenSpec: "O prompt deve especificar extração estruturada de e-mail com campos nome, valor, prazo e reclamação, incluindo tratamento de ausência."
			}
		}
	},
	{
		id: "fewshot",
		track: "fundacao",
		order: 3,
		title: "Zero-shot, few-shot e papéis",
		minutes: 9,
		summary: "Quando um exemplo vale mais que um parágrafo de instrução.",
		tutor: ["Zero-shot basta quando a tarefa é comum. Few-shot entra quando o estilo, o limite ou o caso extremo importam.", "Exemplos ruins ensinam o erro. Escolha casos que cubram o bordo, não só o caminho feliz."],
		sections: [
			{
				type: "text",
				title: "Três modos",
				body: "Zero-shot: só a instrução. Few-shot: 1–5 pares input→output. Role prompting: um papel que ativa um estilo e um conjunto de heurísticas (‘você é revisor de contratos’). Papel sozinho não substitui restrições."
			},
			{
				type: "steps",
				title: "Few-shot que não quebra",
				items: [
					"Mostre o formato exato da saída nos exemplos.",
					"Inclua um caso negativo (recusar, pedir dado, devolver null).",
					"Mantenha o mesmo schema em todos os exemplos.",
					"Não coloque a resposta no user se o padrão da API espera assistant."
				]
			},
			{
				type: "code",
				title: "Exemplo de bordo",
				lang: "text",
				code: `IN: "oi"
OUT: {"intencao": "smalltalk", "acao": "cumprimentar"}

IN: "cancela pedido 882, cliente irritado"
OUT: {"intencao": "cancelar", "acao": "confirmar_id_e_politica"}`
			}
		],
		exercise: {
			kind: "quiz",
			questions: [{
				id: "q1",
				prompt: "Quando few-shot é mais útil?",
				options: [
					"Sempre, quanto mais exemplos melhor",
					"Quando o formato ou os casos de bordo não são óbvios",
					"Só em modelos pequenos",
					"Nunca, o system prompt basta"
				],
				answer: 1,
				explain: "Few-shot é caro em tokens. Use para formato e bordos, não para encher contexto."
			}, {
				id: "q2",
				prompt: "Qual exemplo falta com mais frequência?",
				options: [
					"O caso feliz perfeito",
					"O caso em que o modelo deve recusar ou devolver null",
					"Um poema",
					"A biografia do usuário"
				],
				answer: 1,
				explain: "Sem o negativo, o modelo preenche lacunas com invenção."
			}]
		}
	},
	{
		id: "formato",
		track: "fundacao",
		order: 4,
		title: "Controlar o formato",
		minutes: 8,
		summary: "JSON, XML, markdown — e o que fazer quando o modelo foge do schema.",
		tutor: ["Formato é a primeira alavanca de confiabilidade. Sem ele, você não consegue avaliar nem encadear.", "No Python, você vai validar com um schema. No prompt, você antecipa essa validação."],
		sections: [
			{
				type: "text",
				title: "Contrato de saída",
				body: "Defina schema, tipos, enums e o comportamento de campo ausente. Depois, no código, parseie e rejeite. Se falhar, peça reparo com o erro do parser — não recomece do zero."
			},
			{
				type: "code",
				title: "Reparar em vez de rezar",
				lang: "python",
				code: `def complete_json(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        return repair(text, error=str(e))  # nova chamada só com o erro`
			},
			{
				type: "callout",
				tone: "warn",
				body: "Não peça ‘JSON ou uma explicação’. Isso destrói o parser. Explique dentro de um campo, nunca fora do objeto."
			}
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
`
			}
		}
	}
];
var LESSONS_PROMPT = [
	{
		id: "cot",
		track: "prompt",
		order: 5,
		title: "Chain of Thought",
		minutes: 10,
		summary: "Forçar o raciocínio visível antes da resposta — e quando não fazer isso.",
		tutor: ["Chain of Thought é simples: o modelo pensa em voz alta antes de concluir.", "Isso ajuda em matemática, diagnóstico e políticas. Atrasa e vaza raciocínio em tarefas de formato curto."],
		sections: [
			{
				type: "text",
				title: "A receita",
				body: "Peça passos numerados, depois a resposta final num campo isolado. ‘Pense passo a passo’ funciona, mas é vago. Melhor: ‘liste premissas, teste cada uma, só então conclua’."
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
Resposta final em <answer> com uma linha.`
			},
			{
				type: "callout",
				tone: "key",
				body: "Separe raciocínio e resposta. O raciocínio é para o modelo (e para você depurar). A resposta é para o sistema."
			}
		],
		exercise: {
			kind: "prompt",
			exercise: {
				task: "Escreva um prompt CoT para decidir se um reembolso de R$ 180, pedido 12 dias após a compra, deve ser aprovado, dado que a política é 7 dias salvo defeito de fabricação.",
				rubric: [
					"Pede passos de raciocínio",
					"Cita a política como premissa",
					"Separa a decisão final",
					"Prevê o caso de defeito vs. atraso simples"
				],
				sample: `Use a política: reembolso em 7 dias, exceto defeito.
Passos: (1) prazo (2) motivo (3) exceção (4) decisão.
Resposta final: APROVAR | NEGAR | PEDIR_EVIDENCIA.`,
				hiddenSpec: "Decisão de reembolso com política de 7 dias e exceção de defeito, usando raciocínio explícito e decisão final isolada."
			}
		}
	},
	{
		id: "tot",
		track: "prompt",
		order: 6,
		title: "Self-consistency e Tree of Thoughts",
		minutes: 11,
		summary: "Vários caminhos, voto e busca em árvore — o custo de acertar mais.",
		tutor: ["Self-consistency: gere N raciocínios independentes e vote na resposta.", "Tree of Thoughts: explore ramos, avalie, poda os fracos. É orquestração, não um único prompt milagroso."],
		sections: [
			{
				type: "text",
				title: "Quando pagar o custo",
				body: "Essas técnicas multiplicam tokens. Use em decisões irreversíveis (jurídico, arquitetura, diagnóstico). Não use em classificação barata."
			},
			{
				type: "steps",
				title: "Self-consistency em 4 passos",
				items: [
					"Fixe temperatura média (0.5–0.8) para diversificar caminhos.",
					"Gere 3–7 CoTs independentes.",
					"Extraia só a resposta final de cada um.",
					"Vote. Em empate, peça um juiz com os candidatos."
				]
			},
			{
				type: "code",
				title: "Esqueleto Python",
				lang: "python",
				code: `def majority(answers: list[str]) -> str:
    from collections import Counter
    return Counter(answers).most_common(1)[0][0]`
			}
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
`
			}
		}
	},
	{
		id: "react",
		track: "prompt",
		order: 7,
		title: "ReAct: raciocinar e agir",
		minutes: 12,
		summary: "O loop Thought → Action → Observation que sustenta agentes.",
		tutor: ["ReAct é o coração dos agentes. O modelo não precisa saber o mundo: ele age, observa, e continua.", "Seu trabalho de expert é limitar as ações, parsear a ação, e cortar o loop."],
		sections: [
			{
				type: "text",
				title: "O loop",
				body: "Thought: o que falta. Action: nome da ferramenta + argumentos. Observation: o que o mundo devolveu. Repita até Action = finish. Sem parser rígido, o loop vira prosa."
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
ActionInput: {"preco": 19.90}`
			},
			{
				type: "callout",
				tone: "warn",
				body: "Nunca deixe o modelo inventar o nome da ferramenta. Liste o catálogo. Se a ação for desconhecida, devolva erro como observation — não como crash."
			}
		],
		exercise: {
			kind: "quiz",
			questions: [{
				id: "q1",
				prompt: "O que deve acontecer se o modelo pedir uma ferramenta que não existe?",
				options: [
					"Executar a mais parecida em silêncio",
					"Devolver observation de erro e deixar o loop continuar",
					"Encerrar o processo do servidor",
					"Aumentar a temperatura"
				],
				answer: 1,
				explain: "Erro observável é informação. O agente pode corrigir o nome ou desistir com finish."
			}, {
				id: "q2",
				prompt: "Qual é o critério típico de parada?",
				options: [
					"Sempre 20 passos",
					"Action finish, ou teto de passos, ou ferramenta de parada",
					"Quando o thought fica longo",
					"Quando o usuário fecha a aba"
				],
				answer: 1,
				explain: "Sem teto, o agente gira para sempre. Sem finish, você não tem contrato de saída."
			}]
		}
	},
	{
		id: "meta",
		track: "prompt",
		order: 8,
		title: "Meta-prompting e encadeamento",
		minutes: 10,
		summary: "Um prompt que escreve outro, e pipelines de etapas com estado.",
		tutor: ["Meta-prompting: você pede ao modelo para criticar e reescrever o prompt.", "Encadeamento: cada etapa tem um contrato. O expert desenha o grafo, não um prompt único de 4 mil palavras."],
		sections: [
			{
				type: "steps",
				title: "Pipeline clássico",
				items: [
					"Extrair (JSON cru).",
					"Validar (schema).",
					"Raciocinar (CoT + decisão).",
					"Redigir (tom humano, sem números inventados).",
					"Revisar (constituição: o que nunca pode sair)."
				]
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
    state = step(state)`
			},
			{
				type: "callout",
				tone: "tip",
				body: "Não peça ao mesmo prompt para ser extrator e poeta. Especialização vence."
			}
		],
		exercise: {
			kind: "reflect",
			prompt: "Descreva um pipeline de 3 etapas para um assistente que responde perguntas sobre um PDF interno. Nomeie o contrato de entrada e saída de cada etapa.",
			minChars: 180
		}
	}
];
var LESSONS_RAG = [
	{
		id: "rag-base",
		track: "rag",
		order: 9,
		title: "RAG sem mistério",
		minutes: 12,
		summary: "Indexar, recuperar, reranquear, gerar — e as falhas clássicas.",
		tutor: ["RAG não é ‘colar PDF no prompt’. É um sistema de recuperação com um gerador no fim.", "A qualidade da resposta é, na prática, a qualidade do trecho recuperado."],
		sections: [
			{
				type: "steps",
				title: "O caminho",
				items: [
					"Chunk: quebrar documentos com overlap e metadados (fonte, data, seção).",
					"Embed: vetor por chunk.",
					"Retrieve: top-k por similaridade + filtros (hybrid ajuda).",
					"Rerank: um modelo menor reordena os k.",
					"Generate: o LLM só pode citar o que está nos trechos."
				]
			},
			{
				type: "callout",
				tone: "key",
				body: "Instrua: ‘se a evidência não estiver nos trechos, diga que não sabe’. Sem isso, o modelo alucina com confiança."
			},
			{
				type: "code",
				title: "Prompt de geração com evidência",
				lang: "text",
				code: `Use SOMENTE os trechos.
Se faltar evidência, responda NÃO_SEI.
Cite [n] após cada fato.

TRECHOS:
[1] ...
PERGUNTA: ...`
			}
		],
		exercise: {
			kind: "quiz",
			questions: [{
				id: "q1",
				prompt: "Onde a maior parte dos erros de RAG nasce?",
				options: [
					"Na temperatura do gerador",
					"Na recuperação (chunk, query, ranking)",
					"No nome do índice",
					"No CSS da interface"
				],
				answer: 1,
				explain: "Gerador bom com trecho errado produz resposta errada e fluente."
			}, {
				id: "q2",
				prompt: "Por que pedir NÃO_SEI é crítico?",
				options: [
					"Economiza tokens",
					"Impede o modelo de completar com conhecimento paramétrico não fundamentado",
					"Melhora o embedding",
					"Aumenta k"
				],
				answer: 1,
				explain: "O modelo quer ser útil. Sem permissão para recusar, ele inventa."
			}]
		}
	},
	{
		id: "tools",
		track: "rag",
		order: 10,
		title: "Function calling",
		minutes: 11,
		summary: "Ferramentas tipadas, schemas e o modelo como roteador.",
		tutor: ["Function calling é o modelo escolhendo uma função e preenchendo argumentos segundo um JSON Schema.", "Você executa. O modelo não deve ter efeitos colaterais sozinho."],
		sections: [
			{
				type: "text",
				title: "Contrato da ferramenta",
				body: "Nome estável, descrição para o modelo (não para o humano), parâmetros com tipos e required. Descrições vagas geram chamadas vagas."
			},
			{
				type: "code",
				title: "Schema enxuto",
				lang: "json",
				code: `{
  "name": "buscar_pedido",
  "description": "Busca um pedido pelo id numérico.",
  "parameters": {
    "type": "object",
    "properties": {
      "id": {"type": "string", "description": "ID do pedido, só dígitos"}
    },
    "required": ["id"]
  }
}`
			},
			{
				type: "callout",
				tone: "warn",
				body: "Valide argumentos no servidor. O modelo pode mandar id='DROP TABLE'. Ferramenta é superfície de ataque."
			}
		],
		exercise: {
			kind: "python",
			exercise: {
				intro: "Implemente dispatch(name, args, registry) que chama registry[name](**args) ou devolve a string ERRO:ferramenta.",
				starter: `def dispatch(name: str, args: dict, registry: dict):
    # TODO
    pass
`,
				tests: `
reg = {"soma": lambda a, b: a + b}
assert dispatch("soma", {"a": 2, "b": 3}, reg) == 5
assert dispatch("x", {}, reg) == "ERRO:ferramenta"
print("ok")
`,
				solution: `def dispatch(name: str, args: dict, registry: dict):
    fn = registry.get(name)
    if fn is None:
        return "ERRO:ferramenta"
    return fn(**args)
`
			}
		}
	},
	{
		id: "memoria",
		track: "rag",
		order: 11,
		title: "Memória de agentes",
		minutes: 10,
		summary: "Curto prazo, longo prazo, episódica e o que nunca deve ser lembrado.",
		tutor: ["Memória ruim deixa o agente contraditório ou invasivo.", "Separe: buffer da conversa, sumário, fatos recuperáveis, e segredos que não persistem."],
		sections: [{
			type: "steps",
			title: "Camadas",
			items: [
				"Curto prazo: últimas N mensagens + estado da tarefa.",
				"Sumário: compressão periódica (perde detalhe; não use para números).",
				"Longo prazo: vetor de fatos (‘usuário prefere Python’).",
				"Episódica: o que o agente fez e o resultado (trace)."
			]
		}, {
			type: "callout",
			tone: "key",
			body: "Números, IDs e decisões legais não podem viver só no sumário. Estruture-os em estado tipado."
		}],
		exercise: {
			kind: "reflect",
			prompt: "Para um agente de suporte, liste 3 coisas que devem ir para memória de longo prazo e 3 que jamais devem ser gravadas. Justifique cada uma em uma linha.",
			minChars: 200
		}
	}
];
var TRACKS = [
	{
		id: "fundacao",
		label: "Fundação",
		level: "Base",
		blurb: "Como o modelo lê, gera e erra — o chão de tudo."
	},
	{
		id: "prompt",
		label: "Prompt avançado",
		level: "Técnica",
		blurb: "CoT, ToT, ReAct, meta-prompt e encadeamento."
	},
	{
		id: "rag",
		label: "RAG e ferramentas",
		level: "Sistema",
		blurb: "Busca, memória, function calling e contexto vivo."
	},
	{
		id: "agentes",
		label: "Agentes",
		level: "Orquestração",
		blurb: "Loops, multi-agentes e Python de verdade."
	},
	{
		id: "expert",
		label: "Expert",
		level: "Produção",
		blurb: "Evals, custo, guardrails e arquitetura."
	}
];
var LESSONS = [
	...LESSONS_FUNDACAO,
	...LESSONS_PROMPT,
	...LESSONS_RAG,
	...LESSONS_AGENTES,
	...LESSONS_EXPERT
].sort((a, b) => a.order - b.order);
function lessonById(id) {
	return LESSONS.find((l) => l.id === id);
}
function lessonsInTrack(track) {
	return LESSONS.filter((l) => l.track === track);
}
function nextLesson(id) {
	const i = LESSONS.findIndex((l) => l.id === id);
	return i >= 0 ? LESSONS[i + 1] : void 0;
}
function prevLesson(id) {
	const i = LESSONS.findIndex((l) => l.id === id);
	return i > 0 ? LESSONS[i - 1] : void 0;
}
var useProgress = create()(persist((set) => ({
	name: "",
	setName: (name) => set({ name }),
	byLesson: {},
	mark: (id, patch) => set((s) => ({ byLesson: {
		...s.byLesson,
		[id]: {
			...s.byLesson[id],
			...patch
		}
	} })),
	reset: () => set({
		byLesson: {},
		name: ""
	})
}), { name: "nexo-progress-v1" }));
function completedCount(byLesson) {
	return LESSONS.filter((l) => byLesson[l.id]?.completed).length;
}
function AppHeader() {
	const done = completedCount(useProgress((s) => s.byLesson));
	const pct = Math.round(done / LESSONS.length * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "font-display text-lg tracking-tight text-fg",
				children: "NEXO"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "hidden text-xs tabular-nums text-muted sm:block",
					children: [
						done,
						"/",
						LESSONS.length,
						" aulas"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 w-24 overflow-hidden rounded-full bg-raised",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-accent transition-[width] duration-[var(--motion-fast)]",
						style: { width: `${pct}%` }
					})
				})]
			})]
		})
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-[opacity,transform,background-color,color,border-color] duration-[var(--motion-quick)] ease-[var(--ease-smooth-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-surface text-fg border border-border hover:bg-raised",
			ghost: "text-muted hover:text-fg hover:bg-raised",
			outline: "border border-border bg-transparent text-fg hover:bg-raised"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askIris = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("175dc3c021eff0421da7c49d45e17b3f90c02a455a9954d390f4367e6a855f9d"));
var gradePrompt = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("d5b7a3d738aa851a7c4f6a649b87fc5a4550661ba903122a5242836037b9e82f"));
function TutorIris({ mood = "idle", size = 120, className }) {
	const talking = mood === "talk";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("iris-float relative shrink-0", className),
		style: {
			width: size,
			height: size
		},
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 100 100",
			className: "size-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
					id: "irisCore",
					cx: "38%",
					cy: "32%",
					r: "70%",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "#d7e0e8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "55%",
							stopColor: "#9eb3c4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "#3d4a55"
						})
					]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "50",
					r: "44",
					fill: "none",
					stroke: "#9eb3c4",
					strokeWidth: "1.4",
					opacity: "0.55",
					className: mood === "think" ? "iris-ring-think origin-center" : "",
					style: { transformOrigin: "50px 50px" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "50",
					r: "34",
					fill: "url(#irisCore)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "50",
					r: "34",
					fill: "none",
					stroke: "#eceae4",
					strokeWidth: "0.6",
					opacity: "0.25"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					className: "iris-eye",
					style: { transformOrigin: "38px 44px" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "38",
						cy: "44",
						rx: "4.2",
						ry: "5",
						fill: "#0b0c0d"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "36.6",
						cy: "42.4",
						r: "1.1",
						fill: "#eceae4"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					className: "iris-eye",
					style: {
						transformOrigin: "62px 44px",
						animationDelay: "0.12s"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "62",
						cy: "44",
						rx: "4.2",
						ry: "5",
						fill: "#0b0c0d"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "60.6",
						cy: "42.4",
						r: "1.1",
						fill: "#eceae4"
					})]
				}),
				talking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M38 62 Q50 72 62 62",
					fill: "none",
					stroke: "#0b0c0d",
					strokeWidth: "2.2",
					strokeLinecap: "round",
					className: "iris-mouth-talk"
				}) : mood === "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M38 61 Q50 70 62 61",
					fill: "none",
					stroke: "#0b0c0d",
					strokeWidth: "2.2",
					strokeLinecap: "round"
				}) : mood === "think" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M40 64 H60",
					fill: "none",
					stroke: "#0b0c0d",
					strokeWidth: "2",
					strokeLinecap: "round"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M38 62 Q50 66 62 62",
					fill: "none",
					stroke: "#0b0c0d",
					strokeWidth: "2",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "18",
					r: "3.2",
					fill: "#6b8f71"
				})
			]
		})
	});
}
function IrisChat({ lessonTitle, context }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [input, setInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [log, setLog] = (0, import_react.useState)([]);
	async function send() {
		const message = input.trim();
		if (!message || busy) return;
		setInput("");
		setLog((l) => [...l, {
			role: "you",
			text: message
		}]);
		setBusy(true);
		const res = await askIris({ data: {
			message,
			lessonTitle,
			context
		} });
		setBusy(false);
		setLog((l) => [...l, {
			role: "iris",
			text: res.ok ? res.text : res.error
		}]);
	}
	if (!open) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: "fixed right-4 bottom-4 z-30 flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm text-fg shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorIris, {
			size: 36,
			mood: "idle"
		}), "Perguntar à Íris"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-x-3 bottom-3 z-30 mx-auto flex max-h-[70vh] w-auto max-w-md flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-xl sm:right-4 sm:bottom-4 sm:left-auto sm:w-[380px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between border-b border-border px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorIris, {
						size: 40,
						mood: busy ? "think" : "talk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Íris"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Tutora"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setOpen(false),
					children: "Fechar"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-40 flex-1 space-y-3 overflow-y-auto p-3",
				children: log.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Dúvida sobre a aula, um prompt travado, ou um loop de agente — manda aqui."
				}) : log.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-subtle",
						children: [m.role === "you" ? "Você" : "Íris", " · "]
					}), m.text]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2 border-t border-border p-2",
				onSubmit: (e) => {
					e.preventDefault();
					send();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: "Sua pergunta",
					className: "h-11 flex-1 rounded-[var(--radius-sm)] border border-border bg-raised px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy || !input.trim(),
					children: "Enviar"
				})]
			})
		]
	});
}
//#endregion
export { TRACKS as a, completedCount as c, lessonsInTrack as d, nextLesson as f, LESSONS as i, gradePrompt as l, useProgress as m, Button as n, TutorIris as o, prevLesson as p, IrisChat as r, cn as s, AppHeader as t, lessonById as u };
