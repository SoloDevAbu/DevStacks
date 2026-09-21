import { Rocket } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { TodaysLaunchesSection } from "@/components/home/todays-launches-section"
import { WeeklyLaunchesSection } from "@/components/home/weekly-launches-section"
import { PopularBuildingBlocksSection } from "@/components/home/popular-building-blocks-section"
import { AI_PROMPTS } from "@/lib/prompts"
import { SITE_CONFIG } from "@/constants/site"
import { heroStatPill } from "@/utils/styles"
import type { FeedItem } from "@/components/shared/feed-card"

// VERSION A — Tabbed (Today + This Week in a single tab switcher)
import { LaunchesTabsSection } from "@/components/home/launches-tabs-section"

// VERSION B — Stacked (Today and This Week as separate sections)
// import { TodaysLaunchesSection } from "@/components/home/todays-launches-section"
// import { WeeklyLaunchesSection } from "@/components/home/weekly-launches-section"

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
        heading="GET DISCOVERED BY HUMANS AND AI"
        description={`Launch your product once on ${SITE_CONFIG.name}. Get discovered by developers,
search engines, and AI systems looking for tools like yours.`}
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
        {/* ── VERSION A: Tabbed layout (commented out until daily launch volume ramps up) ── */}
        {/*
        <LaunchesTabsSection
          todaysLaunches={todaysLaunches}
          weeklyLaunches={weeklyLaunches}
        />
        */}

        {/* ── Weekly Launches Only ─────────────────────────────────────── */}
        {/* <TodaysLaunchesSection items={todaysLaunches} /> */}
        <WeeklyLaunchesSection initialItems={weeklyLaunches} />

        <PopularBuildingBlocksSection items={popularBuildingBlocks} />
      </div>
    </div>
  )
}
