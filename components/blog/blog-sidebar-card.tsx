import Link from "next/link"
import Image from "next/image"
import { ExternalLink, ArrowUpRight } from "lucide-react"
import { GithubIcon } from "@/components/shared/icons"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/constants/routes"
import { PLANS, type Tier } from "@/constants/plans"
import { cn } from "@/lib/utils"
import {
  sidebarCard,
  sidebarLogoWrapper,
} from "@/utils/blog/styles"
import type { Tool, Product, User } from "@/db/schema"

export interface BlogSidebarCardProps {
  itemType: "tool" | "product"
  item: Tool | Product
  submitter?: User | null
  isSidebar?: boolean
  className?: string
}

export const BlogSidebarCard = ({
  itemType,
  item,
  submitter,
  isSidebar = false,
  className,
}: BlogSidebarCardProps) => {
  const directoryHref =
    itemType === "tool"
      ? ROUTES.TOOL(item.slug)
      : ROUTES.PRODUCT(item.slug)

  const plan = PLANS[item.tier as Tier]

  return (
    <div
      id="product-overview"
      className={cn(
        isSidebar
          ? "relative flex flex-col justify-between scroll-mt-24 gap-5 w-full"
          : sidebarCard,
        className
      )}
    >
      {/* Corner Brackets on standalone card only */}
      {!isSidebar && <CornerBrackets />}

      {/* Product Hero Header */}
      <div className="flex items-start gap-3.5 border-b border-dashed border-border pb-4">
        {item.logoUrl ? (
          <div className={sidebarLogoWrapper}>
            <Image
              src={item.logoUrl}
              alt={item.name}
              fill
              className="object-contain p-1"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-border bg-slate-100 font-mono text-sm font-bold text-slate-700">
            {item.name.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-base font-bold text-slate-900 truncate">
              {item.name}
            </h3>
            {plan && (
              <Badge
                variant="outline"
                className={cn("text-[10px] font-mono px-1.5 py-0 h-4 uppercase", plan.badgeClass)}
              >
                {plan.badgeLabel}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.tagline}
          </p>
        </div>
      </div>

      {/* Meta Specs */}
      <div className="flex flex-col gap-2.5 border-b border-dashed border-border pb-4 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-slate-400 uppercase text-[10px]">Pricing Model:</span>
          <span className="font-bold text-slate-900">{item.pricing}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-slate-400 uppercase text-[10px]">Listing Tier:</span>
          <span className="font-bold text-slate-800 uppercase text-[11px]">{item.tier}</span>
        </div>
        {submitter?.name && (
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-400 uppercase text-[10px]">Maker:</span>
            <span className="font-medium text-slate-900">{submitter.name}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        {/* Contextual Do-Follow Outbound Link */}
        <a
          href={item.websiteUrl}
          target="_blank"
          rel="noopener"
          title={`Visit ${item.name} Official Website`}
          className={cn(
            buttonVariants({ size: "default" }),
            "w-full gap-2 font-semibold text-xs shadow-2xs"
          )}
        >
          <span>Visit Official Website</span>
          <ExternalLink className="size-3.5" />
        </a>

        {/* Directory Profile Link */}
        <Link
          href={directoryHref}
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
            "w-full gap-1.5 text-xs font-medium text-slate-700"
          )}
        >
          <span>View Directory Profile</span>
          <ArrowUpRight className="size-3.5 text-slate-400" />
        </Link>

        {/* GitHub Repository if present */}
        {item.githubUrl && (
          <a
            href={item.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "w-full text-xs text-slate-500 hover:text-slate-900 gap-1.5"
            )}
          >
            <GithubIcon className="size-3.5" />
            <span>GitHub Repository</span>
          </a>
        )}
      </div>
    </div>
  )
}
