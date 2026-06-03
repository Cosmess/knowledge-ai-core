export interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LlmResponse {
  text: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
}

export interface LlmProvider {
  generate(prompt: string, options?: GenerateOptions): Promise<LlmResponse>;
  stream?(prompt: string, options?: GenerateOptions): AsyncIterable<LlmResponse>;
}
