import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module.js";
import { ChatModule } from "./modules/chat/chat.module.js";
import { CacheModule } from "./modules/cache/cache.module.js";
import { DatabaseModule } from "./modules/database/database.module.js";
import { DocumentsModule } from "./modules/documents/documents.module.js";
import { EmbeddingsModule } from "./modules/embeddings/embeddings.module.js";
import { FeedbackModule } from "./modules/feedback/feedback.module.js";
import { HealthModule } from "./modules/health/health.module.js";
import { IngestionModule } from "./modules/ingestion/ingestion.module.js";
import { McpModule } from "./modules/mcp/mcp.module.js";

@Module({
  imports: [
    CacheModule,
    AuthModule,
    DatabaseModule,
    EmbeddingsModule,
    HealthModule,
    DocumentsModule,
    IngestionModule,
    ChatModule,
    McpModule,
    FeedbackModule
  ]
})
export class AppModule {}
