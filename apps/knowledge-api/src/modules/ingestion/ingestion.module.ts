import { Module } from "@nestjs/common";
import { DocumentsModule } from "../documents/documents.module.js";
import { ConfluenceIngestionService } from "./confluence-ingestion.service.js";
import { IngestionController } from "./ingestion.controller.js";
import { MarkdownIngestionService } from "./markdown-ingestion.service.js";

@Module({
  imports: [DocumentsModule],
  controllers: [IngestionController],
  providers: [MarkdownIngestionService, ConfluenceIngestionService]
})
export class IngestionModule {}
