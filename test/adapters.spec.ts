/// <reference types="jest" />
import { describe, expect, it, jest } from "@jest/globals";
import { AnthropicAdapter } from "../src/adapters/anthropic.adapter";
import { GeminiAdapter } from "../src/adapters/gemini.adapter";

describe("adapter contract behavior", () => {
  it("throws for Anthropic json_object requests instead of silently ignoring them", async () => {
    const create = jest.fn();
    const adapter = new AnthropicAdapter("", {
      messages: { create },
    } as any);

    await expect(
      adapter.chat({
        provider: "anthropic",
        model: "claude-sonnet-4-20250514",
        responseFormat: "json_object",
        messages: [{ role: "user", content: "Return valid JSON." }],
      })
    ).rejects.toThrow("responseFormat=json_object");

    expect(create).not.toHaveBeenCalled();
  });

  it("passes all Gemini system messages as one system instruction", async () => {
    const generateContent = jest.fn<() => Promise<any>>();
    generateContent.mockResolvedValue({
      text: "ok",
      usageMetadata: {
        promptTokenCount: 10,
        candidatesTokenCount: 5,
        totalTokenCount: 15,
      },
    });
    const adapter = new GeminiAdapter("", {
      models: { generateContent },
    } as any);

    const result = await adapter.chat({
      provider: "gemini",
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "Rule one" },
        { role: "system", content: "Rule two" },
        { role: "user", content: "Say hi" },
      ],
    });

    expect(generateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          systemInstruction: "Rule one\nRule two",
        }),
        contents: [{ role: "user", parts: [{ text: "Say hi" }] }],
      })
    );
    expect(result.content).toBe("ok");
  });

  it("rejects Gemini conversations that start with an assistant message", async () => {
    const generateContent = jest.fn();
    const adapter = new GeminiAdapter("", {
      models: { generateContent },
    } as any);

    await expect(
      adapter.chat({
        provider: "gemini",
        model: "gemini-2.5-flash",
        messages: [{ role: "assistant", content: "Previous answer" }],
      })
    ).rejects.toThrow("start with an assistant message");

    expect(generateContent).not.toHaveBeenCalled();
  });
});