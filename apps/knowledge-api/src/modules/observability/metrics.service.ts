import { Injectable } from "@nestjs/common";

export interface MetricSnapshot {
  requests: number;
  answered: number;
  insufficientEvidence: number;
  fallbacks: number;
  totalLatencyMs: number;
  averageLatencyMs: number;
}

@Injectable()
export class MetricsService {
  private snapshot: MetricSnapshot = {
    requests: 0,
    answered: 0,
    insufficientEvidence: 0,
    fallbacks: 0,
    totalLatencyMs: 0,
    averageLatencyMs: 0
  };

  recordRequest(input: { latencyMs: number; answered: boolean; fallback?: boolean }): void {
    this.snapshot.requests += 1;
    this.snapshot.totalLatencyMs += input.latencyMs;
    this.snapshot.averageLatencyMs = Math.round(this.snapshot.totalLatencyMs / this.snapshot.requests);

    if (input.answered) {
      this.snapshot.answered += 1;
    } else {
      this.snapshot.insufficientEvidence += 1;
    }

    if (input.fallback) {
      this.snapshot.fallbacks += 1;
    }
  }

  getSnapshot(): MetricSnapshot {
    return { ...this.snapshot };
  }
}
