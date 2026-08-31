import { Button } from "@/components/ui/button"

export function HeaderActions() {
  return (
    <div className="flex items-center gap-4">
      <Button className="rounded-md bg-slate-800 hover:bg-slate-700 text-white shadow-sm">
        Add Product <span className="ml-2 rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-semibold opacity-70">A</span>
      </Button>
    </div>
  )
}
