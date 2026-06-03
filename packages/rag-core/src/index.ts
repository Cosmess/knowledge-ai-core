import {
  ChatRequest,
  ChatResponse,
  McpSearchRequest,
  McpSearchResponse,
  QuestionDomain
} from "@knowledge-ai/shared-types";

export class KnowledgeRagService {
  async answer(request: ChatRequest): Promise<ChatResponse> {
    const domain = this.classifyQuestion(request.question);

    return {
      answer:
        "Ainda nao ha documentos indexados suficientes para responder com evidencia. Execute a ingestao de Markdown ou Confluence e tente novamente.",
      domain,
      sources: [],
      confidence: "low"
    };
  }

  async searchForMcp(request: McpSearchRequest): Promise<McpSearchResponse> {
    const domain = request.domain ?? this.classifyQuestion(request.query);

    return {
      query: request.query,
      domain,
      results: [],
      evidenceStatus: "insufficient"
    };
  }

  private classifyQuestion(question: string): QuestionDomain {
    const normalized = question.toLowerCase();

    if (this.includesAny(normalized, ["endpoint", "payload", "swagger", "api"])) {
      return "api_documentation";
    }

    if (this.includesAny(normalized, ["fila", "topico", "kafka", "rabbit", "evento", "arquitetura"])) {
      return "architecture";
    }

    if (this.includesAny(normalized, ["regra", "negocio", "liquidacao", "antecipacao", "cancelamento"])) {
      return "business_rule";
    }

    if (this.includesAny(normalized, ["erro", "incidente", "troubleshooting", "pendente"])) {
      return "troubleshooting";
    }

    return "technical";
  }

  private includesAny(text: string, terms: string[]): boolean {
    return terms.some((term) => text.includes(term));
  }
}
