// adapters/openai.adapter.ts
import OpenAI from "openai";
import { ModelOpsChatRequest, NormalizedLLMResponse } from "../modelOps.types";
import { BaseAdapter } from "./baseAdapter";
import { registerAdapter } from "./registry";

export class OpenAIAdapter extends BaseAdapter {
  private client?: OpenAI;

  constructor(apiKey: string, client?: OpenAI) {
    super();
    if (!apiKey && !client) {
      return;
    }

    this.client = client ?? new OpenAI({ apiKey });
  }

  async chat(request: ModelOpsChatRequest): Promise<NormalizedLLMResponse> {
    const response = await this.client?.chat.completions.create({
      model: request?.model,
      messages: request?.messages as any,
      temperature: request?.temperature,
      max_tokens: request?.maxTokens,
      response_format:
        request?.responseFormat === "json_object"
          ? { type: "json_object" }
          : undefined,
    });

    const inputTokens = response?.usage?.prompt_tokens ?? 0;
    const outputTokens = response?.usage?.completion_tokens ?? 0;
    const totalTokens = response?.usage?.total_tokens ?? (inputTokens + outputTokens);

    return {
      raw: response,
      content: response?.choices?.[0]?.message?.content ?? "",
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
      },
      model: response?.model ?? request?.model,
      provider: "openai",
    };
  }
}

registerAdapter("openai", OpenAIAdapter);