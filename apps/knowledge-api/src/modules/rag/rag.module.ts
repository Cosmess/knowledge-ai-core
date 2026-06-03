import { Module } from "@nestjs/common";
import { RagCoreModule } from "../../providers/rag-core.module.js";
import { DocumentsModule } from "../documents/documents.module.js";
import { ApplicationRagService } from "./rag.service.js";

@Module({
  imports: [DocumentsModule, RagCoreModule],
  providers: [ApplicationRagService],
  exports: [ApplicationRagService]
})
export class RagModule {}
