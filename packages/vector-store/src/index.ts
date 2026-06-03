import { KnowledgeSource } from "@knowledge-ai/shared-types";

export interface VectorSearchInput {
  query: string;
  limit: number;
  filters?: Record<string, unknown>;
}

export interface VectorStore {
  similaritySearch(input: VectorSearchInput): Promise<KnowledgeSource[]>;
}
