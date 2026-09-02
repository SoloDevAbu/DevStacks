import { AI_PROMPTS } from "@/lib/prompts"
import { PageHeader } from "@/components/shared/page-header"
import { CategoriesSearch } from "./categories-search"
import { PopularBuildingBlocks } from "./popular-building-blocks"
import { DeveloperBuilds } from "./developer-builds"
import { RecentlyAdded } from "./recently-added"
import { TrendingNow } from "./trending-now"

export function DiscoverContent() {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Discover Products"
        description="Find new tools, APIs, and infrastructure to build your next big idea"
        aiPrompt={AI_PROMPTS.discover}
      />

      <CategoriesSearch />

      <div className="flex w-full flex-1 flex-col">
        <div className="border-b border-dashed border-border px-6 py-8 md:px-8">
          <PopularBuildingBlocks />
        </div>
        
        <div className="border-b border-dashed border-border px-6 py-8 md:px-8">
          <DeveloperBuilds />
        </div>

        <div className="border-b border-dashed border-border px-6 py-8 md:px-8">
          <RecentlyAdded />
        </div>
        
        <div className="px-6 py-8 md:px-8">
          <TrendingNow />
        </div>
      </div>
    </div>
  )
}
