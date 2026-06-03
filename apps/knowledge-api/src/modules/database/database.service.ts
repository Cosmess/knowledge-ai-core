import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import pg from "pg";
import { getAppConfig } from "../../config/app-config.js";

const { Pool } = pg;
type QueryResultRow = pg.QueryResultRow;

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly pool = new Pool({
    connectionString: getAppConfig().databaseUrl
  });

  async onModuleInit(): Promise<void> {
    await this.migrate();
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  query<T extends QueryResultRow = QueryResultRow>(sql: string, params: unknown[] = []): Promise<pg.QueryResult<T>> {
    return this.pool.query<T>(sql, params);
  }

  async migrate(): Promise<void> {
    const dimensions = getAppConfig().embeddingDimensions;

    await this.query("create extension if not exists vector");
    await this.query("create extension if not exists pgcrypto");

    await this.query(`
      create table if not exists documents (
        id uuid primary key default gen_random_uuid(),
        source text not null,
        title text not null,
        url text,
        document_type text not null,
        audience text not null,
        domain text not null,
        space_key text,
        system text,
        version text,
        metadata jsonb not null default '{}'::jsonb,
        content_hash text not null,
        updated_at timestamptz,
        created_at timestamptz not null default now(),
        unique(source, content_hash)
      )
    `);

    await this.query(`
      create table if not exists document_chunks (
        id uuid primary key default gen_random_uuid(),
        document_id uuid not null references documents(id) on delete cascade,
        content text not null,
        embedding vector(${dimensions}) not null,
        metadata jsonb not null default '{}'::jsonb,
        token_count integer not null default 0,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `);

    await this.query(`
      create index if not exists idx_document_chunks_embedding
      on document_chunks using ivfflat (embedding vector_cosine_ops)
      with (lists = 100)
    `);

    await this.query("create index if not exists idx_documents_space on documents(space_key)");
    await this.query("create index if not exists idx_documents_type on documents(document_type)");
    await this.query("create index if not exists idx_documents_audience on documents(audience)");

    await this.query(`
      create table if not exists chat_sessions (
        id uuid primary key default gen_random_uuid(),
        user_id text,
        created_at timestamptz not null default now()
      )
    `);

    await this.query(`
      create table if not exists chat_messages (
        id uuid primary key default gen_random_uuid(),
        session_id uuid references chat_sessions(id) on delete set null,
        user_id text,
        question text not null,
        answer text not null,
        domain text not null,
        sources jsonb not null default '[]'::jsonb,
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now()
      )
    `);

    await this.query(`
      create table if not exists feedbacks (
        id uuid primary key default gen_random_uuid(),
        user_id text,
        question text not null,
        answer text not null,
        useful boolean not null,
        comment text,
        created_at timestamptz not null default now()
      )
    `);

    await this.query(`
      create table if not exists prompt_versions (
        id uuid primary key default gen_random_uuid(),
        name text not null,
        version text not null,
        content text not null,
        active boolean not null default true,
        created_at timestamptz not null default now(),
        unique(name, version)
      )
    `);

    await this.query(`
      create table if not exists ingestion_jobs (
        id uuid primary key default gen_random_uuid(),
        source text not null,
        status text not null,
        documents_processed integer not null default 0,
        chunks_processed integer not null default 0,
        error text,
        metadata jsonb not null default '{}'::jsonb,
        created_at timestamptz not null default now(),
        finished_at timestamptz
      )
    `);
  }
}
