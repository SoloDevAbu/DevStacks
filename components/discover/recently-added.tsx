import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { RECENTLY_ADDED } from "@/constants/products"

export const RecentlyAdded = () => {
  return (
    <section>
      <SectionHeader
        title="Recently added"
        subtitle="Fresh tools and products added by the community"
        viewAllText="View all"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {RECENTLY_ADDED.map((item) => (
          <Card
            key={item.name}
            className="group cursor-pointer rounded-none bg-white transition-colors hover:border-slate-300"
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                  item.logoBg
                )}
              >
                {item.logo}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-sm font-bold text-slate-900">
                    {item.name}
                  </h3>
                  <VerifiedBadge tier={item.tier} />
                </div>
                <p className="truncate text-xs font-medium text-slate-500">
                  {item.desc}
                </p>
              </div>
              <div className="shrink-0 rounded bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">
                {item.category}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
