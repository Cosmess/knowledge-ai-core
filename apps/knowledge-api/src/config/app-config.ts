export interface AppConfig {
  port: number;
  databaseUrl: string;
  redisUrl?: string;
  jwtSecret: string;
  jwtExpiresInSeconds: number;
  mcpApiToken?: string;
  openAiApiKey?: string;
  openAiEmbeddingModel: string;
  openAiChatModel: string;
  embeddingDimensions: number;
  markdownDocsRoot: string;
  confluenceBaseUrl?: string;
  confluenceEmail?: string;
  confluenceApiToken?: string;
  confluenceDefaultSpace?: string;
}

export function getAppConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: process.env.DATABASE_URL ?? "postgresql://knowledge:knowledge@localhost:5432/knowledge_ai",
    redisUrl: process.env.REDIS_URL,
    jwtSecret: process.env.API_AUTH_JWT_SECRET ?? "change-me",
    jwtExpiresInSeconds: Number(process.env.API_AUTH_JWT_EXPIRES_IN_SECONDS ?? 3600),
    mcpApiToken: process.env.MCP_API_TOKEN,
    openAiApiKey: process.env.OPENAI_API_KEY,
    openAiEmbeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
    openAiChatModel: process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini",
    embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS ?? 384),
    markdownDocsRoot: process.env.MARKDOWN_DOCS_ROOT ?? "docs",
    confluenceBaseUrl: process.env.CONFLUENCE_BASE_URL,
    confluenceEmail: process.env.CONFLUENCE_EMAIL,
    confluenceApiToken: process.env.CONFLUENCE_API_TOKEN,
    confluenceDefaultSpace: process.env.CONFLUENCE_DEFAULT_SPACE
  };
}
