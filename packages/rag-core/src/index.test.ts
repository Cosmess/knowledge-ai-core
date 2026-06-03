import { describe, expect, it } from "vitest";
import { KnowledgeRagService } from "./index.js";

describe("KnowledgeRagService", () => {
  const service = new KnowledgeRagService();

  it("classifies API questions", () => {
    expect(service.classifyQuestion("Qual endpoint consulta contratos?")).toBe("api_documentation");
  });

  it("classifies architecture questions", () => {
    expect(service.classifyQuestion("Esse serviço publica em qual fila RabbitMQ?")).toBe("architecture");
  });

  it("classifies business rule questions", () => {
    expect(service.classifyQuestion("Como funciona a regra de antecipação?")).toBe("business_rule");
  });

  it("returns insufficient evidence before retrieval is wired in package fallback", async () => {
    const response = await service.searchForMcp({ query: "Como funciona o fluxo?" });

    expect(response.evidenceStatus).toBe("insufficient");
    expect(response.results).toEqual([]);
  });
});
