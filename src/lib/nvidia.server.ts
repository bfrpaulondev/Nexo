const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
export const NVIDIA_MODEL = "z-ai/glm-5.3";

export function nvidiaApiKey() {
  return process.env.NVIDIA_API_KEY?.trim() || "";
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function nvidiaChat(
  messages: ChatMessage[],
  opts: { temperature: number; maxTokens?: number },
): Promise<string | null> {
  const apiKey = nvidiaApiKey();
  if (!apiKey) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 55000);

  try {
    const res = await fetch(NVIDIA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages,
        temperature: opts.temperature,
        top_p: 1,
        max_tokens: opts.maxTokens ?? 1024,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const completion = (await res.json()) as {
      choices?: {
        message?: { content?: string | null; reasoning_content?: string | null };
      }[];
    };
    const message = completion.choices?.[0]?.message;
    const text = (message?.content ?? "").trim();
    if (text) return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
