import Link from "next/link"
import { ChevronDown } from "lucide-react"

export function HeaderNav() {
  return (
    <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
      <Link href="#" className="flex items-center gap-1 text-foreground">
        Product <ChevronDown className="size-4 opacity-50" />
      </Link>
      <Link href="#" className="flex items-center gap-1 hover:text-foreground">
        Resources <ChevronDown className="size-4 opacity-50" />
      </Link>
      <Link href="#" className="hover:text-foreground">Customers</Link>
      <Link href="#" className="hover:text-foreground">Docs</Link>
      <Link href="#" className="hover:text-foreground">Changelog</Link>
      <Link href="#" className="hover:text-foreground">Pricing</Link>
    </nav>
  )
}
