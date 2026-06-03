import { Module } from "@nestjs/common";
import { RagCoreModule } from "../../providers/rag-core.module.js";
import { ChatController } from "./chat.controller.js";

@Module({
  imports: [RagCoreModule],
  controllers: [ChatController]
})
export class ChatModule {}
