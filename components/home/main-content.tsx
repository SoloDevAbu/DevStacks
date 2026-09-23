import { PageHeader } from "@/components/shared/page-header"
import { WeeklyLaunchesSection } from "@/components/home/weekly-launches-section"
import { PopularBuildingBlocksSection } from "@/components/home/popular-building-blocks-section"
import { AI_PROMPTS } from "@/lib/prompts"
import { SITE_CONFIG } from "@/constants/site"
import { heroStatPill } from "@/utils/styles"
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
        heading="GET DISCOVERED BY HUMANS AND AI"
        description={`Launch your product once on ${SITE_CONFIG.name}. Get discovered by developers,
search engines, and AI systems looking for tools/products like yours.`}
        aiPrompt={AI_PROMPTS.home}
        variant="home"
        askAiLabel="ASK AI"
        metrics={
          <>
            <div className={heroStatPill}>
              <span className="text-slate-500">
                Permanent product page · Search visibility · AI discovery
              </span>
            </div>
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
