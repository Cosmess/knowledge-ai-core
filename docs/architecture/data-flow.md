# Data Flow

## Ingestion Flow

```txt
Source document
  -> normalize
  -> extract metadata
  -> split into chunks
  -> generate embeddings
  -> save document
  -> save chunks
  -> index vectors
```

## Chat Flow

```txt
Authenticated user
  -> POST /chat
  -> validate authorization
  -> classify question
  -> retrieve chunks
  -> build prompt
  -> call LLM
  -> validate answer
  -> return answer + sources
```

## MCP Flow

```txt
Agent/IDE
  -> MCP tool call
  -> dev-knowledge-mcp
  -> POST /mcp/search
  -> retrieve structured context
  -> return sources and excerpts to agent
```
