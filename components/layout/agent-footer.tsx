import Link from "next/link"
import { Blocks, Bot, Sparkles, Terminal } from "lucide-react"
import { HeaderLogo } from "@/components/layout/header-logo"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import {
  siteFooterWrapper,
  siteFooterColHeading,
  siteFooterLink,
  siteFooterBottomStrip,
  agentProtocolTray,
  agentFooterLabel,
  agentFooterLink,
  agentFooterDot,
} from "@/utils/styles"

const DIRECTORY_LINKS = [
  { label: "Tools Directory", href: ROUTES.TOOLS },
  { label: "Products Showcase", href: ROUTES.PRODUCTS },
  { label: "Trending Stacks", href: ROUTES.TRENDING },
  { label: "Showcase a Build", href: ROUTES.SHOWCASE },
] as const

const BUILDER_LINKS = [
  { label: "List a Product", href: ROUTES.SUBMIT },
  { label: "Sponsor & Pricing", href: ROUTES.PRICING },
  { label: "Showcase Build", href: ROUTES.SHOWCASE },
  { label: "Developer Guidelines", href: "/llms.txt" },
] as const

const PROTOCOL_LINKS = [
  { label: "LLMs.txt Index", href: "/llms.txt" },
  { label: "AI Agent Snapshot", href: "/api/ai" },
  { label: "MCP Protocol Server", href: "/.well-known/mcp.json" },
  { label: "OpenAPI 3.1 Spec", href: "/openapi.json" },
] as const

const MACHINE_AGENT_LINKS = [
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
] as const

export const AgentFooter = () => (
  <footer aria-label="Site and Agent Footer" className="flex flex-col border-t border-dashed border-border bg-white">
    {/* --- TIER 1: Developer & Community Directory --- */}
    <div className={siteFooterWrapper}>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        {/* Brand Column */}
        <div className="flex flex-col gap-3 sm:col-span-2 md:col-span-1 lg:col-span-2">
          <HeaderLogo />
          <p className="max-w-sm text-xs leading-relaxed text-slate-500">
            The discovery engine for developer tools, APIs, and modern tech stacks.
            Battle-tested by engineers, machine-readable for AI agents.
          </p>
          <div className="mt-2 flex items-center gap-3 font-mono text-xs text-slate-500">
            <a
              href={SITE_CONFIG.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              GitHub
            </a>
            <span>·</span>
            <a
              href={SITE_CONFIG.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              X/Twitter
            </a>
            <span>·</span>
            <a
              href={SITE_CONFIG.socials.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              Discord
            </a>
          </div>
        </div>

        {/* Column 1: Directory */}
        <div className="flex flex-col gap-3">
          <h4 className={siteFooterColHeading}>Directory</h4>
          <ul className="flex flex-col gap-2">
            {DIRECTORY_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={siteFooterLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Builders */}
        <div className="flex flex-col gap-3">
          <h4 className={siteFooterColHeading}>Builders</h4>
          <ul className="flex flex-col gap-2">
            {BUILDER_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={siteFooterLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Protocols */}
        <div className="flex flex-col gap-3">
          <h4 className={siteFooterColHeading}>Protocols</h4>
          <ul className="flex flex-col gap-2">
            {PROTOCOL_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={siteFooterLink} prefetch={false}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* --- TIER 2: Dedicated Machine & Agent Protocol Tray --- */}
    <div className={agentProtocolTray}>
      <div className="flex items-center gap-2 shrink-0 mr-1">
        <Bot className="size-3.5 text-amber-700" />
        <span className={agentFooterLabel}>FOR AI AGENTS</span>
        <span className="rounded border border-amber-600/30 bg-amber-600/10 px-1 py-0.2 font-mono text-[9px] font-bold text-amber-800">
          MCP READY
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {MACHINE_AGENT_LINKS.map((link, idx) => (
          <span key={link.href} className="inline-flex items-center gap-2">
            <Link
              href={link.href}
              className={agentFooterLink}
              prefetch={false}
            >
              {link.label}
            </Link>
            {idx < MACHINE_AGENT_LINKS.length - 1 && (
              <span aria-hidden="true" className={agentFooterDot}>
                ·
              </span>
            )}
          </span>
        ))}
      </div>
    </div>

    {/* --- TIER 3: Copyright & Status Strip --- */}
    <div className={siteFooterBottomStrip}>
      <div className="flex items-center gap-1.5 whitespace-nowrap text-[11px] text-slate-500">
        <span className="font-semibold text-slate-700">
          © {new Date().getFullYear()} {SITE_CONFIG.name}.
        </span>
        <span className="text-slate-400">
          Built for developers & autonomous agents.
        </span>
      </div>
      <div className="flex items-center gap-x-2.5 whitespace-nowrap font-mono text-[11px] sm:gap-x-3.5 sm:text-xs">
        <Link
          href={ROUTES.PRIVACY}
          className="text-slate-500 transition-colors hover:text-slate-900 underline-offset-4 hover:underline"
        >
          Privacy Policy
        </Link>
        <span className="text-slate-300 select-none">·</span>
        <Link
          href={ROUTES.TERMS}
          className="text-slate-500 transition-colors hover:text-slate-900 underline-offset-4 hover:underline"
        >
          Terms of Service
        </Link>
        <span className="text-slate-300 select-none">·</span>
        <Link
          href={ROUTES.REFUND}
          className="text-slate-500 transition-colors hover:text-slate-900 underline-offset-4 hover:underline"
        >
          Refund Policy
        </Link>
      </div>
    </div>
  </footer>
)

