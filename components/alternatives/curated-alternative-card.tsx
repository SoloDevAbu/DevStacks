import { ExternalLink, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductLogo } from "@/components/shared/product-logo"
import { cn } from "@/lib/utils"
import { TIER } from "@/constants/plans"
import {
  cardTagBadge,
  cardTagIcon,
  cardTagsGroup,
  directoryCard,
  directoryCardContent,
  pricingBadgeColor,
  tierCardBg,
  tierContentBg,
  cardPricingBadge,
  cardLogo,
} from "@/utils/styles"
import { NOFOLLOW_LINK_REL, getFaviconUrl, getOutboundUrl } from "@/utils/urls"
import type { CuratedAlternative } from "@/types/alternatives"

interface CuratedAlternativeCardProps {
  alternative: CuratedAlternative
  index: number
}

// Same row layout as ToolCard, for alternatives that are not listed on LaunchNests.
export const CuratedAlternativeCard = ({
  alternative,
  index,
}: CuratedAlternativeCardProps) => {
  const outboundUrl = getOutboundUrl(alternative.websiteUrl)
  const visitLabel = `Visit ${alternative.name} website`

  return (
    <Card
      className={cn(
        directoryCard,
        "cursor-default",
        tierCardBg(TIER.FREE),
        index > 0 && "-mt-px"
      )}
    >
      <CardContent
        className={cn(directoryCardContent, tierContentBg(TIER.FREE))}
      >
        <div className="hidden w-6 shrink-0 sm:flex sm:items-center sm:justify-center">
          <div className="w-5 text-center text-xs font-semibold text-slate-400">
            {index + 1}
          </div>
        </div>

        <a
          href={outboundUrl}
          target="_blank"
          rel={NOFOLLOW_LINK_REL}
          className="shrink-0 transition-opacity hover:opacity-80"
          title={visitLabel}
        >
          <ProductLogo
            text={alternative.name.slice(0, 2).toUpperCase()}
            bgColor="bg-slate-900"
            textColor="text-white"
            imageUrl={getFaviconUrl(alternative.websiteUrl)}
            websiteUrl={alternative.websiteUrl}
            alt={alternative.name}
            className={cardLogo}
          />
        </a>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:gap-1">
          <h3 className="min-w-0 truncate text-sm font-bold text-slate-900 sm:text-base">
            <a
              href={outboundUrl}
              target="_blank"
              rel={NOFOLLOW_LINK_REL}
              className="inline-flex min-w-0 items-center gap-1.5 transition-colors hover:text-indigo-600"
              title={visitLabel}
              aria-label={visitLabel}
            >
              <span className="truncate">{alternative.name}</span>
              <ExternalLink className="size-3 shrink-0 text-slate-400" />
            </a>
          </h3>

          <p className="line-clamp-1 text-xs font-normal text-slate-500 sm:text-sm">
            {alternative.bestFor}
          </p>

          {alternative.tags.length > 0 && (
            <div className="mt-0.5 flex min-w-0 flex-nowrap items-center gap-2 overflow-hidden sm:mt-1.5 sm:gap-2.5">
              <div className={cardTagsGroup}>
                <Tag className={cardTagIcon} />
                <div className="flex min-w-0 flex-nowrap items-center gap-1 overflow-hidden sm:gap-1.5">
                  {alternative.tags.map((tag, tagIdx) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className={cn(
                        cardTagBadge,
                        tagIdx > 1 && "hidden sm:inline-flex"
                      )}
                    >
                      <span className="truncate">{tag}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="ml-2 flex shrink-0 flex-col items-end gap-1.5 sm:ml-4 sm:gap-2">
          <Badge
            variant="outline"
            className={cn(
              cardPricingBadge,
              pricingBadgeColor(alternative.pricing)
            )}
          >
            {alternative.pricing}
          </Badge>
          <span className="text-[10px] font-medium text-slate-500 sm:text-xs">
            {alternative.license}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
