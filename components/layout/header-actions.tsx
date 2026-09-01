import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeaderActions() {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/submit"
        className="bg-gray-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
      >
        List a Product
      </Link>
      <Button
        variant="outline"
        className="rounded-md border-dashed border-slate-300"
      >
        Sign In
      </Button>
    </div>
  )
}
