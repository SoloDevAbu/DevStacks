import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function HeaderNav() {
  return (
    <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground w-full">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input 
          className="h-9 w-full pl-9 pr-4 rounded-none border border-dashed border-slate-200 bg-slate-50 focus-visible:ring-0 focus-visible:border-slate-400" 
          placeholder="Search products..."
        />
      </div>
      <Link href="/pricing" className="hover:text-foreground shrink-0">
        Pricing
      </Link>
    </nav>
  )
}
