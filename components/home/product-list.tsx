import { ArrowUp, BadgeCheck, Bookmark, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function HoverOutline() {
  return (
    <div className="pointer-events-none absolute -inset-[6px] z-0 opacity-0 transition-opacity group-hover/btn:opacity-100">
      <div className="absolute top-0 left-0 h-2 w-2 border-l-2 border-t-2 border-slate-500" />
      <div className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-slate-500" />
      <div className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-slate-500" />
      <div className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-slate-500" />
    </div>
  )
}

export type Product = {
  id: string
  rank: number
  name: string
  tagline: string
  comments: number
  tags: string[]
  upvotes: number
  logo: React.ReactNode
}

export function ProductList({
  products,
  showMedals = false,
  showTrendingBadge = true,
}: {
  products: Product[]
  showMedals?: boolean
  showTrendingBadge?: boolean
}) {
  return (
    <div className="flex flex-col">
      {products.map((product, index) => {
        // Mock data to match the screenshot perfectly
        const tier = index % 3 === 0 ? "free" : index % 3 === 1 ? "premium" : "premium+"
        const isVerified = tier !== "free"
        const isTrending = index < 2
        const pricing =
          index % 4 === 0
            ? "Free"
            : index % 4 === 1
            ? "Freemium"
            : index % 4 === 2
            ? "Paid"
            : "Open Source"
        const pricingColor =
          pricing === "Free"
            ? "bg-emerald-100/50 text-emerald-700"
            : pricing === "Freemium"
            ? "bg-green-100/50 text-green-700"
            : pricing === "Paid"
            ? "bg-indigo-100/50 text-indigo-700"
            : "bg-blue-100/50 text-blue-700"

        const views = (product.upvotes * 11.6 / 1000).toFixed(1) + "K"

        return (
          <Card
            key={product.id}
            className={cn(
              "group relative z-0 rounded-none p-0 transition-colors",
              tier === "free" ? "hover:bg-slate-50/50" : 
              tier === "premium" ? "bg-blue-50/50 hover:bg-blue-100/50" : 
              "bg-amber-50/50 hover:bg-amber-100/50",
              index > 0 && "-mt-px"
            )}
          >
            <CardContent className={cn(
              "flex items-center gap-4 px-6 py-5 backdrop-blur-sm md:gap-6 relative overflow-hidden",
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
            {/* Rank */}
            <div className="hidden w-6 shrink-0 sm:flex sm:items-center sm:justify-center">
              <div
                className={cn(
                  "flex items-center justify-center text-sm font-bold",
                  showMedals && product.rank === 1
                    ? "size-6 rounded-full bg-amber-400 text-white"
                    : showMedals && product.rank === 2
                    ? "size-6 rounded-full bg-slate-300 text-white"
                    : showMedals && product.rank === 3
                    ? "size-6 rounded-full bg-orange-400 text-white"
                    : "w-4 text-slate-400"
                )}
              >
                {product.rank}
              </div>
            </div>

            {/* Logo */}
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-900 text-white">
              {product.logo}
            </div>

            {/* Main Content */}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {/* Title Row */}
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-bold text-slate-900">
                  {product.name}
                </h3>
                {isVerified && (
                  <BadgeCheck
                    className={cn(
                      "size-4 text-white",
                      tier === "premium+" ? "fill-amber-500" : "fill-blue-500"
                    )}
                  />
                )}
                {showTrendingBadge && isTrending && (
                  <Badge variant="outline" className="flex items-center gap-0.5 rounded-none border-transparent bg-green-100/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700 hover:bg-green-100/50">
                    <ArrowUp className="size-3" /> TRENDING
                  </Badge>
                )}
              </div>

              {/* Tagline */}
              <p className="line-clamp-1 text-sm font-medium text-slate-500">
                {product.tagline}
              </p>

              {/* Tags and Views */}
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-none bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
                <div className="ml-2 flex items-center gap-1.5 text-sm font-semibold text-slate-400">
                  <Eye className="size-4" />
                  {views}
                </div>
              </div>
            </div>

            {/* Right Side Stats & Actions */}
            <div className="ml-4 flex shrink-0 flex-col items-end gap-2.5">
              {/* Pricing Badge */}
              <Badge
                variant="outline"
                className={cn(
                  "rounded-none border-transparent px-2.5 py-1 text-[11px]",
                  pricingColor
                )}
              >
                {pricing}
              </Badge>

              <div className="flex items-center gap-2">
                <div className="group/btn relative inline-flex">
                  <button className="relative z-10 flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50">
                    <ArrowUp className="size-4 text-slate-400" />
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
  )
}
