import { Wrench } from "lucide-react"
import { DetailSectionHeader } from "@/components/shared/detail-section-header"
import { ToolCard } from "@/components/shared/tool-card"
import type { DbTool } from "@/types/entities"

interface RelatedToolsSectionProps {
  tools: DbTool[]
  categoryName?: string | null
}

export const RelatedToolsSection = ({
  tools,
  categoryName,
}: RelatedToolsSectionProps) => {
  if (!tools || tools.length === 0) {
    return null
  }

  return (
    <section className="border-b border-dashed border-border bg-white">
      <DetailSectionHeader
        title={`Related Tools${categoryName ? ` in ${categoryName}` : ""}`}
        subtitle="Explore alternative and complementary developer tools in this category"
        icon={Wrench}
        theme="blue"
      />
      <div className="flex flex-col">
        {tools.map((tool, idx) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            index={idx}
            showMedals={false}
            showTrendingBadge={false}
          />
        ))}
      </div>
    </section>
  )
}
