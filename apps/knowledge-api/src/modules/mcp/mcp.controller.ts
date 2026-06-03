import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { McpSearchRequestDto, McpSearchResponse } from "@knowledge-ai/shared-types";
import { ApplicationRagService } from "../rag/rag.service.js";

@ApiTags("mcp")
@Controller("mcp")
export class McpController {
  constructor(private readonly ragService: ApplicationRagService) {}

  @Post("search")
  @ApiBody({ type: McpSearchRequestDto })
  @ApiOkResponse({ description: "Structured context for MCP tools." })
  async search(@Body() request: McpSearchRequestDto): Promise<McpSearchResponse> {
    return this.ragService.searchForMcp(request);
  }
}
