import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";
import { createHash } from "node:crypto";
import { getAppConfig } from "../../config/app-config.js";

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly redis?: Redis;

  constructor() {
    const redisUrl = getAppConfig().redisUrl;
    if (redisUrl) {
      this.redis = new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1 });
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis?.quit();
  }

  key(prefix: string, value: unknown): string {
    const hash = createHash("sha256").update(JSON.stringify(value)).digest("hex");
    return `${prefix}:${hash}`;
  }

  async getJson<T>(key: string): Promise<T | undefined> {
    if (!this.redis) {
      return undefined;
    }

    try {
      const value = await this.redis.get(key);
      return value ? (JSON.parse(value) as T) : undefined;
    } catch {
      return undefined;
    }
  }

  async setJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!this.redis) {
      return;
    }

    try {
      await this.redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch {
      // Cache must never break the request path.
    }
  }
}
