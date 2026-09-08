import { Card, CardContent } from "@/components/ui/card"
import { Megaphone, Sparkles, Clock } from "lucide-react"

export const RightSidebar = () => {
  return (
    <div className="flex flex-col gap-8 p-8 xl:p-10">
      {/* Featured / Promoted */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
          <Sparkles className="size-4" /> Featured
        </div>
        <Card className="border-dashed p-0">
          <CardContent className="flex items-start gap-3 px-5 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center border border-indigo-200 bg-indigo-100 text-lg font-bold text-indigo-700">
              P
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-semibold">ProductRank Pro</div>
              <div className="text-xs leading-snug text-muted-foreground">
                Instant SEO audits and ranking insights for your landing page.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ads */}
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col items-center justify-center gap-2 bg-slate-50/80 p-8 text-center">
          <Megaphone className="size-6 text-muted-foreground" />
          <div className="text-sm font-semibold">Your ad here</div>
          <div className="text-xs text-muted-foreground">
            Reach 50,000+ builders
          </div>
        </Card>
      </div>

      {/* Recently Promoted */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
          <Clock className="size-4" /> Recently Promoted
        </div>
        <Card className="border-dashed p-0">
          <CardContent className="flex flex-col gap-3 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded border border-blue-200 bg-blue-100 text-sm font-bold text-blue-700">
                C
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-semibold">CloudScale</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded border border-green-200 bg-green-100 text-sm font-bold text-green-700">
                L
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-semibold">LaunchFast</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
