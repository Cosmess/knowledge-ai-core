import { Module } from "@nestjs/common";
import { KnowledgeRagService } from "@knowledge-ai/rag-core";

@Module({
  providers: [KnowledgeRagService],
  exports: [KnowledgeRagService]
})
export class RagCoreModule {}
