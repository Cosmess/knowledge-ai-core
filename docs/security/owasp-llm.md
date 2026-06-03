# OWASP LLM Controls

Risks:

- prompt injection
- sensitive data leakage
- tool misuse
- excessive agency
- hallucination
- insecure output handling
- untrusted retrieved context

Controls:

- use only authorized retrieved context
- cite sources
- refuse when evidence is insufficient
- sanitize ingested documents
- mask sensitive logs
- validate inputs
- limit MCP tool responses
- never expose credentials or tokens
