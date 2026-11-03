import { PageHeader } from "@/components/shared/page-header"
import { WeeklyLaunchesSection } from "@/components/home/weekly-launches-section"
import { PopularBuildingBlocksSection } from "@/components/home/popular-building-blocks-section"
import { HomeLaunchSection } from "@/components/home/home-launch-section"
import { AI_PROMPTS } from "@/lib/prompts"
import { Badge } from "@/components/ui/badge"
import {
  HOME_HERO_HEADING,
  HOME_HERO_DESCRIPTION,
  HOME_HERO_BADGES,
} from "@/constants/home"
import { homeHeroBadge, homeHeroBadgeDot } from "@/utils/styles"
import type { FeedItem } from "@/components/shared/feed-card"
import type { LaunchWeekSnapshot } from "@/lib/launches/launch-week"
import { formatWeekTitle } from "@/utils/iso-weeks"
import { UpdatedTime } from "@/components/shared/updated-time"

interface MainContentProps {
  launchWeek: LaunchWeekSnapshot
  popularBuildingBlocks: FeedItem[]
}

export const MainContent = ({
  launchWeek,
  popularBuildingBlocks,
}: MainContentProps) => {
  const weekTitle = formatWeekTitle(launchWeek.year, launchWeek.week)

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading={HOME_HERO_HEADING}
        description={HOME_HERO_DESCRIPTION}
        aiPrompt={AI_PROMPTS.home}
        variant="home"
        askAiLabel="ASK AI"
        metrics={
          <>
            <p className="w-full text-xs text-slate-500">
              {weekTitle} · {launchWeek.items.length} launches ·{" "}
              <UpdatedTime date={launchWeek.lastUpdated} />
            </p>
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

      <HomeLaunchSection />

      <div className="flex w-full flex-1 flex-col">
        <WeeklyLaunchesSection
          items={launchWeek.items as FeedItem[]}
          year={launchWeek.year}
          week={launchWeek.week}
          weekTitle={weekTitle}
        />
        <PopularBuildingBlocksSection items={popularBuildingBlocks} />
      </div>
    </div>
  )
}
