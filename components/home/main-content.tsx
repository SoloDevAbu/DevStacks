import { PageHeader } from "@/components/shared/page-header"
import { NewAndRisingSection } from "@/components/home/new-and-rising-section"
import { RisingToolsSection } from "@/components/home/rising-tools-section"
import { DeveloperBuildsSection } from "@/components/home/developer-builds-section"
import { RecentlyAddedSection } from "@/components/home/recently-added-section"
import { PopularBuildingBlocksSection } from "@/components/home/popular-building-blocks-section"
import { FaqSection } from "@/components/home/faq-section"
import { AI_PROMPTS } from "@/lib/prompts"
import type { FeedItem } from "@/components/shared/feed-card"
import type { DbTool, DbProduct } from "@/types/entities"

interface MainContentProps {
  newAndRising: FeedItem[]
  risingTools: DbTool[]
  risingProducts: DbProduct[]
  recentlyAdded: FeedItem[]
  popularBuildingBlocks: FeedItem[]
}

export const MainContent = ({
  newAndRising,
  risingTools,
  risingProducts,
  recentlyAdded,
  popularBuildingBlocks,
}: MainContentProps) => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Discover what you can build with"
        description="Discover developer tools, APIs, and infrastructure, and the products people are already building with them"
        aiPrompt={AI_PROMPTS.home}
      />

      <div className="flex w-full flex-1 flex-col">
        <NewAndRisingSection items={newAndRising} />
        <RisingToolsSection tools={risingTools} />
        <DeveloperBuildsSection products={risingProducts} />
        <RecentlyAddedSection items={recentlyAdded} />
        <PopularBuildingBlocksSection items={popularBuildingBlocks} />
      </div>

      <FaqSection />
    </div>
  )
}
