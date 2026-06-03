# Architecture Overview

`knowledge-ai-core` is the backend repository for the Knowledge AI Platform.

It contains:

- NestJS API.
- MCP Server for IDEs and AI agents.
- RAG orchestration.
- Markdown and Confluence ingestion.
- Vector search with PostgreSQL + pgvector.
- Redis cache.
- LLM provider abstraction.
- Security, observability and LLMOps.

The frontend is intentionally separated into `knowledge-ai-web` and consumes this API through authenticated HTTP calls.

## High-Level Flow

```txt
Confluence / Markdown / OpenAPI
        |
        v
Ingestion
        |
        v
Chunking + Metadata
        |
        v
Embeddings
        |
        v
PostgreSQL + pgvector
        |
        v
Retrieval
        |
        v
RAG Orchestrator
        |
        +--> Knowledge API
        |
        +--> MCP Server
```
