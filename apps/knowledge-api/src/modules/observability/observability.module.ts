import { Global, Module } from "@nestjs/common";
import { ObservabilityController } from "./observability.controller.js";
import { MetricsService } from "./metrics.service.js";

@Global()
@Module({
  controllers: [ObservabilityController],
  providers: [MetricsService],
  exports: [MetricsService]
})
export class ObservabilityModule {}
