// adapters/gemini.adapter.ts
import { GoogleGenAI } from "@google/genai";
import { ModelOpsChatRequest, NormalizedLLMResponse } from "../modelOps.types";
import { BaseAdapter } from "./baseAdapter";
import { registerAdapter } from "./registry";


export class GeminiAdapter extends BaseAdapter {
  protected client?: GoogleGenAI;

  constructor(apiKey: string, client?: GoogleGenAI) {
    if (!apiKey) {
      return;
    }
    const resolvedClient = client ?? new GoogleGenAI({ apiKey });
    super();
    this.client = resolvedClient;
  }

  async chat(request: ModelOpsChatRequest): Promise<NormalizedLLMResponse> {

    const system = request.messages.find((m) => m.role === "system")?.content;

    const contents = request.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const response = await this.client?.models.generateContent({
      model: request.model,
      contents,
      config: {
        temperature: request.temperature,
        maxOutputTokens: request.maxTokens,
        systemInstruction: system,
        responseMimeType:
          request.responseFormat === "json_object"
            ? "application/json"
            : undefined,
      },
    });

    return {
      raw: response,
      content: response?.text ?? "",
      usage: {
        inputTokens: response?.usageMetadata?.promptTokenCount,
        outputTokens: response?.usageMetadata?.candidatesTokenCount,
        totalTokens: response?.usageMetadata?.totalTokenCount,
      },
      model: request.model,
      provider: "gemini",
    };
  }
}

registerAdapter("gemini", GeminiAdapter);
