import { Rocket } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { TodaysLaunchesSection } from "@/components/home/todays-launches-section"
import { WeeklyLaunchesSection } from "@/components/home/weekly-launches-section"
import { PopularBuildingBlocksSection } from "@/components/home/popular-building-blocks-section"
import { AI_PROMPTS } from "@/lib/prompts"
import { heroStatPill } from "@/utils/styles"
import type { FeedItem } from "@/components/shared/feed-card"

interface MainContentProps {
  todaysLaunches: FeedItem[]
  weeklyLaunches: FeedItem[]
  popularBuildingBlocks: FeedItem[]
}

export const MainContent = ({
  todaysLaunches,
  weeklyLaunches,
  popularBuildingBlocks,
}: MainContentProps) => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="What's launching"
        description="Discover developer tools, APIs, and products launching on DevStacks — ranked by community votes, updated every minute."
        aiPrompt={AI_PROMPTS.home}
        variant="home"
        askAiLabel="ASK AI"
        metrics={
          <>
            <div className={heroStatPill}>
              <span className="font-bold text-slate-900">Live Launches</span>
              <span className="text-slate-500">Tools & Products</span>
            </div>
          </>
        }
      />

      <div className="flex w-full flex-1 flex-col">
        <TodaysLaunchesSection items={todaysLaunches} />
        <WeeklyLaunchesSection initialItems={weeklyLaunches} />
        <PopularBuildingBlocksSection items={popularBuildingBlocks} />
      </div>
    </div>
  )
}
