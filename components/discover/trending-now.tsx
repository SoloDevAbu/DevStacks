import { Eye, Heart, Bookmark } from "lucide-react"
import { TRENDING_PRODUCTS } from "@/components/home/main-content"
import { VerifiedBadge, SectionHeader, HoverOutline } from "./shared"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function TrendingNow() {
  return (
    <section>
      <SectionHeader
        title="Trending right now"
        subtitle="Top trending products across the ecosystem"
        viewAllText="View all trending"
      />
      <div className="flex flex-col">
        {TRENDING_PRODUCTS.slice(0, 3).map((product, index) => {
          const tier = index === 0 ? "premium+" : index === 1 ? "premium" : "free"
          const views = ((product.upvotes * 11.6) / 1000).toFixed(1) + "K"
          // Mock data for the trending builds as requested
          const builtWith = index === 0 ? ["Next.js", "Supabase"] : index === 1 ? ["React", "Stripe"] : ["Vue", "Firebase"]
          const pricing = index === 0 ? "Freemium" : index === 1 ? "Paid" : "Open Source"
          
          const pricingColor =
            pricing === "Free" || pricing === "Open Source"
              ? "bg-emerald-100/50 text-emerald-700"
              : pricing === "Freemium"
              ? "bg-green-100/50 text-green-700"
              : pricing === "Paid"
              ? "bg-indigo-100/50 text-indigo-700"
              : "bg-blue-100/50 text-blue-700"

          return (
            <Card
              key={product.id}
              className={cn(
                "group relative z-0 rounded-none p-0 transition-colors border",
                tier === "free" ? "hover:bg-slate-50/50" : 
                tier === "premium" ? "bg-blue-50/50 hover:bg-blue-100/50" : 
                "bg-amber-50/50 hover:bg-amber-100/50",
                index > 0 && "-mt-px"
              )}
            >
              <CardContent className={cn(
                "flex items-center gap-4 p-4 backdrop-blur-sm relative overflow-hidden",
                tier === "free" ? "bg-white/50" : "bg-transparent"
              )}>
                {/* Shimmer Effect */}
                {tier !== "free" && (
                  <div className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite]",
                        tier === "premium"
                          ? "bg-[linear-gradient(110deg,transparent_35%,rgba(219,234,254,0.6)_50%,transparent_65%)]"
                          : "bg-[linear-gradient(110deg,transparent_35%,rgba(254,243,199,0.6)_50%,transparent_65%)]"
                      )}
                    />
                  </div>
                )}

                <div className="w-5 shrink-0 text-center text-sm font-bold text-slate-500">
                  {index + 1}
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-900 text-white">
                  {product.logo}
                </div>
                
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {product.name}
                    </h3>
                    <VerifiedBadge tier={tier} />
                  </div>
                  
                  <p className="line-clamp-1 text-xs font-medium text-slate-500">
                    {product.tagline}
                  </p>
                  
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Built with
                      </span>
                      <div className="flex items-center gap-1">
                        {builtWith.map((tool) => (
                          <Badge key={tool} variant="secondary" className="px-1.5 py-0 text-[9px] rounded-none">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                      <Eye className="size-3" /> {views}
                    </span>
                  </div>
                </div>

                <div className="ml-4 flex shrink-0 flex-col items-end gap-2.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-none border-transparent px-2.5 py-1 text-[11px] font-bold uppercase",
                      pricingColor
                    )}
                  >
                    {pricing}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <div className="group/btn relative inline-flex">
                      <button className="relative z-10 flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-red-500">
                        <Heart className="size-4" />
                        {product.upvotes.toLocaleString()}
                      </button>
                      <HoverOutline />
                    </div>

                    <div className="group/btn relative inline-flex">
                      <button className="relative z-10 flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600">
                        <Bookmark className="size-4" />
                      </button>
                      <HoverOutline />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
