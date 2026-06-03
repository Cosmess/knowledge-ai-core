import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
  ConfluenceIngestionRequestDto,
  IngestionResponse,
  MarkdownIngestionRequestDto
} from "@knowledge-ai/shared-types";
import { MarkdownIngestionService } from "./markdown-ingestion.service.js";

@ApiTags("ingestion")
@Controller()
export class IngestionController {
  constructor(private readonly markdown: MarkdownIngestionService) {}

  @Post("ingest/markdown")
  @ApiBody({ type: MarkdownIngestionRequestDto })
  @ApiOkResponse({ description: "Ingest Markdown documents." })
  ingestMarkdown(@Body() request: MarkdownIngestionRequestDto): Promise<IngestionResponse> {
    return this.markdown.ingest(request);
  }

  @Post("reindex")
  @ApiBody({ type: MarkdownIngestionRequestDto })
  @ApiOkResponse({ description: "Reindex local Markdown documents." })
  reindex(@Body() request: MarkdownIngestionRequestDto): Promise<IngestionResponse> {
    return this.markdown.ingest(request);
  }

  @Post("ingest/confluence")
  @ApiBody({ type: ConfluenceIngestionRequestDto })
  @ApiOkResponse({ description: "Confluence ingestion placeholder." })
  ingestConfluence(): IngestionResponse {
    return {
      jobId: "not-implemented",
      documentsProcessed: 0,
      chunksProcessed: 0
    };
  }
}
