// adapters/registry.ts
import { BaseAdapter } from "./baseAdapter";

type AdapterConstructor = new (apiKey: string) => BaseAdapter;

const registry = new Map<string, AdapterConstructor>();

export function registerAdapter(provider: string, ctor: AdapterConstructor) {
  registry.set(provider, ctor);
}

export function getAdapter(provider: string, apiKey: string): BaseAdapter | undefined {
  const Adapter = registry.get(provider);
  if (!Adapter) {
    return undefined;
  }
  return new Adapter(apiKey);
}