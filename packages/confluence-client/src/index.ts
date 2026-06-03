export interface ConfluencePage {
  id: string;
  title: string;
  url: string;
  spaceKey: string;
  version: number;
  updatedAt: string;
  body: string;
}

export class ConfluenceClient {
  async fetchPagesBySpace(_spaceKey: string): Promise<ConfluencePage[]> {
    throw new Error("Confluence ingestion is not implemented yet.");
  }
}
