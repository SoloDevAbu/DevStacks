import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, MessageSquare, Tag } from "lucide-react"
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

export function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="flex flex-col">
      {products.map((product, index) => (
        <Card key={product.id} className={cn("p-0 rounded-none relative z-0", index > 0 && "-mt-px")}>
          <CardContent className="flex items-center gap-4 bg-white/50 px-6 py-3 backdrop-blur-sm md:gap-6">
            <div className="hidden w-6 shrink-0 text-center text-sm font-bold text-muted-foreground sm:block">
              #{product.rank}
            </div>
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-slate-100">
              {product.logo}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <h3 className="text-base font-bold truncate">{product.name}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{product.tagline}</p>
              <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="size-3.5" /> {product.comments}
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Tag className="size-3.5" /> <span className="truncate">{product.tags.join(", ")}</span>
                </div>
              </div>
            </div>
            <button className="flex flex-col items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 w-14 py-2 shrink-0 transition-colors">
              <ArrowUp className="size-4 mb-1 text-slate-700" />
              <span className="font-bold text-sm">{product.upvotes}</span>
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
