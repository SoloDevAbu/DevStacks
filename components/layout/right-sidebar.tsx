import { SidebarAdCard } from "@/components/ads/sidebar-ad-card"
import { SidebarFeaturedLaunches } from "@/components/layout/sidebar-featured-launches"

export const RightSidebar = () => {
  return (
    <div className="flex h-full flex-col gap-6 p-6 xl:p-7">
      {/* 1. Dynamic Sponsored Ads and Promotion Card */}
      <SidebarAdCard />

      {/* 2. Premium & Premium+ Weekly Launches */}
      <SidebarFeaturedLaunches />
    </div>
  )
}
