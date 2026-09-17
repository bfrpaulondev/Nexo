import type { Lesson } from "./types";

export const LESSONS_RAG: Lesson[] = [
  {
    id: "rag-base",
    track: "rag",
    order: 9,
    title: "RAG sem mistério",
    minutes: 12,
    summary: "Indexar, recuperar, reranquear, gerar — e as falhas clássicas.",
    tutor: [
      "RAG não é ‘colar PDF no prompt’. É um sistema de recuperação com um gerador no fim.",
      "A qualidade da resposta é, na prática, a qualidade do trecho recuperado.",
    ],
    sections: [
      {
        type: "steps",
        title: "O caminho",
        items: [
          "Chunk: quebrar documentos com overlap e metadados (fonte, data, seção).",
          "Embed: vetor por chunk.",
          "Retrieve: top-k por similaridade + filtros (hybrid ajuda).",
          "Rerank: um modelo menor reordena os k.",
          "Generate: o LLM só pode citar o que está nos trechos.",
        ],
      },
      {
        type: "callout",
        tone: "key",
        body: "Instrua: ‘se a evidência não estiver nos trechos, diga que não sabe’. Sem isso, o modelo alucina com confiança.",
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
PERGUNTA: ...`,
      },
    ],
    exercise: {
      kind: "quiz",
      questions: [
        {
          id: "q1",
          prompt: "Onde a maior parte dos erros de RAG nasce?",
          options: [
            "Na temperatura do gerador",
            "Na recuperação (chunk, query, ranking)",
            "No nome do índice",
            "No CSS da interface",
          ],
          answer: 1,
          explain: "Gerador bom com trecho errado produz resposta errada e fluente.",
        },
        {
          id: "q2",
          prompt: "Por que pedir NÃO_SEI é crítico?",
          options: [
            "Economiza tokens",
            "Impede o modelo de completar com conhecimento paramétrico não fundamentado",
            "Melhora o embedding",
            "Aumenta k",
          ],
          answer: 1,
          explain: "O modelo quer ser útil. Sem permissão para recusar, ele inventa.",
        },
      ],
    },
  },
  {
    id: "tools",
    track: "rag",
    order: 10,
    title: "Function calling",
    minutes: 11,
    summary: "Ferramentas tipadas, schemas e o modelo como roteador.",
    tutor: [
      "Function calling é o modelo escolhendo uma função e preenchendo argumentos segundo um JSON Schema.",
      "Você executa. O modelo não deve ter efeitos colaterais sozinho.",
    ],
    sections: [
      {
        type: "text",
        title: "Contrato da ferramenta",
        body: "Nome estável, descrição para o modelo (não para o humano), parâmetros com tipos e required. Descrições vagas geram chamadas vagas.",
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
}`,
      },
      {
        type: "callout",
        tone: "warn",
        body: "Valide argumentos no servidor. O modelo pode mandar id='DROP TABLE'. Ferramenta é superfície de ataque.",
      },
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
`,
      },
    },
  },
  {
    id: "memoria",
    track: "rag",
    order: 11,
    title: "Memória de agentes",
    minutes: 10,
    summary: "Curto prazo, longo prazo, episódica e o que nunca deve ser lembrado.",
    tutor: [
      "Memória ruim deixa o agente contraditório ou invasivo.",
      "Separe: buffer da conversa, sumário, fatos recuperáveis, e segredos que não persistem.",
    ],
    sections: [
      {
        type: "steps",
        title: "Camadas",
        items: [
          "Curto prazo: últimas N mensagens + estado da tarefa.",
          "Sumário: compressão periódica (perde detalhe; não use para números).",
          "Longo prazo: vetor de fatos (‘usuário prefere Python’).",
          "Episódica: o que o agente fez e o resultado (trace).",
        ],
      },
      {
        type: "callout",
        tone: "key",
        body: "Números, IDs e decisões legais não podem viver só no sumário. Estruture-os em estado tipado.",
      },
    ],
    exercise: {
      kind: "reflect",
      prompt:
        "Para um agente de suporte, liste 3 coisas que devem ir para memória de longo prazo e 3 que jamais devem ser gravadas. Justifique cada uma em uma linha.",
      minChars: 200,
    },
  },
];
