# Technical Decisions

## Repository Split

Two repositories will be used:

```txt
knowledge-ai-core
knowledge-ai-web
```

`knowledge-ai-core` contains backend, MCP, RAG and infrastructure.

`knowledge-ai-web` contains the Next.js frontend.

## Contract Strategy

The API will expose OpenAPI/Swagger. The frontend should generate its client/types from OpenAPI instead of copying DTOs manually.

## Vector Store

MVP uses PostgreSQL + pgvector.

Other stores such as Qdrant, Pinecone or Weaviate can be added behind the `vector-store` abstraction later.

## MCP Strategy

The MCP server calls the Knowledge API. This keeps retrieval, authorization and source filtering centralized in the API.

## Auth Strategy

The API owns authorization decisions. The frontend can hide UI actions, but cannot be trusted as the source of permission truth.
