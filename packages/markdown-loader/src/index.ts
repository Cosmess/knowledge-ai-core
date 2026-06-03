export interface MarkdownDocument {
  path: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
}

export function parseMarkdownDocument(path: string, content: string): MarkdownDocument {
  const firstHeading = content.match(/^#\s+(.+)$/m);

  return {
    path,
    title: firstHeading?.[1] ?? path,
    content,
    metadata: {}
  };
}
