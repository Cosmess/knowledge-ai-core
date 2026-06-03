# Knowledge AI Core

Backend, MCP Server, core RAG e infraestrutura da **Knowledge AI Platform**.

Repositório:

```txt
https://github.com/Cosmess/knowledge-ai-core
```

Frontend separado:

```txt
https://github.com/Cosmess/knowledge-ai-web
```

## Visão Geral

O `knowledge-ai-core` é o repositório principal da plataforma de conhecimento corporativo com IA.

Ele concentra:

- API backend em NestJS.
- MCP Server para desenvolvedores, agentes e IDEs.
- Core de RAG, retrieval, prompts e classificação de perguntas.
- Contratos compartilhados.
- Integrações com Confluence e arquivos Markdown.
- Abstrações para vector store, embeddings e LLM providers.
- Documentação técnica do projeto em formato SDD.
- Infraestrutura local com Docker Compose.

A plataforma tem dois usos principais:

1. **Desenvolvedores**
   - Consultar documentação técnica, APIs, arquitetura, regras de negócio, histórias, integrações, eventos, filas e troubleshooting via MCP.

2. **Produto, Operações, Suporte e Onboarding**
   - Consultar processos, regras de negócio, procedimentos, FAQs, playbooks e base de conhecimento operacional via API consumida pelo frontend.

## Arquitetura

Fluxo principal:

```txt
Confluence / Markdown / OpenAPI / Runbooks
        |
        v
Ingestion Layer
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
Retrieval Layer
        |
        v
RAG Orchestrator
        |
        +--> Knowledge API
        |
        +--> Dev Knowledge MCP
```

O frontend fica em outro repositório e consome a API por HTTP com autenticação.

```txt
Usuario
  -> knowledge-ai-web
  -> knowledge-api
  -> rag-core
  -> pgvector / Redis / LLM providers
```

## Estrutura Do Repositório

```txt
knowledge-ai-core/
├── apps/
│   ├── knowledge-api/
│   └── dev-knowledge-mcp/
│
├── packages/
│   ├── rag-core/
│   ├── shared-types/
│   ├── vector-store/
│   ├── llm-providers/
│   ├── confluence-client/
│   ├── markdown-loader/
│   ├── prompt-templates/
│   └── observability/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── mcp/
│   ├── rag/
│   ├── data/
│   ├── security/
│   ├── operations/
│   └── roadmap/
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .env.example
└── README.md
```

## Apps

### `apps/knowledge-api`

API principal em NestJS.

Responsabilidades:

- Expor endpoints HTTP.
- Validar entrada.
- Expor OpenAPI/Swagger.
- Centralizar autenticação e autorização.
- Executar o fluxo RAG.
- Servir o MCP com contexto estruturado.
- Futuramente ingerir Markdown e Confluence.

Endpoints já criados:

```http
GET /health
POST /chat
POST /mcp/search
```

Endpoints planejados:

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

### `apps/dev-knowledge-mcp`

Servidor MCP para ferramentas como Cursor, VS Code, Claude, Codex, Antigravity e outros agentes compatíveis com MCP.

Tools iniciais:

```txt
search_technical_docs
search_business_rules
search_api_docs
search_architecture_docs
search_user_stories
get_service_context
```

O MCP chama a API em vez de duplicar lógica de RAG. Isso mantém autorização, filtros, logs, fontes e segurança centralizados no backend.

## Packages

### `packages/rag-core`

Orquestra o fluxo RAG:

- classificação da pergunta;
- recuperação de contexto;
- montagem de prompt;
- chamada ao LLM;
- validação da resposta;
- fallback quando não houver evidência.

No estado atual, o pacote já possui uma implementação inicial que classifica perguntas e retorna resposta segura quando ainda não há documentos indexados.

### `packages/shared-types`

Contratos compartilhados entre API, MCP e demais packages:

- `ChatRequest`
- `ChatResponse`
- `McpSearchRequest`
- `McpSearchResponse`
- `Audience`
- `QuestionDomain`
- `DocumentType`
- DTOs usados pelo NestJS e Swagger

### `packages/vector-store`

Abstração do mecanismo de busca vetorial.

MVP planejado:

```txt
PostgreSQL + pgvector
```

Possíveis evoluções:

```txt
Qdrant
Pinecone
Weaviate
Redis Vector Search
```

### `packages/llm-providers`

Abstração para provedores de LLM.

Providers planejados:

```txt
OpenAI
Claude
Azure OpenAI
Ollama
```

### `packages/confluence-client`

Cliente para a Confluence REST API.

Responsabilidades planejadas:

- buscar páginas por space;
- capturar título, body, versão, URL e data de atualização;
- suportar reindexação por versão.

### `packages/markdown-loader`

Loader de arquivos Markdown.

Responsabilidades planejadas:

- ler arquivos `.md`;
- extrair frontmatter;
- preservar headings;
- normalizar conteúdo;
- preparar documentos para chunking.

### `packages/prompt-templates`

Prompts versionados por audiência e domínio:

- desenvolvedores;
- operações;
- produto;
- onboarding;
- suporte.

### `packages/observability`

Helpers de observabilidade e segurança operacional.

Responsabilidades:

- mascarar dados sensíveis;
- apoiar logs estruturados;
- apoiar métricas e tracing futuramente.

## Tecnologias Utilizadas

### Linguagem E Runtime

```txt
Node.js
TypeScript
```

### Backend

```txt
NestJS
class-validator
class-transformer
Swagger / OpenAPI
```

### MCP

```txt
Model Context Protocol SDK
stdio transport
```

### RAG E IA

```txt
RAG
Embeddings
Vector Search
OpenAI API
Claude API
Azure OpenAI
Ollama
```

### Dados E Cache

```txt
PostgreSQL
pgvector
Redis
```

### Infraestrutura

```txt
Docker
Docker Compose
pnpm workspaces
```

### Observabilidade E LLMOps

```txt
OpenTelemetry
logs estruturados
métricas de latência
métricas de tokens
fallback entre modelos
versionamento de prompts
```

## SDD

A pasta `docs/` é o **Software Design Document** oficial do projeto.

Ela contém:

```txt
docs/
├── architecture/
├── api/
├── mcp/
├── rag/
├── data/
├── security/
├── operations/
└── roadmap/
```

Principais documentos:

- [Visão de arquitetura](docs/architecture/overview.md)
- [Componentes](docs/architecture/components.md)
- [Fluxo de dados](docs/architecture/data-flow.md)
- [Decisões técnicas](docs/architecture/decisions.md)
- [Endpoints da API](docs/api/endpoints.md)
- [Autenticação](docs/api/auth.md)
- [Tools MCP](docs/mcp/tools.md)
- [Configuração de clientes MCP](docs/mcp/client-configuration.md)
- [Ingestão RAG](docs/rag/ingestion.md)
- [Retrieval](docs/rag/retrieval.md)
- [Banco de dados](docs/data/database.md)
- [Taxonomia de metadados](docs/data/metadata-taxonomy.md)
- [Segurança OWASP LLM](docs/security/owasp-llm.md)
- [Plano de implementação](docs/roadmap/implementation-plan.md)
- [Critérios de aceite](docs/roadmap/acceptance-criteria.md)

## Execução Local

### Pré-requisitos

```txt
Node.js 20+
pnpm 9+
Docker
Docker Compose
```

### Instalar Dependências

```bash
pnpm install
```

### Subir Dependências Locais

```bash
docker compose up -d
```

Serviços disponíveis:

```txt
PostgreSQL + pgvector: localhost:5432
Redis: localhost:6379
Ollama: localhost:11434
```

### Build

```bash
pnpm build
```

### Rodar API

```bash
pnpm dev:api
```

API:

```txt
http://localhost:3000
```

Swagger:

```txt
http://localhost:3000/docs
```

### Rodar MCP

Em outro terminal:

```bash
pnpm dev:mcp
```

O MCP usa a variável:

```env
KNOWLEDGE_API_BASE_URL=http://localhost:3000
```

### Configurar Clientes MCP

O MCP atual usa transporte `stdio` e pode ser conectado a clientes que executam comandos locais.

Exemplos incluídos:

```txt
.codex/config.toml.example
.cursor/mcp.json.example
.vscode/mcp.json.example
```

Documentação:

```txt
docs/mcp/client-configuration.md
```

## Variáveis De Ambiente

Arquivo base:

```txt
.env.example
```

Principais variáveis:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://knowledge:knowledge@localhost:5432/knowledge_ai
REDIS_URL=redis://localhost:6379

API_AUTH_JWT_SECRET=change-me

KNOWLEDGE_API_BASE_URL=http://localhost:3000

OPENAI_API_KEY=
ANTHROPIC_API_KEY=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=
OLLAMA_BASE_URL=http://localhost:11434

CONFLUENCE_BASE_URL=
CONFLUENCE_EMAIL=
CONFLUENCE_API_TOKEN=
CONFLUENCE_DEFAULT_SPACE=
```

## Contrato Com O Frontend

O frontend vive no repositório `knowledge-ai-web`.

Estratégia recomendada:

```txt
NestJS Swagger/OpenAPI
        |
        v
openapi-typescript / openapi-fetch
        |
        v
knowledge-ai-web
```

O frontend pode esconder botões e rotas, mas a API deve ser a fonte de verdade para autenticação e autorização.

## Segurança

Regras principais:

- Nunca responder usando informação fora do contexto recuperado.
- Nunca expor tokens, credenciais ou segredos.
- Sempre citar fontes quando houver evidência.
- Informar quando não houver evidência suficiente.
- Validar entrada do usuário.
- Sanitizar documentos ingeridos.
- Aplicar autorização por role, space, audience e documentType.
- Mascarar dados sensíveis nos logs.

Riscos considerados:

- prompt injection;
- vazamento de dados sensíveis;
- exposição de credenciais;
- uso indevido de tools;
- resposta baseada em fonte não autorizada;
- alucinação;
- ausência de validação de saída;
- logs com dados sensíveis.

## Roadmap

### Fase 1: Scaffold Core

- Monorepo com pnpm workspaces.
- API NestJS.
- MCP Server.
- Packages compartilhados.
- SDD em `docs/`.

Status: concluído.

### Fase 2: Backend API

- Autenticação.
- Autorização.
- OpenAPI completo.
- Endpoints de documentos.
- Endpoints de ingestão.
- Feedback.

### Fase 3: Markdown RAG

- Loader de Markdown.
- Frontmatter.
- Chunking.
- Embeddings.
- Persistência em pgvector.
- Retrieval.

### Fase 4: MCP

- Evoluir tools.
- Melhorar schemas.
- Testar em clientes MCP.
- Retornar fontes e trechos ranqueados.

### Fase 5: Confluence

- Cliente Confluence.
- Ingestão por space.
- Normalização de HTML.
- Controle de versão.
- Reindexação incremental.

### Fase 6: Segurança E LLMOps

- Logs estruturados.
- Métricas.
- Mascaramento de dados.
- Versionamento de prompts.
- Fallback entre providers.
- Avaliação de respostas.

## Estado Atual

Implementado:

- estrutura inicial do monorepo;
- API NestJS com health, chat e MCP search;
- MCP Server com tools iniciais;
- contracts em `shared-types`;
- core RAG inicial;
- SDD em `docs/`;
- Docker Compose com Postgres/pgvector, Redis e Ollama;
- build TypeScript validado.

Ainda pendente:

- autenticação real;
- persistência em banco;
- embeddings reais;
- integração pgvector;
- ingestão Markdown real;
- ingestão Confluence real;
- providers OpenAI/Claude/Ollama;
- testes automatizados;
- CI/CD.
