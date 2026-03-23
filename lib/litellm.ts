import OpenAI from "openai";

/**
 * LiteLLM client — uses the OpenAI SDK pointed at the LiteLLM proxy.
 */
export function getLiteLLMClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.LITELLM_API_KEY || "",
    baseURL: process.env.LITELLM_API_BASE || "http://localhost:4000",
  });
}

export function getModel(): string {
  return process.env.HARBOR_MODEL || "bedrock/claude-opus-4-6-v1";
}
