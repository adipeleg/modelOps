import { ChatMessage } from "../modelOps.types";

export function getSystemInstruction(messages: ChatMessage[]): string | undefined {
  const systemInstruction = messages
    ?.filter((message) => message.role === "system")
    ?.map((message) => message.content?.trim())
    ?.filter(Boolean)
    ?.join("\n");

  return systemInstruction || undefined;
}

export function getConversationMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages?.filter((message) => message.role !== "system") ?? [];
}