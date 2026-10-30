import { PageHeader } from "@/components/shared/page-header"
import { WeeklyLaunchesSection } from "@/components/home/weekly-launches-section"
import { PopularBuildingBlocksSection } from "@/components/home/popular-building-blocks-section"
import { AI_PROMPTS } from "@/lib/prompts"
import { Badge } from "@/components/ui/badge"
import { RotatingHeadline } from "@/components/home/rotating-headline"
import {
  HOME_HERO_DESCRIPTION,
  HOME_HERO_BADGES,
} from "@/constants/home"
import { homeHeroBadge, homeHeroBadgeDot } from "@/utils/styles"
import type { FeedItem } from "@/components/shared/feed-card"

interface MainContentProps {
  weeklyLaunches: FeedItem[]
  popularBuildingBlocks: FeedItem[]
}

export const MainContent = ({
  weeklyLaunches,
  popularBuildingBlocks,
}: MainContentProps) => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading={<RotatingHeadline />}
        description={HOME_HERO_DESCRIPTION}
        aiPrompt={AI_PROMPTS.home}
        variant="home"
        askAiLabel="ASK AI"
        metrics={
          <>
            {HOME_HERO_BADGES.map((badgeText) => (
              <Badge
                key={badgeText}
                variant="outline"
                className={homeHeroBadge}
              >
                <span className={homeHeroBadgeDot} />
                <span>{badgeText}</span>
              </Badge>
            ))}
          </>
        }
      />

      <div className="flex w-full flex-1 flex-col">
        <WeeklyLaunchesSection initialItems={weeklyLaunches} />
        <PopularBuildingBlocksSection items={popularBuildingBlocks} />
      </div>
    </div>
  )
}
