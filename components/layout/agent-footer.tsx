import Link from "next/link"
import {
  agentFooterWrapper,
  agentFooterLabel,
  agentFooterLink,
  agentFooterDot,
} from "@/utils/styles"

const AGENT_LINKS = [
  { label: "llms.txt", href: "/llms.txt" },
  { label: "llms-full.txt", href: "/llms-full.txt" },
  { label: "ai.txt", href: "/ai.txt" },
  { label: "AI snapshot", href: "/api/ai" },
  { label: "MCP docs", href: "/mcp" },
  { label: "MCP server card", href: "/.well-known/mcp/server-card.json" },
  { label: "MCP discovery", href: "/.well-known/mcp.json" },
  { label: "Markdown catalog", href: "/api/md/_catalog" },
  { label: "API catalog", href: "/.well-known/api-catalog" },
  { label: "OpenAPI", href: "/openapi.json" },
  { label: "Public REST", href: "/v1" },
  { label: "CLI", href: "/cli" },
  { label: "auth.md", href: "/auth.md" },
]

export const AgentFooter = () => (
  <footer aria-label="Agent and Machine Protocols" className={agentFooterWrapper}>
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 leading-normal">
      <span className={agentFooterLabel}>FOR AGENTS</span>
      {AGENT_LINKS.map((link, idx) => (
        <span key={link.href} className="inline-flex items-center gap-2">
          <Link
            href={link.href}
            className={agentFooterLink}
            prefetch={false}
          >
            {link.label}
          </Link>
          {idx < AGENT_LINKS.length - 1 && (
            <span aria-hidden="true" className={agentFooterDot}>
              ·
            </span>
          )}
        </span>
      ))}
    </div>
  </footer>
)
