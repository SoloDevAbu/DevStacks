import Link from "next/link"
import {
  ArrowUpRight,
  Sparkles,
  Flame,
  ArrowRight,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HoverOutline } from "@/components/shared/hover-outline"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { TIER } from "@/constants/plans"
import {
  FEATURED_SPOTLIGHT,
  TRENDING_DEVTOOLS,
} from "@/constants/navigation"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import {
  sidebarHeading,
  spotlightCard,
  sponsorCard,
  trendingDevtoolRow,
} from "@/utils/styles"

export const RightSidebar = () => {
  return (
    <div className="flex h-full flex-col gap-7 p-6 xl:p-7">
      {/* 1. Featured Spotlight */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className={sidebarHeading}>Featured Spotlight</h3>
          <span className="inline-flex items-center gap-1 rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-700">
            <Sparkles className="size-3 text-amber-500" />
            SPOTLIGHT
          </span>
        </div>

        <div className="group/btn relative">
          <Link
            href={ROUTES.TOOL(FEATURED_SPOTLIGHT.slug)}
            className={`block ${spotlightCard}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-violet-700 text-base font-bold text-white shadow-xs">
                {FEATURED_SPOTLIGHT.name[0]}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {FEATURED_SPOTLIGHT.name}
                  </span>
                  <VerifiedBadge tier={TIER.PREMIUM} />
                </div>
                <span className="truncate text-[11px] text-slate-500">
                  {FEATURED_SPOTLIGHT.category}
                </span>
              </div>
            </div>

            <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
              {FEATURED_SPOTLIGHT.tagline}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200/80 pt-2.5 font-mono text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-slate-700 font-semibold">
                ▲ {FEATURED_SPOTLIGHT.upvotesCount}
              </span>
              <span className="flex items-center gap-1 text-indigo-600 group-hover:translate-x-0.5 transition-transform font-medium">
                View Stack <ArrowRight className="size-3" />
              </span>
            </div>
          </Link>
          <HoverOutline />
        </div>
      </div>

      {/* 2. Sponsor / Promote Banner */}
      <div className="flex flex-col gap-2.5">
        <div className={sponsorCard}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-indigo-700 uppercase">
              PROMOTED
            </span>
            <span className="rounded bg-indigo-100/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-800">
              50k+ Devs
            </span>
          </div>

          <h4 className="mt-2 text-xs font-bold text-slate-900">
            Reach 50,000+ Builders
          </h4>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            Feature your developer tool, API, or infrastructure directly in our ecosystem.
          </p>

          <Button
            variant="outline"
            className="mt-3.5 h-8 w-full justify-between rounded-lg border-indigo-200 bg-white px-3 text-xs font-semibold text-indigo-700 shadow-2xs hover:bg-indigo-50"
            nativeButton={false}
            render={<Link href={ROUTES.PRICING} />}
          >
            <span>Reserve Placement</span>
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* 3. Top Devtools */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className={sidebarHeading}>Top Devtools</h3>
          <Link
            href={ROUTES.TOOLS}
            className="font-mono text-[10px] font-semibold text-slate-400 hover:text-slate-900 transition-colors"
          >
            ALL TOOLS →
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          {TRENDING_DEVTOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={ROUTES.TOOL(tool.slug)}
              className={trendingDevtoolRow}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${tool.color}`}
                >
                  {tool.letter}
                </div>
                <div className="flex flex-col truncate">
                  <span className="truncate text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </span>
                  <span className="truncate text-[10px] text-slate-400">
                    {tool.category}
                  </span>
                </div>
              </div>
              <span className="shrink-0 font-mono text-[11px] font-medium text-slate-500">
                ▲ {tool.upvotesCount}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Community Links */}
      <div className="mt-auto border-t border-dashed border-border pt-5">
        <div className="flex items-center justify-between">
          <h3 className={sidebarHeading}>Community</h3>
          <span className="font-mono text-[10px] text-slate-400">Open Network</span>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
          <a
            href={SITE_CONFIG.socials.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200/80 bg-slate-50/70 py-1.5 font-medium text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-950 transition-colors"
          >
            Discord
          </a>
          <a
            href={SITE_CONFIG.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200/80 bg-slate-50/70 py-1.5 font-medium text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-950 transition-colors"
          >
            GitHub
          </a>
          <a
            href={SITE_CONFIG.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200/80 bg-slate-50/70 py-1.5 font-medium text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-950 transition-colors"
          >
            X/Twitter
          </a>
        </div>
      </div>
    </div>
  )
}

