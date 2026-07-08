# ModelOps SDK

![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-SDK-3178C6.svg)
![Providers](https://img.shields.io/badge/Providers-OpenAI%20%7C%20Anthropic%20%7C%20Gemini-2ea44f.svg)

ModelOps is a TypeScript SDK that unifies OpenAI, Anthropic, and Gemini behind a single API, with built-in observability for tokens, latency, and estimated cost.

## Why ModelOps

- One integration for multiple LLM providers
- Standardized request and response handling
- Automatic usage telemetry
- Cost and latency visibility without custom pipelines
- Business-aware analytics through request context

Note: Cost is estimated from public provider pricing and may differ from your invoice if you use enterprise pricing, discounts, cached tokens, batch APIs, or other provider-specific billing rules.

## Installation

```bash
npm install model-ops
```

## Environment Variables

Before using the SDK:

1. Create a ModelOps account at https://modelops.me
2. Copy your ModelOps API key from Account Settings
3. Set at least one provider API key

Provider keys can be loaded from environment variables:

```bash
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key
```

ModelOps also requires your platform API key:

```bash
MODELOPS_API_KEY=your_modelops_api_key
```

You can provide provider keys through environment variables or directly in `modelKeys`.

## Quick Start

```ts
import { ModelOps, ModelOpsChatRequest } from "model-ops";

const modelOps = new ModelOps({
	apiKey: process.env.MODELOPS_API_KEY!,
	modelKeys: {
		openai: process.env.OPENAI_API_KEY,
		anthropic: process.env.ANTHROPIC_API_KEY,
		gemini: process.env.GEMINI_API_KEY,
	},
	captureContent: false,
});

const request: ModelOpsChatRequest = {
	provider: "openai",
	model: "gpt-4.1-mini",
	messages: [
		{
			role: "user",
			content: "Tell me a joke",
		},
	],
};

const response = await modelOps.chat(request);
console.log(response.content);
```

## Add Business Context (Recommended)

Business context helps you analyze usage by product surface, customer, and workflow instead of only tokens and requests.

```ts
const response = await modelOps.chat({
	provider: "openai",
	model: "gpt-4.1-mini",
	messages: [
		{ role: "user", content: "Plan a 3-day trip to Tokyo." },
	],
	context: {
		useCase: "trip-planning",
		feature: "generate-itinerary",
		customerId: "cust_123",
		sessionId: "sess_456",
		workflowId: "wf_789",
		environment: "production",
	},
});
```

## What Is Tracked Automatically

Each request records:

- Provider
- Model
- Input tokens
- Output tokens
- Total tokens
- Estimated request cost
- Request latency
- Success or failure
- Optional business context

## Privacy

By default, ModelOps sends only telemetry needed for observability.

Collected data includes:

- Provider
- Model
- Token usage
- Estimated cost
- Latency
- Request context (optional)

Prompt and response content is not collected unless content capture is enabled.

```ts
const modelOps = new ModelOps({
	apiKey: process.env.MODELOPS_API_KEY!,
	captureContent: true,
});
```

## Supported Providers

- OpenAI
- Anthropic
- Gemini

More providers are planned.

## Dashboard Insights

ModelOps dashboard insights include:

- Cost per feature
- Cost per customer
- Cost per provider
- Cost per model
- Token usage trends
- Latency trends
- Error rates
- Request volume

## Roadmap

Available now:

- Unified SDK
- OpenAI, Anthropic, and Gemini support
- Token tracking
- Estimated cost
- Latency tracking
- Business context
- AI usage dashboard

Coming soon:

- Prompt optimization recommendations
- Model recommendations
- Prompt caching suggestions
- RAG optimization
- Cost anomaly detection
- Automatic model routing

## Links

- Product dashboard: https://modelops.me

## License

ISC
