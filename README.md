# ModelOps SDK

**ModelOps** is a unified TypeScript SDK for OpenAI, Anthropic, and Gemini with built-in AI observability and future optimization insights.

With a single SDK you can:

- 🚀 Use multiple LLM providers through a unified API
- 📊 Track token usage automatically
- 💰 Estimate request cost
- ⏱️ Measure request latency
- 📈 View AI usage in the ModelOps dashboard
- 🧠 Collect the data needed to optimize your AI applications

Note: Cost is estimated using the provider's public pricing and may differ from your invoice if you use enterprise pricing, discounts, cached tokens, or other provider-specific billing models.

---

## Installation

```bash
npm install modelops
```

---

## Environment Variables

ModelOps automatically discovers your provider API keys from the environment.

```bash
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key
```

If a provider key is missing, ModelOps will throw an error only when that provider is used.

Another option is adding the keys to the config when creating the ModelOps instance.

---

## Create a ModelOps client

```ts
import { ModelOps } from "modelops";

const modelOps = new ModelOps({
  apiKey: 'your-model-ops-key',
  modelKeys?: {
    openai?: 'string',
    anthropic?: 'string',
    gemini?: 'string'
  }
});
```

---

## Send your first request

```ts
import { ModelOpsChatRequest } from 'modelops';

const request: ModelOpsChatRequest = {
	provider: 'openai',
	model: 'gpt-4.1-mini',

	messages: [
		{
			role: 'user',
			content: 'Tell me a joke',
		},
	],
};

const response = await modelOps.chat(request);

console.log(response.content);
```

---

## Add business context (recommended)

Adding business context allows ModelOps to generate dashboards that matter to your application—not just token statistics.

```ts
const response = await modelOps.chat({
	provider: 'openai',
	model: 'gpt-4.1-mini',

	messages,

	context: {
		useCase: 'trip-planning',
		feature: 'generate-itinerary',
		customerId: customer.id,
		sessionId: session.id,
	},
});
```

Examples of dashboards you will get:

Examples of insights you'll get:

- Cost per feature
- Cost per customer
- Cost per use case
- Cost per workflow
- Latency trends
- Token usage over time

---

## Why not call the provider SDK directly?

| Without ModelOps          | With ModelOps                      |
| ------------------------- | ---------------------------------- |
| One SDK per provider      | One unified SDK                    |
| No built-in observability | Built-in observability             |
| No cost estimation        | Estimated request cost             |
| No business context       | Business-aware dashboards          |
| Build your own telemetry  | Ready out of the box               |
| No optimization insights  | Foundation for future optimization |

---

## Supported providers

| Provider  | Status |
| --------- | ------ |
| OpenAI    | ✅     |
| Anthropic | ✅     |
| Gemini    | ✅     |

More providers are coming soon.

---

## Privacy

By default, ModelOps only sends telemetry required for observability.

Collected data includes:

- Provider
- Model
- Token usage
- Estimated cost
- Latency
- Request context (optional)

Prompt and response contents are **never collected unless** `captureContent: true` is enabled.

```ts
const modelOps = new ModelOps({
	apiKey: process.env.MODELOPS_API_KEY!,
	captureContent: true,
});
```

---

## Estimated Cost

ModelOps estimates request cost using each provider's public pricing.

Estimated cost may differ from your invoice if you use:

- Enterprise pricing
- Custom discounts
- Cached token pricing
- Batch APIs
- Provider-specific billing models

---

## What's tracked automatically?

Every request automatically records:

- Provider
- Model
- Input tokens
- Output tokens
- Total tokens
- Estimated request cost
- Request latency
- Success / failure
- Optional business context

---

## Dashboard

ModelOps provides dashboards such as:

```text
Today's AI Usage

Requests           12,438
Estimated Cost     $18.42
Latency (P95)      1.4s

Top Features
------------------------------------
Trip Planning      $7.12
Recommendations    $5.90
Summaries          $2.33

Top Models
------------------------------------
GPT-4.1 Mini       78%
Claude Sonnet      15%
Gemini Flash        7%
```

Additional dashboards include:

- Cost per feature
- Cost per customer
- Cost per model
- Cost per provider
- Token usage trends
- Latency trends
- Error rates
- Request volume

---

## Roadmap

### ✅ Available Today

- Unified SDK
- OpenAI support
- Anthropic support
- Gemini support
- Token tracking
- Estimated cost
- Latency tracking
- Business context
- AI usage dashboard

### 🚧 Coming Soon

- Prompt optimization recommendations
- Model recommendations
- Prompt caching suggestions
- RAG optimization
- Cost anomaly detection
- Automatic model routing

---

## Why ModelOps?

Instead of integrating every AI provider separately and building your own telemetry pipeline, ModelOps gives you a single SDK with built-in observability from day one.

Focus on building AI applications.

**Understand your AI today. Optimize it tomorrow.**
