// adapters/gemini.adapter.ts
import { GoogleGenAI } from "@google/genai";
import { ModelOpsChatRequest, NormalizedLLMResponse } from "../modelOps.types";
import { BaseAdapter } from "./baseAdapter";
import { getConversationMessages, getSystemInstruction } from "./messageUtils";
import { registerAdapter } from "./registry";

export class GeminiAdapter extends BaseAdapter {
  protected client?: GoogleGenAI;

  constructor(apiKey: string, client?: GoogleGenAI) {
    super();

    if (!apiKey && !client) {
      return;
    }

    this.client = client ?? new GoogleGenAI({ apiKey });
  }

  async chat(request: ModelOpsChatRequest): Promise<NormalizedLLMResponse> {
    const system = getSystemInstruction(request.messages);
    const conversationMessages = getConversationMessages(request.messages);

    const contents = conversationMessages
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const response = await this.client?.models.generateContent({
      model: request?.model,
      contents,
      config: {
        temperature: request?.temperature,
        maxOutputTokens: request?.maxTokens,
        systemInstruction: system,
        responseMimeType:
          request?.responseFormat === "json_object"
            ? "application/json"
            : undefined,
      },
    });

    const content = response?.text ?? response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return {
      raw: response,
      content,
      usage: {
        inputTokens: response?.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: response?.usageMetadata?.candidatesTokenCount ?? 0,
        totalTokens: response?.usageMetadata?.totalTokenCount ?? 0,
      },
      model: request?.model,
      provider: "gemini",
    };
  }
}

registerAdapter("gemini", GeminiAdapter);