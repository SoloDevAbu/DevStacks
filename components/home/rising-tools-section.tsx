"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { SectionHeader } from "@/components/shared/section-header"
import { ToolCard, type DbTool } from "@/components/shared/tool-card"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { useRisingTools } from "@/hooks/home/use-rising-tools"

export const RisingToolsSection = () => {
  const { data, isLoading } = useRisingTools({
    limit: HOMEPAGE_LIMITS.RISING_TOOLS,
  })
  const tools = (data ?? []) as DbTool[]

  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="Rising Tools"
        subtitle="Developer tools gaining momentum right now"
        viewAllText="View all tools"
        viewAllHref={ROUTES.DISCOVER_RISING_TOOLS}
      />
      <div className="-mt-px flex flex-col">
        {isLoading ? (
          Array.from({ length: HOMEPAGE_LIMITS.RISING_TOOLS }).map((_, i) => (
            <Card
              key={i}
              className={cn(
                "h-24 animate-pulse rounded-none border border-slate-200 bg-slate-50/50",
                i > 0 && "-mt-px"
              )}
            />
          ))
        ) : tools.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-8 text-center text-sm text-slate-400">
            No tools gaining momentum yet.
          </div>
        ) : (
          tools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={index}
              showMedals={false}
              showTrendingBadge
            />
          ))
        )}
      </div>
    </section>
  )
}
