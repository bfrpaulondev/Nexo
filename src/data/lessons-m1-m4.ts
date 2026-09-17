import type { Lesson } from "./types";

export const LESSONS_M1_M4: Lesson[] = [
  {
    id: "m1-limites",
    track: "m1",
    order: 1,
    title: "O que a IA faz — e o que finge fazer",
    minutes: 9,
    summary: "Previsão fluente não é conhecimento. Contexto é memória. Incerteza é o produto.",
    tutor: [
      "Eu sou a Lena. Neste módulo você deixa de tratar o chat como oráculo.",
      "O modelo completa o texto mais provável. Se o fundamento não estiver no contexto, a fluência é só maquiagem.",
    ],
    sections: [
      {
        type: "text",
        title: "Três ilusões",
        body: "Ilusão 1: ‘sabe’. Sabe estatística de treino, não o seu ficheiro. Ilusão 2: ‘é honesto quando parece seguro’. Confiança no tom não correlaciona com verdade. Ilusão 3: ‘lembra de mim’. Só lembra o que está nesta janela ou no que você gravou.",
      },
      {
        type: "steps",
        title: "Checklist de leitura de uma resposta",
        items: [
          "Há fonte ou trecho, ou só afirmação?",
          "O modelo admite o que não sabe?",
          "Números e nomes são verificáveis em 30 segundos?",
          "Se remover o tom confiante, sobra evidência?",
        ],
      },
      {
        type: "callout",
        tone: "key",
        body: "Use a IA como estagiário brilhante e amnésico: útil com briefing, perigoso sem supervisão nos factos.",
      },
    ],
    exercise: {
      kind: "quiz",
      questions: [
        {
          id: "q1",
          prompt: "Uma resposta longa, educada e detalhada sobre a sua empresa provavelmente…",
          options: [
            "Está correta, porque o tom é profissional",
            "Pode ser inventada se esses factos não estão no contexto",
            "Vem sempre de uma base interna",
            "Não precisa de verificação se pediu ‘seja preciso’",
          ],
          answer: 1,
          explain: "Sem evidência no contexto, o modelo completa com o que parece uma empresa típica.",
        },
        {
          id: "q2",
          prompt: "Onde vive a ‘memória’ de um chat, por defeito?",
          options: [
            "Numa base privada permanente da sua conta",
            "Na janela de contexto desta conversa (e no que você persistir)",
            "No telemóvel",
            "No nome do modelo",
          ],
          answer: 1,
          explain: "Sem memória explícita ou RAG, só existe o que está neste fio.",
        },
      ],
    },
  },
  {
    id: "m1-alucinacao",
    track: "m1",
    order: 2,
    title: "Prática: caçar confiança sem fundamento",
    minutes: 10,
    summary: "Ler uma resposta convincente e marcar o que não se aguenta.",
    tutor: [
      "Vou te dar um parágrafo que parece relatório. O teu trabalho é o da auditoria, não o da admiração.",
    ],
    sections: [
      {
        type: "code",
        title: "Resposta gerada (trecho)",
        lang: "text",
        code: `Segundo o relatório interno de 2024, a Nexo SA reduziu
o retrabalho em 37% após adoptar agentes autónomos em
todos os tickets. O CNPJ 12.345.678/0001-99 confirma
a certificação ISO 42001 obtida em março. Recomenda-se
replicar o playbook sem revisão humana, pois o modelo
não erra em políticas de RH.`,
      },
      {
        type: "callout",
        tone: "warn",
        body: "Nada disto foi dado no enunciado. Percentagens, CNPJ, ISO e a frase ‘não erra’ são sinais clássicos.",
      },
    ],
    exercise: {
      kind: "reflect",
      prompt:
        "Liste pelo menos 4 afirmações sem fundamento no trecho, e escreva a pergunta que faria ao modelo para cada uma (ex.: ‘cite o relatório ou diga NÃO_SEI’). Inclua a decisão: aceitar, verificar, ou recusar.",
      minChars: 220,
    },
  },
  {
    id: "m2-intencao",
    track: "m2",
    order: 3,
    title: "Conversar não é um pedido único",
    minutes: 9,
    summary: "Objetivo, contexto, critério de pronto, e o direito de corrigir.",
    tutor: [
      "Eu sou o Nilo. Um chat produtivo é uma sequência: alinhar, fazer, corrigir, aprofundar.",
      "Quem manda ‘melhora isto’ está a jogar à sorte. Quem manda o critério está a dirigir.",
    ],
    sections: [
      {
        type: "steps",
        title: "Turnos que pagam",
        items: [
          "Alinhar: o que é sucesso, para quem, em que formato.",
          "Entregar um rascunho curto, não um tratado.",
          "Corrigir com exemplo do erro, não com adjetivo.",
          "Aprofundar só a parte que passou o critério.",
        ],
      },
      {
        type: "code",
        title: "De vago para dirigido",
        lang: "text",
        code: `VAGO: "faz um e-mail para o cliente"
DIRIGIDO:
Objetivo: remarcar reunião
Tom: direto, sem desculpas longas
Factos: terça 10h → quinta 15h
Pronto quando: 5 linhas, uma pergunta no fim`,
      },
    ],
    exercise: {
      kind: "quiz",
      questions: [
        {
          id: "q1",
          prompt: "A melhor correção depois de um rascunho frouxo é…",
          options: [
            "‘Fica mais profissional’",
            "Mostrar a frase má e a regra (‘sem adjetivos vazios; máximo 5 linhas’)",
            "Recomeçar noutro modelo",
            "Aumentar a temperatura",
          ],
          answer: 1,
          explain: "Correção é contra-exemplo + regra. Adjetivo não é especificação.",
        },
      ],
    },
  },
  {
    id: "m2-vago",
    track: "m2",
    order: 4,
    title: "Prática: do pedido vago à conversa",
    minutes: 11,
    summary: "Reescrever ‘me ajuda com isso’ numa sequência de turnos.",
    tutor: [
      "Pedido bruto: ‘me ajuda com o relatório do trimestre’. Transforma isto num diálogo com três mensagens tuas.",
    ],
    sections: [
      {
        type: "text",
        body: "A primeira mensagem alinha. A segunda entrega restrições. A terceira só corrige o que falhou. Não despeje tudo de uma vez se ainda não sabe o público.",
      },
    ],
    exercise: {
      kind: "prompt",
      exercise: {
        task: "Escreva as 3 mensagens (alinhar, executar, corrigir) para produzir um relatório trimestral interno. O utilizador original só disse ‘me ajuda com o relatório do trimestre’.",
        rubric: [
          "A 1ª mensagem pede ou declara objetivo, público e formato",
          "A 2ª dá restrições concretas (tamanho, tom, o que não inventar)",
          "A 3ª corrige com critério, não com adjetivo",
          "Há um critério de ‘pronto’",
        ],
        sample: `1) Público: diretoria. Objetivo: 1 página, 3 métricas, 3 riscos. Se faltar número, pede. Formato: markdown.
2) Não inventes percentagens. Usa só os dados que eu colar. Secções: resultado, risco, pedido de decisão.
3) Cortaste demais os riscos. Mantém 3 riscos, cada um com dono e data. Sem a palavra "sinergia". Pronto = 1 página.`,
        hiddenSpec: "Sequência de 3 turnos para relatório trimestral a partir de pedido vago.",
      },
    },
  },
  {
    id: "m3-anatomia",
    track: "m3",
    order: 5,
    title: "As quatro peças de um prompt",
    minutes: 10,
    summary: "Instrução, exemplos, restrições, formato — nesta ordem, sempre visíveis.",
    tutor: [
      "Vera aqui. Prompt bom é contrato. Se não dá para avaliar, não é prompt, é desejo.",
    ],
    sections: [
      {
        type: "code",
        title: "Esqueleto",
        lang: "text",
        code: `INSTRUÇÃO: o que fazer numa frase
EXEMPLOS: 1 positivo + 1 bordo (null / recusa)
RESTRIÇÕES: o que nunca fazer
FORMATO: schema ou lista de campos
INPUT: o material desta vez`,
      },
      {
        type: "callout",
        tone: "tip",
        body: "Peça o formato duas vezes: na restrição e no schema. ‘Seja conciso’ quase não muda o modelo; ‘máx. 8 linhas e 3 bullets’ muda.",
      },
    ],
    exercise: {
      kind: "quiz",
      questions: [
        {
          id: "q1",
          prompt: "Qual versão é mais testável?",
          options: [
            "‘Escreve um resumo bom e profissional’",
            "‘Resumo em 5 bullets; cada bullet começa com um verbo; zero números inventados’",
            "‘Usa a tua criatividade’",
            "‘Age como um génio’",
          ],
          answer: 1,
          explain: "Testável = critério observável. Papel teatral não substitui formato.",
        },
      ],
    },
  },
  {
    id: "m3-comparar",
    track: "m3",
    order: 6,
    title: "Prática: duas versões, uma rubrica",
    minutes: 12,
    summary: "Reescrever um prompt fraco e justificar cada mudança.",
    tutor: [
      "Prompt A: ‘classifica estes tickets’. Quero o teu Prompt B com as quatro peças. Depois comparas.",
    ],
    sections: [
      {
        type: "text",
        body: "Critérios da comparação: cobertura dos campos, tratamento de caso vazio, recusa, e se um script conseguiria parsear a saída.",
      },
    ],
    exercise: {
      kind: "prompt",
      exercise: {
        task: "Reescreva ‘classifica estes tickets’ num prompt completo para categorias {acesso, faturação, bug, outro}, urgência 1–3, e um campo lacunas[]. Inclua um exemplo de ticket vazio.",
        rubric: [
          "Instrução clara",
          "Categorias fechadas",
          "Exemplo ou caso de bordo",
          "Restrição de não inventar",
          "Formato de saída definido",
        ],
        sample: `Classifica o ticket.
Categorias: acesso | faturação | bug | outro
Urgência: 1 (hoje) 2 (esta semana) 3 (fila)
Se faltar dado, lacunas[] lista o que falta; não inventes produto.
JSON: {categoria, urgencia, lacunas[]}
Ex.: "oi" → {"categoria":"outro","urgencia":3,"lacunas":["assunto"]}`,
        hiddenSpec: "Prompt de classificação de tickets com enum, urgência, lacunas e exemplo de bordo.",
      },
    },
  },
  {
    id: "m4-rag",
    track: "m4",
    order: 7,
    title: "Informação: ficheiros, fontes e RAG",
    minutes: 11,
    summary: "O gerador só é tão honesto quanto o trecho que recebeu.",
    tutor: [
      "Sami. RAG não é ‘colar o PDF’. É recuperar trechos, obrigar citação, e permitir NÃO_SEI.",
    ],
    sections: [
      {
        type: "steps",
        title: "Caminho mínimo",
        items: [
          "Escolher a fonte (ficheiro, pasta, web com data).",
          "Recortar trechos com metadados (página, data).",
          "Perguntar só com esses trechos visíveis.",
          "Citar [n]. Se não estiver lá, NÃO_SEI.",
        ],
      },
      {
        type: "code",
        title: "Prompt de geração ancorada",
        lang: "text",
        code: `Usa SOMENTE os trechos. Facto sem [n] é inválido.
Se a resposta não estiver nos trechos: NÃO_SEI.

[1] Política férias: 30 dias após 12 meses (doc RH, 2024)
[2] Reembolso: 7 dias, excepto defeito (doc financeiro)

PERGUNTA: ...`,
      },
    ],
    exercise: {
      kind: "quiz",
      questions: [
        {
          id: "q1",
          prompt: "O maior risco de um ‘resume este PDF’ sem citação é…",
          options: [
            "Gastar tokens",
            "Misturar trecho real com conhecimento paramétrico inventado",
            "O PDF ficar bloqueado",
            "O modelo recusar sempre",
          ],
          answer: 1,
          explain: "Sem âncora, o modelo completa o PDF com o que ‘um PDF desses’ costuma dizer.",
        },
      ],
    },
  },
  {
    id: "m4-docs",
    track: "m4",
    order: 8,
    title: "Prática: resposta sustentada em documentos",
    minutes: 12,
    summary: "Responder só com dois trechos oficiais — ou recusar.",
    tutor: [
      "Pergunta do colaborador: ‘posso reembolso 12 dias depois, sem defeito?’ Os trechos estão na aula. Escreve o prompt de geração e a resposta esperada.",
    ],
    sections: [
      {
        type: "code",
        title: "Trechos",
        lang: "text",
        code: `[1] Reembolso em 7 dias corridos após a compra.
[2] Excepção: defeito de fabrico comprovado, sem prazo.`,
      },
    ],
    exercise: {
      kind: "prompt",
      exercise: {
        task: "Escreva (1) o prompt de geração ancorada e (2) a resposta que o modelo deveria dar à pergunta do reembolso no dia 12, sem defeito. Tem de citar trechos e não inventar política.",
        rubric: [
          "Obriga a usar só trechos",
          "Permite NÃO_SEI ou recusa",
          "Pede citação",
          "A resposta prevista nega o reembolso automático no dia 12",
        ],
        sample: `PROMPT: Só trechos [1][2]. Cite. Sem excepção aplicável → recusar e apontar os 7 dias.
RESPOSTA: Não. A política [1] limita a 7 dias. Sem defeito, [2] não se aplica.`,
        hiddenSpec: "Geração ancorada para reembolso dia 12 sem defeito, citando política de 7 dias.",
      },
    },
  },
];
