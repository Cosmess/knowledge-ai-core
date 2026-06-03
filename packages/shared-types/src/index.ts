import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export type Audience = "developers" | "operations" | "product" | "onboarding" | "support";

export type QuestionDomain =
  | "technical"
  | "business_rule"
  | "architecture"
  | "api_documentation"
  | "operations"
  | "onboarding"
  | "troubleshooting"
  | "incident"
  | "backlog"
  | "unknown";

export type DocumentType =
  | "technical_doc"
  | "business_rule"
  | "api_doc"
  | "architecture_decision"
  | "user_story"
  | "next_task"
  | "runbook"
  | "faq"
  | "onboarding_doc"
  | "product_doc"
  | "operational_process"
  | "event_contract"
  | "database_doc"
  | "integration_doc";

export type Confidence = "low" | "medium" | "high";

export interface KnowledgeSource {
  id?: string;
  title: string;
  source: "confluence" | "markdown" | "openapi" | "repository";
  url?: string;
  documentType: DocumentType;
  content?: string;
  score?: number;
}

export interface KnowledgeDocument {
  id: string;
  source: KnowledgeSource["source"];
  title: string;
  url?: string;
  documentType: DocumentType;
  audience: Audience;
  domain: QuestionDomain;
  spaceKey?: string;
  system?: string;
  version?: string;
  updatedAt?: string;
  createdAt: string;
}

export interface ChatRequest {
  question: string;
  audience: Audience;
  spaceKey?: string;
  system?: string;
}

export interface ChatResponse {
  answer: string;
  domain: QuestionDomain;
  sources: KnowledgeSource[];
  confidence: Confidence;
}

export interface McpSearchRequest {
  query: string;
  domain?: QuestionDomain;
  audience?: Audience;
  spaceKey?: string;
  system?: string;
  limit?: number;
}

export interface McpSearchResponse {
  query: string;
  domain: QuestionDomain;
  results: KnowledgeSource[];
  evidenceStatus: "found" | "insufficient";
}

export interface LoginResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}

export interface AuthUser {
  sub: string;
  email: string;
  roles: string[];
  spaces: string[];
}

export interface IngestionResponse {
  jobId: string;
  documentsProcessed: number;
  chunksProcessed: number;
}

export interface FeedbackResponse {
  id: string;
  createdAt: string;
}

const audiences: Audience[] = ["developers", "operations", "product", "onboarding", "support"];

const domains: QuestionDomain[] = [
  "technical",
  "business_rule",
  "architecture",
  "api_documentation",
  "operations",
  "onboarding",
  "troubleshooting",
  "incident",
  "backlog",
  "unknown"
];

export class ChatRequestDto implements ChatRequest {
  @ApiProperty()
  @IsString()
  question!: string;

  @ApiProperty({ enum: audiences })
  @IsIn(audiences)
  audience!: Audience;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  spaceKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  system?: string;
}

export class McpSearchRequestDto implements McpSearchRequest {
  @ApiProperty()
  @IsString()
  query!: string;

  @ApiPropertyOptional({ enum: domains })
  @IsOptional()
  @IsIn(domains)
  domain?: QuestionDomain;

  @ApiPropertyOptional({ enum: audiences })
  @IsOptional()
  @IsIn(audiences)
  audience?: Audience;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  spaceKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  system?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number;
}

export class LoginRequestDto {
  @ApiProperty()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsString()
  password!: string;
}

export class MarkdownIngestionRequestDto {
  @ApiPropertyOptional({ default: "docs" })
  @IsOptional()
  @IsString()
  rootDir?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  spaceKey?: string;
}

export class ConfluenceIngestionRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  spaceKey?: string;
}

export class FeedbackRequestDto {
  @ApiProperty()
  @IsString()
  question!: string;

  @ApiProperty()
  @IsString()
  answer!: string;

  @ApiProperty()
  @IsBoolean()
  useful!: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}
