import { Module } from "@nestjs/common";
import { ChatModule } from "./modules/chat/chat.module.js";
import { HealthModule } from "./modules/health/health.module.js";
import { McpModule } from "./modules/mcp/mcp.module.js";

@Module({
  imports: [HealthModule, ChatModule, McpModule]
})
export class AppModule {}
