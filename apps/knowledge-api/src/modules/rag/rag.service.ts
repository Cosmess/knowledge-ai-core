import { Injectable } from "@nestjs/common";
import { KnowledgeRagService } from "@knowledge-ai/rag-core";
import {
  ChatRequest,
  ChatResponse,
  KnowledgeSource,
  McpSearchRequest,
  McpSearchResponse
} from "@knowledge-ai/shared-types";
import OpenAI from "openai";
import { getAppConfig } from "../../config/app-config.js";
import { CacheService } from "../cache/cache.service.js";
import { DatabaseService } from "../database/database.service.js";
import { DocumentsService } from "../documents/documents.service.js";

@Injectable()
export class ApplicationRagService {
  private readonly config = getAppConfig();
  private readonly openai = this.config.openAiApiKey ? new OpenAI({ apiKey: this.config.openAiApiKey }) : undefined;

  constructor(
    private readonly core: KnowledgeRagService,
    private readonly documents: DocumentsService,
    private readonly cache: CacheService,
    private readonly database: DatabaseService
  ) {}

  async answer(request: ChatRequest, userId?: string): Promise<ChatResponse> {
    const cacheKey = this.cache.key("rag:answer", request);
    const cached = await this.cache.getJson<ChatResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const domain = this.core.classifyQuestion(request.question);
    const sources = await this.documents.search({
      query: request.question,
      limit: 5,
      audience: request.audience,
      domain,
      spaceKey: request.spaceKey,
      system: request.system
    });

    if (sources.length === 0 || !this.hasEnoughEvidence(sources)) {
      const response: ChatResponse = {
        answer:
          "Não encontrei evidência suficiente na base indexada para responder com segurança. Ingestione documentos relacionados ou ajuste os filtros de audiência, space ou sistema.",
        domain,
        sources,
        confidence: "low"
      };
      await this.persistMessage(request.question, response, userId);
      await this.cache.setJson(cacheKey, response, 300);
      return response;
    }

    const answer = await this.generateAnswer(request.question, sources);
    const response: ChatResponse = {
      answer,
      domain,
      sources,
      confidence: this.confidenceFromSources(sources)
    };

    await this.persistMessage(request.question, response, userId);
    await this.cache.setJson(cacheKey, response, 300);
    return response;
  }

  async searchForMcp(request: McpSearchRequest): Promise<McpSearchResponse> {
    const domain = request.domain ?? this.core.classifyQuestion(request.query);
    const results = await this.documents.search({
      query: request.query,
      limit: request.limit ?? 5,
      audience: request.audience,
      domain,
      spaceKey: request.spaceKey,
      system: request.system
    });

    return {
      query: request.query,
      domain,
      results,
      evidenceStatus: results.length > 0 && this.hasEnoughEvidence(results) ? "found" : "insufficient"
    };
  }

  private async generateAnswer(question: string, sources: KnowledgeSource[]): Promise<string> {
    const context = sources
      .map((source, index) => {
        return `[${index + 1}] ${source.title}\nFonte: ${source.url ?? source.source}\nTrecho: ${source.content ?? ""}`;
      })
      .join("\n\n");

    if (this.openai) {
      const completion = await this.openai.chat.completions.create({
        model: this.config.openAiChatModel,
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente de conhecimento interno. Use somente o contexto fornecido. Cite as fontes pelo número. Se o contexto não sustentar a resposta, diga que não há evidência suficiente."
          },
          {
            role: "user",
            content: `Pergunta:\n${question}\n\nContexto:\n${context}`
          }
        ]
      });

      return completion.choices[0]?.message.content?.trim() ?? this.extractiveAnswer(sources);
    }

    return this.extractiveAnswer(sources);
  }

  private extractiveAnswer(sources: KnowledgeSource[]): string {
    const primary = sources[0];
    const excerpt = primary?.content?.trim();

    if (!primary || !excerpt) {
      return "Encontrei fontes relacionadas, mas não há trecho suficiente para montar uma resposta confiável.";
    }

    return `Com base em "${primary.title}", o trecho mais relevante encontrado foi: ${excerpt}\n\nFontes: ${sources
      .map((source, index) => `[${index + 1}] ${source.title}`)
      .join(", ")}`;
  }

  private hasEnoughEvidence(sources: KnowledgeSource[]): boolean {
    return sources.some((source) => (source.score ?? 0) >= 0.15);
  }

  private confidenceFromSources(sources: KnowledgeSource[]): "low" | "medium" | "high" {
    const bestScore = Math.max(...sources.map((source) => source.score ?? 0));
    if (bestScore >= 0.75) {
      return "high";
    }
    if (bestScore >= 0.35) {
      return "medium";
    }
    return "low";
  }

  private async persistMessage(question: string, response: ChatResponse, userId?: string): Promise<void> {
    await this.database.query(
      `
        insert into chat_messages (user_id, question, answer, domain, sources, metadata)
        values ($1, $2, $3, $4, $5, $6)
      `,
      [userId, question, response.answer, response.domain, JSON.stringify(response.sources), JSON.stringify({ confidence: response.confidence })]
    );
  }
}
