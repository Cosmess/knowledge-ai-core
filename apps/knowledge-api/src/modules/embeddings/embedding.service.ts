import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { createHash } from "node:crypto";
import { getAppConfig } from "../../config/app-config.js";

@Injectable()
export class EmbeddingService {
  private readonly config = getAppConfig();
  private readonly openai = this.config.openAiApiKey ? new OpenAI({ apiKey: this.config.openAiApiKey }) : undefined;

  async embed(text: string): Promise<number[]> {
    if (this.openai) {
      const response = await this.openai.embeddings.create({
        model: this.config.openAiEmbeddingModel,
        input: text,
        dimensions: this.config.embeddingDimensions
      });

      return response.data[0]?.embedding ?? this.localEmbedding(text);
    }

    return this.localEmbedding(text);
  }

  vectorLiteral(vector: number[]): string {
    return `[${vector.map((value) => Number(value.toFixed(8))).join(",")}]`;
  }

  private localEmbedding(text: string): number[] {
    const dimensions = this.config.embeddingDimensions;
    const vector = Array.from({ length: dimensions }, () => 0);
    const tokens = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .split(/[^a-z0-9_/-]+/g)
      .filter(Boolean);

    for (const token of tokens) {
      const hash = createHash("sha256").update(token).digest();
      const index = hash.readUInt32BE(0) % dimensions;
      const sign = hash[4] % 2 === 0 ? 1 : -1;
      vector[index] += sign;
    }

    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
    return vector.map((value) => value / norm);
  }
}
