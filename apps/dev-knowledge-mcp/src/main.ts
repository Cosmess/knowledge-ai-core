import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { McpSearchRequest, McpSearchResponse } from "@knowledge-ai/shared-types";

const apiBaseUrl = process.env.KNOWLEDGE_API_BASE_URL ?? "http://localhost:3000";

const tools = [
  "search_technical_docs",
  "search_business_rules",
  "search_api_docs",
  "search_architecture_docs",
  "search_user_stories",
  "get_service_context"
] as const;

type ToolName = (typeof tools)[number];

const domainByTool: Record<ToolName, McpSearchRequest["domain"]> = {
  search_technical_docs: "technical",
  search_business_rules: "business_rule",
  search_api_docs: "api_documentation",
  search_architecture_docs: "architecture",
  search_user_stories: "backlog",
  get_service_context: "technical"
};

async function callKnowledgeApi(request: McpSearchRequest): Promise<McpSearchResponse> {
  const response = await fetch(`${apiBaseUrl}/mcp/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Knowledge API returned ${response.status}: ${await response.text()}`);
  }

  return (await response.json()) as McpSearchResponse;
}

const server = new Server(
  {
    name: "dev-knowledge-mcp",
    version: "0.1.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map((name) => ({
    name,
    description: `Search internal knowledge using ${name}.`,
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        system: { type: "string" },
        spaceKey: { type: "string" },
        limit: { type: "number", default: 5 }
      },
      required: ["query"]
    }
  }))
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name as ToolName;

  if (!tools.includes(toolName)) {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const args = (request.params.arguments ?? {}) as {
    query?: string;
    system?: string;
    spaceKey?: string;
    limit?: number;
  };

  if (!args.query) {
    throw new Error("Missing required argument: query");
  }

  const result = await callKnowledgeApi({
    query: args.query,
    domain: domainByTool[toolName],
    audience: "developers",
    system: args.system,
    spaceKey: args.spaceKey,
    limit: args.limit ?? 5
  });

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
