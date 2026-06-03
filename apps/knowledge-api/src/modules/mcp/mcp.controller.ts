import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { KnowledgeRagService } from "@knowledge-ai/rag-core";
import { McpSearchRequestDto, McpSearchResponse } from "@knowledge-ai/shared-types";

@ApiTags("mcp")
@Controller("mcp")
export class McpController {
  constructor(private readonly ragService: KnowledgeRagService) {}

  @Post("search")
  @ApiBody({ type: McpSearchRequestDto })
  @ApiOkResponse({ description: "Structured context for MCP tools." })
  async search(@Body() request: McpSearchRequestDto): Promise<McpSearchResponse> {
    return this.ragService.searchForMcp(request);
  }
}
