# NEXO — checkpoint 17 Set 2026

Curso interactivo de uso avançado de IAs, do básico ao projecto final.
Aula por chat, um professor por módulo, currículo em 9 módulos.

## O que está gravado e a funcionar

- Percurso completo: 9 módulos, aulas, notas, prática e quizzes
- Sala de aula com chat, professor, notas e prática lado a lado
- 9 professores (Iris, Lena, Tomás, Noor, Kai, Vera, Sol, Mira, Atlas)
- GLM-5.3 (NVIDIA, `z-ai/glm-5.3`) como voz dos professores
- Contrato oficial: `stream: false`, `max_tokens: 1024`, `top_p: 1`
- Fallback local se a NVIDIA não responder a tempo
- Progresso do aluno em `localStorage` (sem conta)
- Laboratórios: prompt, Python no browser, quiz, reflexão

## Módulos

| # | Módulo | Professor |
|---|---|---|
| 1 | Entender a IA | Lena |
| 2 | Conversar com intenção | Tomás |
| 3 | Construir bons prompts | Noor |
| 4 | Trabalhar com informação | Kai |
| 5 | Criar processos repetíveis | Vera |
| 6 | Coordenar agentes | Sol |
| 7 | Usar com responsabilidade | Mira |
| 8 | Medir produtividade | Atlas |
| 9 | Projecto final | Iris |

## Ficheiros-chave

- `src/data/course.ts` — estrutura do curso
- `src/data/lessons-m1-m4.ts` / `lessons-m5-m9.ts` — conteúdo das aulas
- `src/data/faculty.ts` — professores e system prompts
- `src/components/aula-chat.tsx` — chat da aula
- `src/lib/nvidia.server.ts` — cliente GLM-5.3
- `src/lib/ai-tutor.ts` — orquestração tutor + fallback
- `src/routes/aula.$lessonId.tsx` — página da aula
- `src/lib/progress.ts` — progresso

## Segredo NVIDIA

A chave **não** vai neste repositório. Fica só no `.env` local (ignorado pelo git).
Copia `.env.example` → `.env` e cola a chave.
