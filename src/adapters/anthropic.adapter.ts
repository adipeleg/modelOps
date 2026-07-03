// adapters/anthropic.adapter.ts
import Anthropic from "@anthropic-ai/sdk";
import { ModelOpsChatRequest, NormalizedLLMResponse } from "../modelOps.types";
import { BaseAdapter } from "./baseAdapter";
import { registerAdapter } from "./registry";

export class AnthropicAdapter extends BaseAdapter {
  private client?: Anthropic;
  constructor(apiKey: string, client?: Anthropic) {

    if (!apiKey) {
      return;
    }

    const resolvedClient = client ?? new Anthropic({ apiKey });
    super();
    this.client = resolvedClient;
  }

  async chat(request: ModelOpsChatRequest): Promise<NormalizedLLMResponse> {

    const system = request.messages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n");

    const messages = request.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const response = await this.client?.messages.create({
      model: request.model,
      max_tokens: request.maxTokens ?? 1024,
      temperature: request.temperature,
      system: system || undefined,
      messages,
    });

    const content =
      response?.content[0]?.type === "text" ? response.content[0].text : "";

    return {
      raw: response,
      content,
      usage: {
        inputTokens: response?.usage.input_tokens,
        outputTokens: response?.usage.output_tokens,
        totalTokens: (response?.usage.input_tokens ?? 0) + (response?.usage.output_tokens ?? 0),
      },
      model: response?.model ?? request.model,
      provider: "anthropic",
    };
  }
};

registerAdapter("anthropic", AnthropicAdapter);
