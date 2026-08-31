import { Blocks } from "lucide-react"

export function HeaderLogo() {
  return (
    <div className="flex items-center gap-2 font-semibold text-lg">
      <div className="flex size-8 items-center justify-center rounded bg-slate-200/50 text-slate-700">
        <Blocks className="size-5" />
      </div>
      DevStack
    </div>
  )
}
