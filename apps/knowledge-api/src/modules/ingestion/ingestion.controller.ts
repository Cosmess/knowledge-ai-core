import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
  ConfluenceIngestionRequestDto,
  IngestionResponse,
  MarkdownIngestionRequestDto
} from "@knowledge-ai/shared-types";
import { MarkdownIngestionService } from "./markdown-ingestion.service.js";
import { Roles, RolesGuard } from "../auth/roles.guard.js";
import { ConfluenceIngestionService } from "./confluence-ingestion.service.js";

@ApiTags("ingestion")
@Controller()
@UseGuards(RolesGuard)
export class IngestionController {
  constructor(
    private readonly markdown: MarkdownIngestionService,
    private readonly confluence: ConfluenceIngestionService
  ) {}

  @Post("ingest/markdown")
  @Roles("admin")
  @ApiBody({ type: MarkdownIngestionRequestDto })
  @ApiOkResponse({ description: "Ingest Markdown documents." })
  ingestMarkdown(@Body() request: MarkdownIngestionRequestDto): Promise<IngestionResponse> {
    return this.markdown.ingest(request);
  }

  @Post("reindex")
  @Roles("admin")
  @ApiBody({ type: MarkdownIngestionRequestDto })
  @ApiOkResponse({ description: "Reindex local Markdown documents." })
  reindex(@Body() request: MarkdownIngestionRequestDto): Promise<IngestionResponse> {
    return this.markdown.ingest(request);
  }

  @Post("ingest/confluence")
  @Roles("admin")
  @ApiBody({ type: ConfluenceIngestionRequestDto })
  @ApiOkResponse({ description: "Confluence ingestion placeholder." })
  ingestConfluence(@Body() request: ConfluenceIngestionRequestDto): Promise<IngestionResponse> {
    return this.confluence.ingest(request);
  }
}
