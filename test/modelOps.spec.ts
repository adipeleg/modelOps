/// <reference types="jest" />
import { ModelOpsChatRequest } from './../src/modelOps.types';
import { ModelOps } from './../src/modelOps';
import { beforeAll, describe, expect, it } from '@jest/globals';

// describe('ModelOps', () => {
//   it('should track usage events', async () => {
//     const modelOps = new ModelOps({ apiKey: 'test-api-key', captureContent: true });
//     const request: ModelOpsChatRequest = {
//       provider: 'openai',
//       model: 'gpt-4',
//       messages: [{ role: 'user', content: 'Hello' }],
//     };

//     await modelOps.chat(request);
//   });
// });

// real integration test — no mocks
describe.skip('ModelOps Integration', () => {
  let sdk: ModelOps;

  beforeAll(() => {
    sdk = new ModelOps({
      apiKey: process.env.MODEL_OPS_API_KEY || 'your-modelops-api-key',
      captureContent: true,
    });
  });

  it('should call OpenAI and track the event to the server', async () => {
    const result = await sdk.chat({
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'Say hello in one word.' },
      ],
      context: {
        feature: 'integration-test',
        userId: 'test-user-123',
      },
    });

    console.log('Response:', result?.content);
    console.log('Tokens:', result?.usage);

    expect(result?.content).toBeTruthy();
    expect(result?.usage?.inputTokens).toBeGreaterThan(0);
    expect(result?.usage?.outputTokens).toBeGreaterThan(0);
  }, 30_00000); // 30s timeout for real API calls
});
