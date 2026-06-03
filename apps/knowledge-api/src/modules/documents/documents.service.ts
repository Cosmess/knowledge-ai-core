import { Injectable, NotFoundException } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import {
  Audience,
  DocumentType,
  KnowledgeDocument,
  KnowledgeSource,
  QuestionDomain
} from "@knowledge-ai/shared-types";
import { DatabaseService } from "../database/database.service.js";
import { EmbeddingService } from "../embeddings/embedding.service.js";

export interface UpsertDocumentInput {
  source: KnowledgeSource["source"];
  title: string;
  url?: string;
  documentType: DocumentType;
  audience: Audience;
  domain: QuestionDomain;
  spaceKey?: string;
  system?: string;
  version?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
  content: string;
  chunks: Array<{ content: string; metadata: Record<string, unknown>; tokenCount: number }>;
}

export interface SearchInput {
  query: string;
  limit: number;
  audience?: Audience;
  domain?: QuestionDomain;
  spaceKey?: string;
  system?: string;
  documentType?: DocumentType;
}

interface DocumentRow {
  id: string;
  source: KnowledgeSource["source"];
  title: string;
  url?: string;
  document_type: DocumentType;
  audience: Audience;
  domain: QuestionDomain;
  space_key?: string;
  system?: string;
  version?: string;
  updated_at?: Date;
  created_at: Date;
}

interface SourceRow {
  id: string;
  title: string;
  source: KnowledgeSource["source"];
  url?: string;
  document_type: DocumentType;
  content: string;
  score: number;
}

@Injectable()
export class DocumentsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly embeddings: EmbeddingService
  ) {}

  async upsertDocument(input: UpsertDocumentInput): Promise<{ documentId: string; chunksProcessed: number }> {
    const contentHash = createHash("sha256")
      .update(`${input.source}:${input.url ?? input.title}:${input.version ?? ""}:${input.content}`)
      .digest("hex");

    const documentResult = await this.database.query<{ id: string }>(
      `
        insert into documents (
          source, title, url, document_type, audience, domain, space_key, system,
          version, metadata, content_hash, updated_at
        )
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        on conflict(source, content_hash) do update set
          title = excluded.title,
          url = excluded.url,
          document_type = excluded.document_type,
          audience = excluded.audience,
          domain = excluded.domain,
          space_key = excluded.space_key,
          system = excluded.system,
          version = excluded.version,
          metadata = excluded.metadata,
          updated_at = excluded.updated_at
        returning id
      `,
      [
        input.source,
        input.title,
        input.url,
        input.documentType,
        input.audience,
        input.domain,
        input.spaceKey,
        input.system,
        input.version,
        JSON.stringify(input.metadata ?? {}),
        contentHash,
        input.updatedAt
      ]
    );

    const documentId = documentResult.rows[0]?.id;
    if (!documentId) {
      throw new Error("Document upsert did not return an id.");
    }

    await this.database.query("delete from document_chunks where document_id = $1", [documentId]);

    for (const chunk of input.chunks) {
      const embedding = await this.embeddings.embed(chunk.content);
      await this.database.query(
        `
          insert into document_chunks (id, document_id, content, embedding, metadata, token_count)
          values ($1, $2, $3, $4::vector, $5, $6)
        `,
        [
          randomUUID(),
          documentId,
          chunk.content,
          this.embeddings.vectorLiteral(embedding),
          JSON.stringify(chunk.metadata),
          chunk.tokenCount
        ]
      );
    }

    return { documentId, chunksProcessed: input.chunks.length };
  }

  async search(input: SearchInput): Promise<KnowledgeSource[]> {
    const embedding = await this.embeddings.embed(input.query);
    const filters: string[] = [];
    const params: unknown[] = [this.embeddings.vectorLiteral(embedding), input.limit];

    if (input.audience) {
      params.push(input.audience);
      filters.push(`d.audience = $${params.length}`);
    }

    if (input.domain && input.domain !== "unknown") {
      params.push(input.domain);
      filters.push(`d.domain = $${params.length}`);
    }

    if (input.spaceKey) {
      params.push(input.spaceKey);
      filters.push(`d.space_key = $${params.length}`);
    }

    if (input.system) {
      params.push(input.system);
      filters.push(`d.system = $${params.length}`);
    }

    if (input.documentType) {
      params.push(input.documentType);
      filters.push(`d.document_type = $${params.length}`);
    }

    const where = filters.length > 0 ? `where ${filters.join(" and ")}` : "";

    const result = await this.database.query<SourceRow>(
      `
        select
          c.id,
          d.title,
          d.source,
          d.url,
          d.document_type,
          c.content,
          1 - (c.embedding <=> $1::vector) as score
        from document_chunks c
        join documents d on d.id = c.document_id
        ${where}
        order by c.embedding <=> $1::vector
        limit $2
      `,
      params
    );

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      source: row.source,
      url: row.url,
      documentType: row.document_type,
      content: row.content,
      score: Number(row.score)
    }));
  }

  async listDocuments(): Promise<KnowledgeDocument[]> {
    const result = await this.database.query<DocumentRow>(`
      select id, source, title, url, document_type, audience, domain, space_key, system, version, updated_at, created_at
      from documents
      order by created_at desc
      limit 200
    `);

    return result.rows.map((row) => this.mapDocument(row));
  }

  async getDocument(id: string): Promise<KnowledgeDocument> {
    const result = await this.database.query<DocumentRow>(
      `
        select id, source, title, url, document_type, audience, domain, space_key, system, version, updated_at, created_at
        from documents
        where id = $1
      `,
      [id]
    );

    const row = result.rows[0];
    if (!row) {
      throw new NotFoundException("Document not found.");
    }

    return this.mapDocument(row);
  }

  async listSpaces(): Promise<string[]> {
    const result = await this.database.query<{ space_key: string }>(`
      select distinct space_key
      from documents
      where space_key is not null
      order by space_key
    `);

    return result.rows.map((row) => row.space_key);
  }

  private mapDocument(row: DocumentRow): KnowledgeDocument {
    return {
      id: row.id,
      source: row.source,
      title: row.title,
      url: row.url,
      documentType: row.document_type,
      audience: row.audience,
      domain: row.domain,
      spaceKey: row.space_key,
      system: row.system,
      version: row.version,
      updatedAt: row.updated_at?.toISOString(),
      createdAt: row.created_at.toISOString()
    };
  }
}
