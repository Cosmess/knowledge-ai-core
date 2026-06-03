import { Module } from "@nestjs/common";
import { RagModule } from "../rag/rag.module.js";
import { ChatController } from "./chat.controller.js";

@Module({
  imports: [RagModule],
  controllers: [ChatController]
})
export class ChatModule {}
