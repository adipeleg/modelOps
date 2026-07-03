import axios from "axios";
import { ModelOpsChatRequest, ModelOpsConfig, ModelOpsUsageEvent } from "./modelOps.types";
import { BaseAdapter } from "./adapters/baseAdapter";
import { getAdapter } from "./adapters/registry";
import "./adapters/openai.adapter";
import "./adapters/anthropic.adapter";
import "./adapters/gemini.adapter";
const dotenv = require("dotenv");
dotenv.config();

export class ModelOps {
  private adapterInstances = new Map<string, BaseAdapter>();

  constructor(private config: ModelOpsConfig) {
    this.config.modelKeys = {
      openai: this.config?.modelKeys?.openai || process.env.OPENAI_API_KEY,
      anthropic: this.config?.modelKeys?.anthropic || process.env.ANTHROPIC_API_KEY,
      gemini: this.config?.modelKeys?.gemini || process.env.GEMINI_API_KEY,
    };
    if (!this.config.apiKey) {

      console.warn("API key is not provided.");
      return;
    }

    if (!this.config.modelKeys.openai && !this.config.modelKeys.anthropic && !this.config.modelKeys.gemini) {
      console.warn("At least one provider API key must be provided.");
      return;
    }
  }


  private getOrCreateAdapter(provider: 'openai' | 'anthropic' | 'gemini'): BaseAdapter | undefined {
    if (!this.adapterInstances.has(provider)) {
      const apiKey = this.config.modelKeys?.[provider];
      if (!apiKey) {
        console.warn(`No API key for provider: ${provider}`);
        return;
      }

      const adapter = getAdapter(provider, apiKey);
      if (!adapter) {
        console.warn(`Failed to create adapter for provider: ${provider}`);
        return;
      }

      this.adapterInstances.set(provider, adapter);
    }

    return this.adapterInstances.get(provider)!;
  }


  async chat(request: ModelOpsChatRequest) {
    const start = Date.now();

    try {
      const result = await this.callProvider(request);

      await this.track({
        provider: request.provider,
        model: request.model,
        reqMessages: this.config.captureContent ? request.messages : undefined,
        resContent: this.config.captureContent ? result?.content : undefined,
        inputTokens: result?.usage?.inputTokens,
        outputTokens: result?.usage?.outputTokens,
        totalTokens: result?.usage?.totalTokens,
        latencyMs: Date.now() - start,
        success: true,
        context: request.context,
      });

      return result;
    } catch (error: any) {
      await this.track({
        provider: request.provider,
        model: request.model,
        reqMessages: this.config.captureContent ? request.messages : undefined,
        latencyMs: Date.now() - start,
        success: false,
        errorType: error?.name,
        errorStack: error?.stack,
        context: request.context,
      });

      throw error;
    }
  }

  private async callProvider(request: ModelOpsChatRequest) {
    return this.getOrCreateAdapter(request.provider)?.chat(request);

  }

  private async track(event: ModelOpsUsageEvent) {
    try {
      await axios.post(
        process.env.MODEL_OPS_ENV === 'development' ? 'http://localhost:8000/api/events' : 'https://api.modelops.ai/events',
        event,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
        }
      );
    } catch {
    }
  }
}