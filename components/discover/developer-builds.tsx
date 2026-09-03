import { Eye, Heart, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { DEVELOPER_BUILDS } from "@/constants/products"

export const DeveloperBuilds = () => {
  return (
    <section>
      <SectionHeader
        title="See what developers are building"
        subtitle="Real products built with the tools developers love"
        viewAllText="View all builds"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {DEVELOPER_BUILDS.map((build) => (
          <Card
            key={build.name}
            className="group flex cursor-pointer flex-col rounded-none bg-white transition-colors hover:border-slate-300"
          >
            <CardContent className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                    build.logoBg
                  )}
                >
                  {build.logo}
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <h3 className="truncate font-bold text-slate-900">
                    {build.name}
                  </h3>
                  <VerifiedBadge tier={build.tier} />
                </div>
              </div>
              <p className="line-clamp-2 text-sm font-medium text-slate-500">
                {build.desc}
              </p>
              <div className="mt-auto pt-2">
                <p className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Built with
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {build.builtWith.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-slate-400">
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <Eye className="size-3.5" /> {build.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="size-3.5" /> {build.likes}
                  </span>
                </div>
                <ExternalLink className="size-3.5 hover:text-slate-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
