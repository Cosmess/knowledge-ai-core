import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { KnowledgeRagService } from "@knowledge-ai/rag-core";
import { ChatRequestDto, ChatResponse } from "@knowledge-ai/shared-types";

@ApiTags("chat")
@Controller("chat")
export class ChatController {
  constructor(private readonly ragService: KnowledgeRagService) {}

  @Post()
  @ApiBody({ type: ChatRequestDto })
  @ApiOkResponse({ description: "RAG answer with sources." })
  async chat(@Body() request: ChatRequestDto): Promise<ChatResponse> {
    return this.ragService.answer(request);
  }
}
