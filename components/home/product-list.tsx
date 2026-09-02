import { ArrowUp, BadgeCheck, Bookmark, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
}: {
  products: Product[]
  showMedals?: boolean
}) {
  return (
    <div className="flex flex-col">
      {products.map((product, index) => {
        // Mock data to match the screenshot perfectly
        const isVerified = true
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
              "group relative z-0 rounded-none p-0 transition-colors hover:bg-slate-50/50",
              index > 0 && "-mt-px"
            )}
          >
            <CardContent className="flex items-start gap-4 bg-white/50 px-6 py-5 backdrop-blur-sm md:gap-6">
            {/* Rank */}
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-center sm:pt-4 w-6">
              <div
                className={cn(
                  "flex items-center justify-center text-sm font-bold",
                  showMedals && product.rank === 1
                    ? "size-6 rounded-full bg-amber-400 text-white -mt-1"
                    : showMedals && product.rank === 2
                    ? "size-6 rounded-full bg-slate-300 text-white -mt-1"
                    : showMedals && product.rank === 3
                    ? "size-6 rounded-full bg-orange-400 text-white -mt-1"
                    : "text-slate-400 w-4"
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
                  <BadgeCheck className="size-4 fill-blue-500 text-white" />
                )}
                {isTrending && (
                  <span className="flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
                    <ArrowUp className="size-3" /> TRENDING
                  </span>
                )}
              </div>

              {/* Tagline */}
              <p className="line-clamp-1 text-sm font-medium text-slate-500">
                {product.tagline}
              </p>

              {/* Tags */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Side Stats & Actions */}
            <div className="ml-4 flex shrink-0 items-start gap-8">
              {/* Stats Column */}
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                  <ArrowUp className="size-4 text-slate-400" />
                  {product.upvotes.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-400">
                  <Eye className="size-4" />
                  {views}
                </div>
              </div>

              {/* Actions Column */}
              <div className="flex flex-col items-end gap-3 pt-0.5">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                    pricingColor
                  )}
                >
                  {pricing}
                </span>
                <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 mt-1">
                  <Bookmark className="size-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        )
      })}
    </div>
  )
}
