import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeaderActions() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/submit" className="text-sm font-medium hover:text-slate-900 text-muted-foreground">
        Submit
      </Link>
      <Button variant="outline" className="rounded-md border-dashed border-slate-300">
        Sign In
      </Button>
    </div>
  )
}
