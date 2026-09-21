import { PageAiCopilot } from "@/components/shared/page-ai-copilot"
import { SidebarAdCard } from "@/components/ads/sidebar-ad-card"

export const RightSidebar = () => {
  return (
    <div className="flex h-full flex-col justify-between gap-6 p-6 xl:p-7">
      {/* 1. Interactive AI Page Copilot */}
      {/* <PageAiCopilot /> */}

      {/* 2. Dynamic Sponsored Ad Card with fallback */}
      <SidebarAdCard />
    </div>
  )
}
