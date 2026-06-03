import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { KnowledgeDocument } from "@knowledge-ai/shared-types";
import { DocumentsService } from "./documents.service.js";

@ApiTags("documents")
@ApiBearerAuth()
@Controller()
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get("documents")
  @ApiOkResponse({ description: "List indexed documents." })
  listDocuments(): Promise<KnowledgeDocument[]> {
    return this.documents.listDocuments();
  }

  @Get("documents/:id")
  @ApiOkResponse({ description: "Get one indexed document." })
  getDocument(@Param("id") id: string): Promise<KnowledgeDocument> {
    return this.documents.getDocument(id);
  }

  @Get("spaces")
  @ApiOkResponse({ description: "List indexed spaces." })
  listSpaces(): Promise<string[]> {
    return this.documents.listSpaces();
  }
}
