import { Module } from "@nestjs/common";
import { RagModule } from "../rag/rag.module.js";
import { McpController } from "./mcp.controller.js";

@Module({
  imports: [RagModule],
  controllers: [McpController]
})
export class McpModule {}
