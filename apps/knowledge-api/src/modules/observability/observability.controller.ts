import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { MetricSnapshot, MetricsService } from "./metrics.service.js";

@ApiTags("observability")
@Controller("metrics")
export class ObservabilityController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  @ApiOkResponse({ description: "In-memory LLMOps metrics snapshot." })
  getMetrics(): MetricSnapshot {
    return this.metrics.getSnapshot();
  }
}
