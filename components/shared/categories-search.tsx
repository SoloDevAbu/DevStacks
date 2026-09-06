import Link from "next/link"
import {
  Sparkles,
  CreditCard,
  Database,
  LineChart,
  Shield,
  Cloud,
  Mail,
  Webhook,
  MoreHorizontal,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HoverOutline } from "@/components/shared/hover-outline"
import { ROUTES } from "@/constants/routes"
import type { Category } from "@/constants/types"

const CATEGORIES: Category[] = [
  { name: "AI", icon: Sparkles, color: "text-purple-500" },
  { name: "Payments", icon: CreditCard, color: "text-orange-500" },
  { name: "Database", icon: Database, color: "text-emerald-500" },
  { name: "Analytics", icon: LineChart, color: "text-rose-500" },
  { name: "Auth", icon: Shield, color: "text-blue-500" },
  { name: "Infra", icon: Cloud, color: "text-cyan-500" },
  { name: "Email", icon: Mail, color: "text-slate-500" },
  { name: "APIs", icon: Webhook, color: "text-indigo-500" },
  { name: "More", icon: MoreHorizontal, color: "text-slate-600" },
]

export const CategoriesSearch = ({
  placeholder = "Search tools, APIs, infrastructure...",
  baseRoute = ROUTES.PRODUCTS,
}: {
  placeholder?: string
  baseRoute?: string
}) => {
  return (
    <div className="border-b border-dashed border-border bg-white px-6 py-2 md:px-8">
      <div className="scrollbar-hide flex min-w-0 items-center gap-3 overflow-x-auto py-2">
        {CATEGORIES.map((cat) => {
          const href =
            cat.name === "More"
              ? ROUTES.CATEGORIES
              : `${baseRoute}?category=${encodeURIComponent(cat.name)}`
          return (
            <div
              key={cat.name}
              className="group/btn relative inline-flex shrink-0"
            >
              <Button
                variant="outline"
                className="relative z-10 gap-2 rounded-none border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-slate-700 hover:bg-slate-50"
                render={<Link href={href} />}
              >
                <cat.icon className={cn("size-4", cat.color)} />
                {cat.name}
              </Button>
              <HoverOutline />
            </div>
          )
        })}
        <div className="group/btn relative ml-auto inline-flex min-w-48 shrink-0">
          <div className="relative z-10 w-full">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder={placeholder}
              className="w-full rounded-none border-slate-200 bg-white py-1.5 pr-3 pl-9 text-sm placeholder:text-slate-400 focus:border-slate-300"
            />
          </div>
          <HoverOutline />
        </div>
      </div>
    </div>
  )
}
