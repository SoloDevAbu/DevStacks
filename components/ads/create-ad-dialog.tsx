"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  AD_PLACEMENT,
  AD_DURATION,
  SIDEBAR_AD_TIERS,
  FEED_AD_TIERS,
  getAdTierConfig,
  type AdPlacement,
  type AdDuration,
} from "@/constants/ads"
import { useCheckout } from "@/hooks/payments/use-checkout"
import { useSession, signIn } from "@/lib/auth/client"
import {
  adDurationSelectorWrapper,
  adDurationOption,
  sponsorCard,
} from "@/utils/styles"
import {
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Megaphone,
  CheckCircle2,
  Globe,
} from "lucide-react"

interface CreateAdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultPlacement?: AdPlacement
}

export const CreateAdDialog = ({
  open,
  onOpenChange,
  defaultPlacement = AD_PLACEMENT.SIDEBAR,
}: CreateAdDialogProps) => {
  const { data: session } = useSession()
  const { mutate: initiateCheckout, isPending } = useCheckout()

  const [placement, setPlacement] = useState<AdPlacement>(defaultPlacement)
  const [duration, setDuration] = useState<AdDuration>(AD_DURATION.MONTHLY)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [ctaText, setCtaText] = useState("Learn More")
  const [ctaUrl, setCtaUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [badgeText, setBadgeText] = useState("PROMOTED")

  const currentTierConfig = getAdTierConfig(placement, duration)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user) {
      signIn.social({ provider: "google" })
      return
    }

    initiateCheckout({
      paymentType: "ad",
      placement,
      duration,
      title,
      description,
      badgeText: badgeText || "PROMOTED",
      imageUrl: imageUrl || undefined,
      ctaText: ctaText || "Learn More",
      ctaUrl,
    })
  }

  const isFormValid =
    title.trim().length >= 3 &&
    description.trim().length >= 10 &&
    ctaUrl.trim().startsWith("http")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <Megaphone className="size-4" />
            </span>
            <DialogTitle className="text-base font-bold text-slate-900">
              Sponsor Dev Placement
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Reach thousands of developers, indie hackers, and software engineers
            evaluating new tools.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          {/* Placement Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Placement Spot
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPlacement(AD_PLACEMENT.SIDEBAR)}
                className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                  placement === AD_PLACEMENT.SIDEBAR
                    ? "border-indigo-600 bg-indigo-50/60 font-bold text-indigo-950 ring-1 ring-indigo-500/20"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="text-xs font-bold">Right Sidebar</span>
                <span className="text-[11px] text-slate-500">
                  Visible on all tool & showcase pages
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPlacement(AD_PLACEMENT.FEED)}
                className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                  placement === AD_PLACEMENT.FEED
                    ? "border-indigo-600 bg-indigo-50/60 font-bold text-indigo-950 ring-1 ring-indigo-500/20"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">Discovery Feed</span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0 border-indigo-200 text-indigo-700">
                    Native
                  </Badge>
                </div>
                <span className="text-[11px] text-slate-500">
                  Injected inside community stream
                </span>
              </button>
            </div>
          </div>

          {/* Duration & Pricing Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Duration & Pricing
            </Label>
            <div className={adDurationSelectorWrapper}>
              {/* Weekly option */}
              <div
                onClick={() => setDuration(AD_DURATION.WEEKLY)}
                className={adDurationOption(duration === AD_DURATION.WEEKLY)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    7 Days
                  </span>
                  <span className="text-xs font-extrabold text-indigo-600">
                    $
                    {placement === AD_PLACEMENT.SIDEBAR
                      ? SIDEBAR_AD_TIERS[AD_DURATION.WEEKLY].price
                      : FEED_AD_TIERS[AD_DURATION.WEEKLY].price}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {placement === AD_PLACEMENT.SIDEBAR
                    ? "1 week sidebar visibility"
                    : "1 week in discovery feed"}
                </p>
              </div>

              {/* Monthly option */}
              <div
                onClick={() => setDuration(AD_DURATION.MONTHLY)}
                className={adDurationOption(duration === AD_DURATION.MONTHLY)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      30 Days
                    </span>
                    <Badge className="bg-indigo-600 text-[9px] text-white px-1.5 py-0">
                      Popular
                    </Badge>
                  </div>
                  <span className="text-xs font-extrabold text-indigo-600">
                    $
                    {placement === AD_PLACEMENT.SIDEBAR
                      ? SIDEBAR_AD_TIERS[AD_DURATION.MONTHLY].price
                      : FEED_AD_TIERS[AD_DURATION.MONTHLY].price}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  30 consecutive days. Best ROI.
                </p>
              </div>
            </div>
          </div>

          {/* Ad Creative Details */}
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="ad-title" className="text-xs font-semibold text-slate-700">
                  Headline / Product Name *
                </Label>
                <span className="text-[10px] text-slate-400">
                  {title.length}/60
                </span>
              </div>
              <Input
                id="ad-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Supabase — Build in a weekend, Scale to billions"
                maxLength={60}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="ad-desc" className="text-xs font-semibold text-slate-700">
                  Ad Description / Copy *
                </Label>
                <span className="text-[10px] text-slate-400">
                  {description.length}/160
                </span>
              </div>
              <Textarea
                id="ad-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a concise value proposition for developers..."
                maxLength={160}
                rows={2}
                required
                className="text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="ad-cta-url" className="text-xs font-semibold text-slate-700">
                  Destination URL *
                </Label>
                <Input
                  id="ad-cta-url"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://yourtool.com?utm_source=launchnests"
                  type="url"
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="ad-cta-text" className="text-xs font-semibold text-slate-700">
                  CTA Button Text
                </Label>
                <Input
                  id="ad-cta-text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Try Free, Learn More"
                  maxLength={30}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="ad-image-url" className="text-xs font-semibold text-slate-700">
                  Logo / Image URL (Optional)
                </Label>
                <Input
                  id="ad-image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://yourtool.com/logo.png"
                  type="url"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="ad-badge-text" className="text-xs font-semibold text-slate-700">
                  Badge Label
                </Label>
                <Input
                  id="ad-badge-text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="PROMOTED or SPONSORED"
                  maxLength={20}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 p-3">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Live Preview
            </span>

            <div className={`mt-2 ${sponsorCard}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold tracking-wider text-indigo-700 uppercase">
                  {badgeText || "PROMOTED"}
                </span>
                <span className="rounded bg-indigo-100/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-800">
                  Featured
                </span>
              </div>

              <div className="mt-2 flex items-start gap-2.5">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title || "Sponsor Logo"}
                    className="size-8 shrink-0 rounded-md border border-slate-200 object-contain bg-white p-0.5"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = "none"
                    }}
                  />
                ) : (
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 text-indigo-600">
                    <Globe className="size-4" />
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {title || "Your Product Headline Here"}
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 line-clamp-2">
                    {description ||
                      "Your concise message reaching thousands of active software engineers and indie makers."}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-2xs">
                <span>{ctaText || "Learn More"}</span>
                <ArrowUpRight className="size-3.5" />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            {!session?.user ? (
              <Button
                type="button"
                onClick={() => signIn.social({ provider: "google" })}
                className="w-full bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Sign In with Google to Purchase (${currentTierConfig.price})
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isFormValid || isPending}
                className="w-full bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                {isPending ? (
                  <>
                    <Spinner className="mr-2 size-3.5" />
                    Connecting to Dodo Payments...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1.5 size-3.5" />
                    Pay ${currentTierConfig.price} via Dodo Payments
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
