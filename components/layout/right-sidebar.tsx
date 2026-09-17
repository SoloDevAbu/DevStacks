import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { sidebarHeading, sponsorCard } from "@/utils/styles"

export const RightSidebar = () => {
  return (
    <div className="flex h-full flex-col justify-between p-6 xl:p-7">
      {/* 1. Sponsor / Promote Banner */}
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

      {/* 2. Community & Ad Info */}
      <div className="border-t border-dashed border-border pt-5">
        <div className="flex items-center justify-between">
          <h3 className={sidebarHeading}>Community</h3>
          <Link
            href={ROUTES.PRICING}
            className="font-mono text-[10px] text-slate-400 hover:text-slate-900 transition-colors"
          >
            Advertise with us
          </Link>
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
