import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { KnowledgeDocument } from "@knowledge-ai/shared-types";
import { DocumentsService } from "./documents.service.js";
import { Roles, RolesGuard } from "../auth/roles.guard.js";

@ApiTags("documents")
@ApiBearerAuth()
@Controller()
@UseGuards(RolesGuard)
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get("documents")
  @Roles("admin", "developer", "operations", "product", "support", "viewer")
  @ApiOkResponse({ description: "List indexed documents." })
  listDocuments(): Promise<KnowledgeDocument[]> {
    return this.documents.listDocuments();
  }

  @Get("documents/:id")
  @Roles("admin", "developer", "operations", "product", "support", "viewer")
  @ApiOkResponse({ description: "Get one indexed document." })
  getDocument(@Param("id") id: string): Promise<KnowledgeDocument> {
    return this.documents.getDocument(id);
  }

  @Get("spaces")
  @Roles("admin", "developer", "operations", "product", "support", "viewer")
  @ApiOkResponse({ description: "List indexed spaces." })
  listSpaces(): Promise<string[]> {
    return this.documents.listSpaces();
  }
}
