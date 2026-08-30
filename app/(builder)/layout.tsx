import { SiteHeader } from "@/components/site-header";
import { WebMcpTools } from "@/components/web-mcp/web-mcp-tools";
import { AGENT_DOCS_DIRECTIVE_TEXT } from "@/lib/agent-discovery/directive";

const ThemeBuilderLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-svh flex-col bg-background">
    <blockquote className="sr-only">{AGENT_DOCS_DIRECTIVE_TEXT}</blockquote>
    <WebMcpTools />
    <SiteHeader />
    <main className="flex min-h-0 flex-1 flex-col">{children}</main>
  </div>
);

export default ThemeBuilderLayout;
