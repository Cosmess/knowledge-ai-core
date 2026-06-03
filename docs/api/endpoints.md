# API Endpoints

## Implemented in Scaffold

```http
GET /health
POST /chat
POST /mcp/search
```

## Planned

```http
POST /auth/login
GET /auth/me
POST /ingest/markdown
POST /ingest/confluence
POST /reindex
GET /documents
GET /documents/:id
GET /spaces
POST /feedback
```

## POST /chat

Request:

```json
{
  "question": "Como funciona o fluxo de liquidacao?",
  "audience": "operations",
  "spaceKey": "OPS",
  "system": "settlement-service"
}
```

Response:

```json
{
  "answer": "Resposta baseada em fontes recuperadas.",
  "domain": "business_rule",
  "sources": [],
  "confidence": "low"
}
```

## POST /mcp/search

Request:

```json
{
  "query": "Qual endpoint consulta contratos?",
  "domain": "api_documentation",
  "audience": "developers",
  "spaceKey": "ENG",
  "limit": 5
}
```

Response:

```json
{
  "query": "Qual endpoint consulta contratos?",
  "domain": "api_documentation",
  "results": [],
  "evidenceStatus": "insufficient"
}
```
