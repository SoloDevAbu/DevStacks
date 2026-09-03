import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants/routes"

export const HeaderNav = () => {
  return (
    <nav className="flex w-full items-center justify-around gap-6 text-sm font-medium text-muted-foreground">
      <div className="relative w-full max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-9 w-full rounded-none border border-dashed border-slate-200 bg-slate-50 pr-4 pl-9 focus-visible:border-slate-400 focus-visible:ring-0"
          placeholder="Search products..."
        />
      </div>
      <Link
        href={ROUTES.PRICING}
        className="shrink-0 font-semibold text-slate-900 hover:text-foreground"
      >
        Pricing
      </Link>
    </nav>
  )
}
