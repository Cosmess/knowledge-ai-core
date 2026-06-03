import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { FeedbackRequestDto, FeedbackResponse } from "@knowledge-ai/shared-types";
import { FeedbackService } from "./feedback.service.js";

@ApiTags("feedback")
@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedback: FeedbackService) {}

  @Post()
  @ApiBody({ type: FeedbackRequestDto })
  @ApiOkResponse({ description: "Create user feedback." })
  create(@Body() request: FeedbackRequestDto): Promise<FeedbackResponse> {
    return this.feedback.create(request);
  }
}
