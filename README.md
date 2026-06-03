# Knowledge AI Core

Backend, MCP server, RAG core and infrastructure for the Knowledge AI Platform.

Repository:

```txt
https://github.com/Cosmess/knowledge-ai-core
```

## Scope

This repository contains:

- `apps/knowledge-api`: NestJS API for chat, ingestion, documents, feedback and OpenAPI.
- `apps/dev-knowledge-mcp`: MCP server for IDEs and AI agents.
- `packages/rag-core`: RAG orchestration.
- `packages/shared-types`: shared contracts and DTOs.
- `packages/*`: adapters for Confluence, Markdown, vector store, LLM providers, prompts and observability.
- `docs/`: SDD, architecture and implementation documentation.

The frontend lives in a separate repository:

```txt
https://github.com/Cosmess/knowledge-ai-web
```

## First Run

```bash
pnpm install
docker compose up -d
pnpm build
pnpm dev:api
```

In another terminal:

```bash
pnpm dev:mcp
```

## Current Status

Initial scaffold with:

- API health endpoint.
- Chat endpoint.
- MCP search endpoint.
- MCP tools that call the API.
- SDD documentation structure.

RAG persistence, embeddings, pgvector integration, Confluence ingestion and authentication are planned next.
