import { Card, CardContent } from "@/components/ui/card"
import { Megaphone, Sparkles, Clock } from "lucide-react"

export const RightSidebar = () => {
  return (
    <div className="flex flex-col gap-8 p-8 xl:p-10">
      
      {/* Featured / Promoted */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="size-4" /> Featured
        </div>
        <Card className="p-0 border-dashed">
          <CardContent className="px-5 py-4 flex items-start gap-3">
             <div className="flex size-10 items-center justify-center bg-indigo-100 text-lg font-bold text-indigo-700 shrink-0 border border-indigo-200">
              P
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-sm">ProductRank Pro</div>
              <div className="text-xs text-muted-foreground leading-snug">Instant SEO audits and ranking insights for your landing page.</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ads */}
      <div className="flex flex-col gap-4">
        <Card className="bg-slate-50/80 p-8 text-center flex flex-col items-center justify-center gap-2">
          <Megaphone className="size-6 text-muted-foreground" />
          <div className="font-semibold text-sm">Your ad here</div>
          <div className="text-xs text-muted-foreground">Reach 50,000+ builders</div>
        </Card>
      </div>
      
      {/* Recently Promoted */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Clock className="size-4" /> Recently Promoted
        </div>
        <Card className="p-0 border-dashed">
          <CardContent className="px-5 py-4 flex flex-col gap-3">
             <div className="flex items-center gap-3">
                 <div className="flex size-8 items-center justify-center bg-blue-100 text-sm font-bold text-blue-700 shrink-0 border border-blue-200 rounded">
                  C
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-sm">CloudScale</div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                 <div className="flex size-8 items-center justify-center bg-green-100 text-sm font-bold text-green-700 shrink-0 border border-green-200 rounded">
                  L
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-sm">LaunchFast</div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
