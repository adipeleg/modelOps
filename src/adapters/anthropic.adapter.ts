// adapters/anthropic.adapter.ts
import Anthropic from "@anthropic-ai/sdk";
import { ModelOpsChatRequest, NormalizedLLMResponse } from "../modelOps.types";
import { BaseAdapter } from "./baseAdapter";
import { getConversationMessages, getSystemInstruction } from "./messageUtils";
import { registerAdapter } from "./registry";

export class AnthropicAdapter extends BaseAdapter {
  private client?: Anthropic;

  constructor(apiKey: string, client?: Anthropic) {
    super();

    if (!apiKey && !client) {
      return;
    }

    this.client = client ?? new Anthropic({ apiKey });
  }

  async chat(request: ModelOpsChatRequest): Promise<NormalizedLLMResponse> {
    const system = getSystemInstruction(request.messages);
    const messages = getConversationMessages(request.messages)
      .map((m) => ({
        role: m?.role as "user" | "assistant",
        content: m?.content,
      }));

    const response = await this.client?.messages?.create({
      model: request?.model,
      max_tokens: request?.maxTokens ?? 1024,
      temperature: request?.temperature,
      system,
      messages,
    });

    const content = response?.content
      .map((block) => (block.type === "text" ? (block as { text: string }).text : ""))
      .join("");

    const inputTokens = response?.usage?.input_tokens ?? 0;
    const outputTokens = response?.usage?.output_tokens ?? 0;

    return {
      raw: response,
      content: content ?? "",
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
      },
      model: response?.model ?? request?.model,
      provider: "anthropic",
    };
  }
}

registerAdapter("anthropic", AnthropicAdapter);