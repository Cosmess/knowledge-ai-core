# RAG Ingestion

Sources:

- Markdown files
- Confluence pages
- OpenAPI/Swagger documents
- repository docs
- runbooks
- backlog/user stories

## Markdown Flow

```txt
read files
  -> parse frontmatter
  -> preserve headings
  -> normalize content
  -> create document record
  -> chunk
  -> embed
  -> save chunks
```

## Confluence Flow

```txt
fetch pages by space
  -> capture title, body, version, url, updatedAt
  -> normalize HTML
  -> create document record
  -> chunk
  -> embed
  -> save chunks
```
