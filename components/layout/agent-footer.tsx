import Link from "next/link"
import Image from "next/image"
import { Award, Blocks, Bot, Sparkles, Terminal } from "lucide-react"
import { HeaderLogo } from "@/components/layout/header-logo"
import { HoverOutline } from "@/components/shared/hover-outline"
import { AI_PROVIDERS } from "@/constants/ai-providers"
import { AI_PROMPTS } from "@/lib/prompts"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import {
  siteFooterWrapper,
  siteFooterBrandSection,
  siteFooterNavGrid,
  siteFooterColHeading,
  siteFooterLink,
  siteFooterBottomStrip,
  footerAiSection,
  footerAiTrayLabel,
  footerAiButton,
  footerSocialIconButton,
  footerFeaturedSection,
  footerFeaturedLabel,
  footerFeaturedBadgeLink,
  agentProtocolTray,
  agentFooterLabel,
  agentFooterBadge,
  agentFooterLink,
  agentFooterDot,
} from "@/utils/styles"

const DIRECTORY_LINKS = [
  { label: "Tools Directory", href: ROUTES.TOOLS },
  { label: "Products Directory", href: ROUTES.PRODUCTS },
  { label: "Trending Stacks", href: ROUTES.TRENDING },
  { label: "Weekly Launches", href: ROUTES.DISCOVER_WEEKLY_LAUNCHES },
  { label: "Building Blocks", href: ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS },
  { label: "FAQs", href: ROUTES.FAQ },
] as const

const BUILDER_LINKS = [
  { label: "New Launch", href: ROUTES.SUBMIT },
  { label: "Launch a Product", href: ROUTES.SUBMIT_PRODUCT },
  { label: "Launch a Dev Tool", href: ROUTES.SUBMIT_TOOL },
  { label: "Sponsor & Pricing", href: ROUTES.PRICING },
  { label: "Developer Guidelines", href: "/llms.txt" },
] as const

const ALTERNATIVE_LINKS = [
  { label: "Product Hunt Alternative", href: ROUTES.PRODUCTHUNT_ALTERNATIVE },
  { label: "Uneed Alternative", href: ROUTES.UNEED_ALTERNATIVE },
  { label: "MicroLaunch Alternative", href: ROUTES.MICROLAUNCH_ALTERNATIVE },
  { label: "BetaList Alternative", href: ROUTES.BETALIST_ALTERNATIVE },
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
  <footer
    aria-label="Site and Agent Footer"
    className="flex flex-col border-t border-dashed border-border bg-white"
  >
    {/* --- TIER 1: Developer & Community Directory --- */}
    <div className={siteFooterWrapper}>
      {/* Ask AI Section inside Tier 1 */}
      <div className={footerAiSection}>
        <div className="flex shrink-0 items-center gap-2">
          <Sparkles className="size-3.5 text-blue-600" />
          <span className={footerAiTrayLabel}>
            ASK AI ABOUT {SITE_CONFIG.name.toUpperCase()}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {AI_PROVIDERS.map((ai) => (
            <div key={ai.id} className="group/btn relative inline-flex">
              <a
                href={`${ai.url}${encodeURIComponent(AI_PROMPTS.home)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={footerAiButton}
                title={`Ask ${ai.name} about ${SITE_CONFIG.name}`}
              >
                <Image
                  src={ai.icon}
                  alt={ai.name}
                  width={14}
                  height={14}
                  className="object-contain mix-blend-multiply"
                />
                <span className="text-xs font-medium text-slate-700 transition-colors group-hover/btn:text-slate-950">
                  {ai.name}
                </span>
              </a>
              <HoverOutline />
            </div>
          ))}
        </div>
      </div>

      {/* Brand Section (Full-Width) */}
      <div className={siteFooterBrandSection}>
        <div className="flex max-w-xl flex-col gap-2.5">
          <HeaderLogo />
          <p className="text-xs leading-relaxed text-slate-500">
            The discovery engine for developer tools, APIs, and modern tech
            stacks. Built for engineers, machine-readable for AI agents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="group/social relative inline-flex">
            <a
              href={SITE_CONFIG.socials.x}
              target="_blank"
              rel="noopener noreferrer"
              className={footerSocialIconButton}
              title="X / Twitter"
              aria-label="Follow LaunchNests on X (Twitter)"
            >
              <Image
                src="/social-logo/twitter.png"
                alt="X (Twitter)"
                width={16}
                height={16}
                className="size-4 object-contain"
              />
            </a>
            <HoverOutline />
          </div>

          <div className="group/social relative inline-flex">
            <a
              href={SITE_CONFIG.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={footerSocialIconButton}
              title="LinkedIn"
              aria-label="Follow LaunchNests on LinkedIn"
            >
              <Image
                src="/social-logo/linkedin.png"
                alt="LinkedIn"
                width={16}
                height={16}
                className="size-4 object-contain"
              />
            </a>
            <HoverOutline />
          </div>
        </div>
      </div>

      {/* --- TIER 2: Dedicated Machine & Agent Protocol Tray --- */}
      <div className={agentProtocolTray}>
        <div className="mr-1 flex shrink-0 items-center gap-2">
          <Bot className="size-3.5 text-blue-600" />
          <span className={agentFooterLabel}>FOR AI AGENTS</span>
          <span className={agentFooterBadge}>
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

      {/* --- Featured On Section --- */}
      <div className={footerFeaturedSection}>
        <div className="flex shrink-0 items-center gap-2">
          <Award className="size-3.5 text-amber-600" />
          <span className={footerFeaturedLabel}>FEATURED ON</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <a
            href="https://www.producthunt.com/products/launchnests?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-launchnests"
            target="_blank"
            rel="noopener noreferrer"
            className={footerFeaturedBadgeLink}
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1263668&theme=light&t=1790961643259"
              alt="LaunchNests - Discover products, tools & the tech behind them | Product Hunt"
              width="250"
              height="54"
              className="h-10 w-auto sm:h-11"
            />
          </a>

          <a
            href="https://www.scrolllaunch.com/products/launchnests?ref=badge"
            target="_blank"
            rel="noopener"
            className={footerFeaturedBadgeLink}
          >
            <img
              src="https://www.scrolllaunch.com/api/badge/launchnests?variant=launched&theme=light"
              alt="LaunchNests - Featured on ScrollLaunch"
              width="220"
              height="48"
              className="h-10 w-auto sm:h-11"
            />
          </a>
        </div>
      </div>

      {/* Navigation Columns Grid */}
      <div className={siteFooterNavGrid}>
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

        {/* Column 3: Alternatives */}
        <div className="flex flex-col gap-3">
          <h4 className={siteFooterColHeading}>Alternatives</h4>
          <ul className="flex flex-col gap-2">
            {ALTERNATIVE_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={siteFooterLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Protocols */}
        <div className="flex flex-col gap-3">
          <h4 className={siteFooterColHeading}>Protocols</h4>
          <ul className="flex flex-col gap-2">
            {PROTOCOL_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={siteFooterLink}
                  prefetch={false}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* --- TIER 3: Copyright & Status Strip --- */}
    <div className={siteFooterBottomStrip}>
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
        <span className="font-semibold text-slate-700">
          © {new Date().getFullYear()} {SITE_CONFIG.name}.
        </span>
        <span className="text-slate-400">
          Built for developers & autonomous agents.
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] sm:gap-x-3.5 sm:text-xs">
        <Link
          href={ROUTES.FAQ}
          className="text-slate-500 underline-offset-4 transition-colors hover:text-slate-900 hover:underline"
        >
          FAQs
        </Link>
        <span className="text-slate-300 select-none">·</span>
        <Link
          href={ROUTES.PRIVACY}
          className="text-slate-500 underline-offset-4 transition-colors hover:text-slate-900 hover:underline"
        >
          Privacy Policy
        </Link>
        <span className="text-slate-300 select-none">·</span>
        <Link
          href={ROUTES.TERMS}
          className="text-slate-500 underline-offset-4 transition-colors hover:text-slate-900 hover:underline"
        >
          Terms of Service
        </Link>
        <span className="text-slate-300 select-none">·</span>
        <Link
          href={ROUTES.REFUND}
          className="text-slate-500 underline-offset-4 transition-colors hover:text-slate-900 hover:underline"
        >
          Refund Policy
        </Link>
      </div>
    </div>
  </footer>
)
