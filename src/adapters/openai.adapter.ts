// adapters/openai.adapter.ts
import OpenAI from "openai";
import { ModelOpsChatRequest, NormalizedLLMResponse } from "../modelOps.types";
import { BaseAdapter } from "./baseAdapter";
import { registerAdapter } from "./registry";

export class OpenAIAdapter extends BaseAdapter {
  private client?: OpenAI;

  constructor(apiKey: string, client?: OpenAI) {
    if (!apiKey) {
      return;
    }

    const resolvedClient = client ?? new OpenAI({ apiKey });
    super();
    this.client = resolvedClient;
  }

  async chat(request: ModelOpsChatRequest): Promise<NormalizedLLMResponse> {
    const response = await this.client?.chat.completions.create({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature,
      max_tokens: request.maxTokens,
      response_format:
        request.responseFormat === "json_object"
          ? { type: "json_object" }
          : undefined,
    });

    return {
      raw: response,
      content: response?.choices[0]?.message?.content ?? "",
      usage: {
        inputTokens: response?.usage?.prompt_tokens,
        outputTokens: response?.usage?.completion_tokens,
        totalTokens: response?.usage?.total_tokens,
      },
      model: response?.model ?? request.model,
      provider: "openai",
    };
  }
};

registerAdapter("openai", OpenAIAdapter);
