import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, ArrowRight, LayoutDashboard, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: `Payment Confirmed — ${SITE_CONFIG.name}`,
  description: "Your payment was processed successfully via Dodo Payments.",
  robots: {
    index: false,
    follow: false,
  },
}

const CheckoutSuccessPage = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 sm:p-10">
      <Card className="mx-auto w-full max-w-lg rounded-xl border border-emerald-200/80 bg-linear-to-b from-emerald-50/40 via-white to-white p-6 shadow-sm sm:p-8">
        <CardHeader className="p-0 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-2xs">
            <CheckCircle2 className="size-8" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/60">
              <Sparkles className="mr-1 size-3" /> Confirmed via Dodo Payments
            </Badge>
          </div>

          <CardTitle className="mt-3 text-xl font-extrabold text-slate-900 sm:text-2xl">
            Payment Successful!
          </CardTitle>
          <CardDescription className="mt-1 text-xs text-slate-600 sm:text-sm">
            Thank you for supporting {SITE_CONFIG.name}. Your campaign / upgrade
            is being activated across our developer directory.
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-6 rounded-lg border border-dashed border-emerald-200/60 bg-emerald-50/30 p-4 text-xs text-slate-700">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-bold text-emerald-800">✓ Real-Time Activation:</span>
              <span>
                Ads go live immediately on the right sidebar across all visitor sessions.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-emerald-800">✓ Receipt Delivered:</span>
              <span>
                A receipt and invoice from Dodo Payments have been sent to your email.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-emerald-800">✓ Tracking & Clicks:</span>
              <span>
                Live impressions and clicks are tracked non-blockingly to protect site speed.
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-6 flex flex-col gap-2 p-0 sm:flex-row">
          <Button
            className="w-full bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
            nativeButton={false}
            render={<Link href={ROUTES.HOME} />}
          >
            <span>Browse Directory</span>
            <ArrowRight className="ml-1.5 size-3.5" />
          </Button>

          <Button
            variant="outline"
            className="w-full border-slate-200 text-xs font-semibold text-slate-700"
            nativeButton={false}
            render={<Link href={ROUTES.DASHBOARD} />}
          >
            <LayoutDashboard className="mr-1.5 size-3.5" />
            <span>Go to Dashboard</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CheckoutSuccessPage
