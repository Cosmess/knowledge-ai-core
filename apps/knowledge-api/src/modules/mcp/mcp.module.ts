import { Module } from "@nestjs/common";
import { RagCoreModule } from "../../providers/rag-core.module.js";
import { McpController } from "./mcp.controller.js";

@Module({
  imports: [RagCoreModule],
  controllers: [McpController]
})
export class McpModule {}
