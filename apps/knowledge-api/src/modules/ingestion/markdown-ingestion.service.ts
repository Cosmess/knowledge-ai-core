import { Injectable } from "@nestjs/common";
import fg from "fast-glob";
import matter from "gray-matter";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import {
  Audience,
  DocumentType,
  IngestionResponse,
  MarkdownIngestionRequestDto,
  QuestionDomain
} from "@knowledge-ai/shared-types";
import { getAppConfig } from "../../config/app-config.js";
import { DatabaseService } from "../database/database.service.js";
import { DocumentsService } from "../documents/documents.service.js";

interface MarkdownFrontmatter {
  title?: string;
  documentType?: DocumentType;
  audience?: Audience;
  domain?: QuestionDomain;
  system?: string;
  spaceKey?: string;
  version?: string | number;
  url?: string;
}

@Injectable()
export class MarkdownIngestionService {
  constructor(
    private readonly documents: DocumentsService,
    private readonly database: DatabaseService
  ) {}

  async ingest(request: MarkdownIngestionRequestDto): Promise<IngestionResponse> {
    const config = getAppConfig();
    const rootDir = resolve(process.cwd(), request.rootDir ?? config.markdownDocsRoot);
    const jobId = randomUUID();
    let documentsProcessed = 0;
    let chunksProcessed = 0;

    await this.database.query(
      "insert into ingestion_jobs (id, source, status, metadata) values ($1, $2, $3, $4)",
      [jobId, "markdown", "running", JSON.stringify({ rootDir })]
    );

    try {
      const files = await fg("**/*.md", {
        cwd: rootDir,
        absolute: true,
        ignore: ["node_modules/**", "dist/**"]
      });

      for (const file of files) {
        const raw = await readFile(file, "utf8");
        const parsed = matter(raw);
        const frontmatter = parsed.data as MarkdownFrontmatter;
        const content = parsed.content.trim();

        if (!content) {
          continue;
        }

        const chunks = this.chunkMarkdown(content, {
          sourcePath: file,
          title: frontmatter.title ?? this.titleFromContent(content, file)
        });

        const result = await this.documents.upsertDocument({
          source: "markdown",
          title: frontmatter.title ?? this.titleFromContent(content, file),
          url: frontmatter.url ?? file,
          documentType: frontmatter.documentType ?? "technical_doc",
          audience: frontmatter.audience ?? "developers",
          domain: frontmatter.domain ?? "technical",
          spaceKey: frontmatter.spaceKey ?? request.spaceKey,
          system: frontmatter.system,
          version: frontmatter.version ? String(frontmatter.version) : undefined,
          metadata: {
            path: file
          },
          content,
          chunks
        });

        documentsProcessed += 1;
        chunksProcessed += result.chunksProcessed;
      }

      await this.database.query(
        `
          update ingestion_jobs
          set status = $2, documents_processed = $3, chunks_processed = $4, finished_at = now()
          where id = $1
        `,
        [jobId, "completed", documentsProcessed, chunksProcessed]
      );

      return { jobId, documentsProcessed, chunksProcessed };
    } catch (error) {
      await this.database.query(
        "update ingestion_jobs set status = $2, error = $3, finished_at = now() where id = $1",
        [jobId, "failed", error instanceof Error ? error.message : "Unknown ingestion error"]
      );
      throw error;
    }
  }

  private chunkMarkdown(content: string, baseMetadata: Record<string, unknown>): Array<{
    content: string;
    metadata: Record<string, unknown>;
    tokenCount: number;
  }> {
    const sections = content.split(/(?=^#{1,6}\s+)/m).map((section) => section.trim()).filter(Boolean);
    const chunks: Array<{ content: string; metadata: Record<string, unknown>; tokenCount: number }> = [];

    for (const section of sections.length > 0 ? sections : [content]) {
      const heading = section.match(/^#{1,6}\s+(.+)$/m)?.[1];
      const words = section.split(/\s+/g);
      const maxWords = 450;

      for (let index = 0; index < words.length; index += maxWords) {
        const chunkWords = words.slice(index, index + maxWords);
        chunks.push({
          content: chunkWords.join(" "),
          metadata: {
            ...baseMetadata,
            heading,
            chunkIndex: chunks.length
          },
          tokenCount: chunkWords.length
        });
      }
    }

    return chunks;
  }

  private titleFromContent(content: string, file: string): string {
    return content.match(/^#\s+(.+)$/m)?.[1] ?? basename(file);
  }
}
