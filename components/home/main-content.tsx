import { PageHeader } from "@/components/shared/page-header"
import { NewAndRisingSection } from "@/components/home/new-and-rising-section"
import { RisingToolsSection } from "@/components/home/rising-tools-section"
import { DeveloperBuildsSection } from "@/components/home/developer-builds-section"
import { RecentlyAddedSection } from "@/components/home/recently-added-section"
import { PopularBuildingBlocksSection } from "@/components/home/popular-building-blocks-section"
import { FaqSection } from "@/components/home/faq-section"
import { AI_PROMPTS } from "@/lib/prompts"

export const MainContent = () => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Discover what you can build with"
        description="Discover developer tools, APIs, and infrastructure, and the products people are already building with them"
        aiPrompt={AI_PROMPTS.home}
      />

      <div className="flex w-full flex-1 flex-col">
        {/* 1. ✨ New & Rising */}
        <NewAndRisingSection />

        {/* 2. 🚀 Rising Tools */}
        <RisingToolsSection />

        {/* 3. 🔗 See What Developers Are Building */}
        <DeveloperBuildsSection />

        {/* 4. 🆕 Recently Added */}
        <RecentlyAddedSection />

        {/* 5. 🔥 Popular Building Blocks */}
        <PopularBuildingBlocksSection />
      </div>

      <FaqSection />
    </div>
  )
}
