import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ChatRequestDto, ChatResponse } from "@knowledge-ai/shared-types";
import { ApplicationRagService } from "../rag/rag.service.js";

@ApiTags("chat")
@Controller("chat")
export class ChatController {
  constructor(private readonly ragService: ApplicationRagService) {}

  @Post()
  @ApiBody({ type: ChatRequestDto })
  @ApiOkResponse({ description: "RAG answer with sources." })
  async chat(@Body() request: ChatRequestDto): Promise<ChatResponse> {
    return this.ragService.answer(request);
  }
}
