# MCP Tools

Initial tools:

```txt
search_technical_docs
search_business_rules
search_api_docs
search_architecture_docs
search_user_stories
get_service_context
```

## Input Schema

```json
{
  "query": "string",
  "system": "string",
  "spaceKey": "string",
  "limit": 5
}
```

Only `query` is required.

## Output

The MCP server returns structured JSON as text content:

```json
{
  "query": "string",
  "domain": "technical",
  "results": [],
  "evidenceStatus": "insufficient"
}
```

## Rule

MCP tools must return sources and evidence. If there is not enough evidence, they must say so.
