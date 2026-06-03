# Implementation Plan

## Phase 1: Core Scaffold

- Create monorepo.
- Create API app.
- Create MCP app.
- Create shared packages.
- Create SDD docs.

## Phase 2: Backend API

- Add authentication.
- Add OpenAPI.
- Add chat endpoint.
- Add MCP search endpoint.
- Add document endpoints.

## Phase 3: Markdown RAG

- Load Markdown.
- Parse frontmatter.
- Chunk content.
- Generate embeddings.
- Store chunks in pgvector.
- Retrieve context.

## Phase 4: MCP

- Add initial tools.
- Integrate with API.
- Return structured sources.
- Test with IDE/agent clients.

## Phase 5: Confluence

- Fetch pages.
- Normalize HTML.
- Track versions.
- Reindex changed pages.

## Phase 6: Security and LLMOps

- Add authorization.
- Add logging and metrics.
- Mask sensitive data.
- Add fallback providers.
- Add answer evaluation.
