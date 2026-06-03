# MCP Integration

The MCP server uses stdio transport and calls the Knowledge API.

```txt
IDE/Agent
  -> MCP tool
  -> dev-knowledge-mcp
  -> Knowledge API /mcp/search
  -> structured context
```

## Environment

```env
KNOWLEDGE_API_BASE_URL=http://localhost:3000
```

## Why MCP Calls API

Centralizing retrieval in the API keeps:

- authorization
- document filtering
- source ranking
- logging
- LLMOps
- sensitive data masking

in one backend path.
