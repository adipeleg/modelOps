import OpenAI from "openai";
import { ModelOpsChatRequest, NormalizedLLMResponse } from "../modelOps.types";
import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";

export abstract class BaseAdapter {
  abstract chat(request: ModelOpsChatRequest): Promise<NormalizedLLMResponse>;
}
