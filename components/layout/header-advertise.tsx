import Link from "next/link"
import { Megaphone, ArrowUpRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"

export const HeaderAdvertise = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-slate-500 uppercase">
        <Megaphone className="size-3.5 text-indigo-600" />
        <span>Sponsor</span>
      </div>
      <Button
        className="rounded-lg border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-2xs transition-all hover:border-indigo-300 hover:bg-indigo-100 active:scale-[0.98]"
        nativeButton={false}
        render={<Link href={ROUTES.PRICING} />}
      >
        <Sparkles className="mr-1.5 size-3.5 text-indigo-500" />
        Advertise
        <ArrowUpRight className="ml-1 size-3 text-indigo-400" />
      </Button>
    </div>
  )
}
