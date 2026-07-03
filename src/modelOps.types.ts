export interface ModelOpsConfig {
  apiKey: string; // ModelOps API key
  defaultProvider?: 'openai' | 'anthropic' | 'gemini';
  debug?: boolean;
  captureContent?: boolean;
  modelKeys?: {
    openai?: string;
    anthropic?: string;
    gemini?: string;
  }

}

export type Provider = "openai" | "anthropic" | "gemini";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ModelOpsChatRequest = {
  provider: Provider;
  model: string;
  messages: ChatMessage[];
  // apiKey: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "json_object" | "text";
  context?: ModelOpsContext;
};

export interface ModelOpsContext {
  useCase?: string;
  feature?: string;
  project?: string;
  environment?: "local" | "dev" | "staging" | "production";
  userId?: string;
  customerId?: string;
  sessionId?: string;
  workflowId?: string;
  agent?: string;
  tags?: string[];
  custom?: Record<string, string | number | boolean>;
  traceId?: string;
}

export type NormalizedLLMResponse = {
  raw: unknown;
  content: string;
  usage: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  model: string;
  provider: Provider;
};
export interface ModelOpsUsageEvent {
  provider: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  latencyMs?: number;
  costUsd?: number;
  success: boolean;
  errorType?: string;
  context?: ModelOpsContext;
  reqMessages?: ChatMessage[];
  resContent?: string;
  errorStack?: string;
}