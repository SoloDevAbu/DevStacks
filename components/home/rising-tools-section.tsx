import { SectionHeader } from "@/components/shared/section-header"
import { ToolCard } from "@/components/shared/tool-card"
import type { DbTool } from "@/types/entities"
import { ROUTES } from "@/constants/routes"

interface RisingToolsSectionProps {
  tools: DbTool[]
}

export const RisingToolsSection = ({ tools }: RisingToolsSectionProps) => {
  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="Rising Tools"
        subtitle="Developer tools gaining momentum right now"
        viewAllText="View all tools"
        viewAllHref={ROUTES.DISCOVER_RISING_TOOLS}
      />
      <div className="-mt-px flex flex-col">
        {tools.length === 0 ? (
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
