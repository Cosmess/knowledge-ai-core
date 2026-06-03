import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOkResponse({ description: "API health status." })
  getHealth(): { status: "ok"; service: string; timestamp: string } {
    return {
      status: "ok",
      service: "knowledge-api",
      timestamp: new Date().toISOString()
    };
  }
}
