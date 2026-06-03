# Components

## apps/knowledge-api

NestJS API responsible for:

- `/health`
- `/chat`
- `/mcp/search`
- ingestion endpoints
- document endpoints
- feedback endpoints
- authentication and authorization
- OpenAPI generation

## apps/dev-knowledge-mcp

MCP server responsible for exposing tools to agents and IDEs.

The MCP server should not duplicate RAG logic. It should call the Knowledge API and return structured context with sources.

## packages/rag-core

Orchestrates:

- question classification
- retrieval
- prompt assembly
- LLM calls
- answer validation
- fallback behavior

## packages/shared-types

Shared contracts for API, MCP and internal packages.

## packages/vector-store

Vector store abstraction. MVP target is PostgreSQL + pgvector.

## packages/llm-providers

Provider abstraction for OpenAI, Claude, Azure OpenAI and Ollama.

## packages/confluence-client

Confluence REST API client.

## packages/markdown-loader

Markdown reader, parser, frontmatter extractor and normalizer.

## packages/prompt-templates

Versioned prompt templates by audience and domain.

## packages/observability

Logging, masking, metrics and tracing helpers.
