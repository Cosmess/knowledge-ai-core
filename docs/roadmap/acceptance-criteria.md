# Acceptance Criteria

The project is functional when:

- API can ingest Markdown.
- API can ingest Confluence pages.
- Documents are split into chunks.
- Embeddings are stored in pgvector.
- `/chat` answers using retrieved context.
- Answers cite sources.
- MCP can search technical context.
- MCP responses include sources and evidence status.
- API refuses to answer when evidence is insufficient.
- Frontend can consume OpenAPI contracts.
- Project runs through Docker Compose.
- Sensitive data is not exposed in logs or answers.
