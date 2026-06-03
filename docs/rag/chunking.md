# Chunking

Chunking must preserve enough context for a retrieved excerpt to be useful.

Rules:

- preserve headings
- preserve document metadata
- keep source reference
- avoid overly large chunks
- separate by document type when useful
- include parent section titles

Initial strategy:

```txt
split by heading
  -> merge small sections
  -> split large sections by token budget
  -> attach metadata
```
