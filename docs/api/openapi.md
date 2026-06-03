# OpenAPI

The NestJS API exposes Swagger/OpenAPI at:

```txt
/docs
```

The frontend repository should generate a client from the OpenAPI contract.

Recommended tooling:

```txt
openapi-typescript
openapi-fetch
```

This avoids manual DTO duplication between `knowledge-ai-core` and `knowledge-ai-web`.
