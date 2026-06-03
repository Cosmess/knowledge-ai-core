import { Injectable } from "@nestjs/common";
import { htmlToText } from "html-to-text";
import { randomUUID } from "node:crypto";
import {
  ConfluenceIngestionRequestDto,
  IngestionResponse
} from "@knowledge-ai/shared-types";
import { getAppConfig } from "../../config/app-config.js";
import { DatabaseService } from "../database/database.service.js";
import { DocumentsService } from "../documents/documents.service.js";

interface ConfluenceSearchResponse {
  results: Array<{
    id: string;
    title: string;
    _links?: { webui?: string };
    version?: { number?: number; when?: string };
    body?: { storage?: { value?: string } };
  }>;
  _links?: { next?: string };
}

@Injectable()
export class ConfluenceIngestionService {
  constructor(
    private readonly documents: DocumentsService,
    private readonly database: DatabaseService
  ) {}

  async ingest(request: ConfluenceIngestionRequestDto): Promise<IngestionResponse> {
    const config = getAppConfig();

    if (!config.confluenceBaseUrl || !config.confluenceEmail || !config.confluenceApiToken) {
      throw new Error("Confluence configuration is incomplete.");
    }

    const spaceKey = request.spaceKey ?? config.confluenceDefaultSpace;
    if (!spaceKey) {
      throw new Error("Confluence spaceKey is required.");
    }

    const jobId = randomUUID();
    let documentsProcessed = 0;
    let chunksProcessed = 0;

    await this.database.query(
      "insert into ingestion_jobs (id, source, status, metadata) values ($1, $2, $3, $4)",
      [jobId, "confluence", "running", JSON.stringify({ spaceKey })]
    );

    try {
      for await (const page of this.fetchPages(spaceKey)) {
        const html = page.body?.storage?.value ?? "";
        const content = htmlToText(html, {
          wordwrap: false,
          selectors: [
            { selector: "a", options: { ignoreHref: false } },
            { selector: "img", format: "skip" }
          ]
        }).trim();

        if (!content) {
          continue;
        }

        const chunks = this.chunkText(content, {
          confluencePageId: page.id,
          title: page.title
        });

        const result = await this.documents.upsertDocument({
          source: "confluence",
          title: page.title,
          url: `${config.confluenceBaseUrl}${page._links?.webui ?? ""}`,
          documentType: "technical_doc",
          audience: "developers",
          domain: "technical",
          spaceKey,
          version: page.version?.number ? String(page.version.number) : undefined,
          updatedAt: page.version?.when,
          metadata: {
            confluencePageId: page.id
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
        [jobId, "failed", error instanceof Error ? error.message : "Unknown Confluence ingestion error"]
      );
      throw error;
    }
  }

  private async *fetchPages(spaceKey: string): AsyncIterable<ConfluenceSearchResponse["results"][number]> {
    const config = getAppConfig();
    let url = `${config.confluenceBaseUrl}/rest/api/content?spaceKey=${encodeURIComponent(
      spaceKey
    )}&type=page&limit=50&expand=body.storage,version`;

    while (url) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${config.confluenceEmail}:${config.confluenceApiToken}`).toString("base64")}`,
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Confluence returned ${response.status}: ${await response.text()}`);
      }

      const payload = (await response.json()) as ConfluenceSearchResponse;
      for (const page of payload.results) {
        yield page;
      }

      url = payload._links?.next ? `${config.confluenceBaseUrl}${payload._links.next}` : "";
    }
  }

  private chunkText(content: string, baseMetadata: Record<string, unknown>): Array<{
    content: string;
    metadata: Record<string, unknown>;
    tokenCount: number;
  }> {
    const words = content.split(/\s+/g).filter(Boolean);
    const chunks: Array<{ content: string; metadata: Record<string, unknown>; tokenCount: number }> = [];
    const maxWords = 450;

    for (let index = 0; index < words.length; index += maxWords) {
      const chunkWords = words.slice(index, index + maxWords);
      chunks.push({
        content: chunkWords.join(" "),
        metadata: {
          ...baseMetadata,
          chunkIndex: chunks.length
        },
        tokenCount: chunkWords.length
      });
    }

    return chunks;
  }
}
