import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { BUILDING_BLOCKS } from "@/constants/products"

export const PopularBuildingBlocks = () => {
  return (
    <section>
      <SectionHeader
        title="Popular building blocks"
        subtitle="The most used tools by developers"
        viewAllText="View all tools"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
        {BUILDING_BLOCKS.map((block) => (
          <Card
            key={block.name}
            className="group cursor-pointer rounded-none bg-white transition-colors hover:border-slate-300"
          >
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold",
                    block.logoBg
                  )}
                >
                  {block.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {block.name}
                    </h3>
                    <VerifiedBadge tier={block.tier} />
                  </div>
                  <p className="text-xs font-semibold text-blue-600">
                    {block.builds} builds
                  </p>
                </div>
              </div>
              <p className="mt-auto text-xs font-medium text-slate-500">
                {block.category}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
