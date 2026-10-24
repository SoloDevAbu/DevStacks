"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Copy, Check, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import {
  embedModalContainer,
  badgeShieldIconBox,
  badgePreviewContainer,
  badgeCodeContainer,
  badgePromptContainer,
} from "@/utils/styles"

interface EmbedBadgeDialogProps {
  isOpen: boolean
  onClose: () => void
  name: string
  slug: string
  type: "tool" | "product"
  websiteUrl?: string | null
  onBackToSubmit?: () => void
}

type BadgeStyle = "card" | "dark" | "ranked" | "shield"

export const EmbedBadgeDialog = ({
  isOpen,
  onClose,
  name,
  slug,
  type,
  websiteUrl,
  onBackToSubmit,
}: EmbedBadgeDialogProps) => {
  const router = useRouter()
  const [style, setStyle] = useState<BadgeStyle>("card")
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const entityPath = type === "tool" ? `tools/${slug}` : `products/${slug}`
  const canonicalUrl = `${SITE_CONFIG.url}/${entityPath}`
  const badgeImageUrl = `${SITE_CONFIG.url}/api/badge/${slug}?style=${style}&type=${type}`

  const embedCodeSnippet =
    style === "shield"
      ? `[![Featured on LaunchNests](${badgeImageUrl})](${canonicalUrl}?ref=badge)`
      : `<a href="${canonicalUrl}?ref=badge" target="_blank">\n  <img src="${badgeImageUrl}" alt="Featured on LaunchNests" />\n</a>`

  const aiPromptSnippet =
    style === "shield"
      ? `Add the LaunchNests featured badge to our GitHub README.md (e.g. near the top header or badges section).

Here is the Markdown embed code to insert:
[![Featured on LaunchNests](${badgeImageUrl})](${canonicalUrl}?ref=badge)`
      : `Add the LaunchNests featured badge to our landing page (e.g. in the footer or social proof section).
Ensure the link opens in a new tab with noopener referrer.

Here is the HTML embed code to insert:
<a href="${canonicalUrl}?ref=badge" target="_blank">
  <img src="${badgeImageUrl}" alt="Featured on LaunchNests" />
</a>

Style it cleanly matching our site design.`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet)
    setCopiedCode(true)
    toast.success("Embed Code Copied", "Paste it into your website or README.")
    setTimeout(() => setCopiedCode(false), 2500)
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPromptSnippet)
    setCopiedPrompt(true)
    toast.success(
      "AI Prompt Copied",
      "Paste into Cursor, Claude, or ChatGPT to add the badge automatically."
    )
    setTimeout(() => setCopiedPrompt(false), 2500)
  }

  const handleVerifyBadge = async () => {
    if (!websiteUrl) {
      toast.error(
        "Website URL Missing",
        "Please update your listing website URL to verify."
      )
      return
    }

    setIsVerifying(true)
    try {
      const res = await fetch("/api/badge/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: websiteUrl, slug, type }),
      })
      const data = await res.json()

      if (data.verified) {
        setIsVerified(true)
        toast.success(
          "Badge Verified!",
          "Your badge has been verified. Your listing now has a permanent do-follow SEO link!"
        )
      } else {
        toast.error(
          "Badge Not Detected",
          data.message ||
            "We couldn't detect the badge snippet at that URL. Ensure the page is published."
        )
      }
    } catch {
      toast.error(
        "Verification Error",
        "Network error checking website. Please try again."
      )
    } finally {
      setIsVerifying(false)
    }
  }

  const handleAddLater = () => {
    onClose()
    if (type === "product") {
      router.push(ROUTES.DASHBOARD_PRODUCTS)
    } else {
      router.push(ROUTES.DASHBOARD_TOOLS)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={embedModalContainer}>
        {/* FIXED HEADER: Never scrolls away */}
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className={badgeShieldIconBox}>
              <ShieldCheck className="size-5 text-blue-600" />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle className="font-sans text-lg font-bold tracking-tight text-slate-900">
                Verify your badge
              </DialogTitle>
              <DialogDescription className="font-sans text-xs leading-relaxed text-slate-500">
                Paste the badge on your site to go live. Keep it there after
                launch — we fetch that page so the Visit link stays dofollow.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* SCROLLABLE MIDDLE BODY: Only this area scrolls! */}
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-4">
          {/* Section 1: Badge Preview & Style Toggle */}
          <div className="flex w-full min-w-0 flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-sans text-xs font-bold tracking-wider text-blue-600 uppercase">
                <span className="size-1.5 rounded-full bg-blue-600" />
                Badge Style
              </span>
              <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100/90 p-0.5">
                <button
                  type="button"
                  onClick={() => setStyle("card")}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-1 font-sans text-xs font-semibold transition-all",
                    style === "card"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Light Card
                </button>
                <button
                  type="button"
                  onClick={() => setStyle("dark")}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-1 font-sans text-xs font-semibold transition-all",
                    style === "dark"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Dark Card
                </button>
                <button
                  type="button"
                  onClick={() => setStyle("ranked")}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-1 font-sans text-xs font-semibold transition-all",
                    style === "ranked"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Ranked Gold
                </button>
                <button
                  type="button"
                  onClick={() => setStyle("shield")}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-1 font-sans text-xs font-semibold transition-all",
                    style === "shield"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  GitHub Shield
                </button>
              </div>
            </div>

            <div className={badgePreviewContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={badgeImageUrl}
                alt={`LaunchNests ${style} badge preview`}
                className="h-auto max-w-full drop-shadow-xs transition-transform hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Section 2: Embed Code */}
          <div className="flex w-full min-w-0 flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-sans text-xs font-bold tracking-wider text-amber-600 uppercase">
                <span className="size-1.5 rounded-full bg-amber-500" />
                Embed Code
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="h-7 gap-1.5 rounded-lg border-slate-200 bg-white px-3 font-sans text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                {copiedCode ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-slate-500" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
            <pre className={badgeCodeContainer}>{embedCodeSnippet}</pre>
            <p className="font-sans text-xs leading-normal text-slate-500">
              Paste this into your homepage, publish, then verify. Keep it on
              that URL after launch — we fetch weekly to keep the Visit link
              dofollow.
            </p>
          </div>

          {/* Section 3: AI Prompt */}
          <div className="flex w-full min-w-0 flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-sans text-xs font-bold tracking-wider text-indigo-600 uppercase">
                <span className="size-1.5 rounded-full bg-indigo-500" />
                AI Prompt
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyPrompt}
                className="h-7 gap-1.5 rounded-lg border-slate-200 bg-white px-3 font-sans text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied prompt</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-slate-500" />
                    <span>Copy AI prompt</span>
                  </>
                )}
              </Button>
            </div>
            <p className="font-sans text-xs leading-normal text-slate-500">
              {style === "shield"
                ? "Paste into Cursor, ChatGPT, or Claude — it will add this GitHub badge to your README.md. Then verify below."
                : "Paste into Cursor, ChatGPT, or Claude — it will add this badge to your site. Then verify below."}
            </p>
            <pre className={badgePromptContainer}>{aiPromptSnippet}</pre>
          </div>
        </div>

        {/* FIXED FOOTER: Action buttons permanently pinned at the bottom! */}
        <div className="flex shrink-0 flex-col gap-2.5 border-t border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            {onBackToSubmit ? (
              <Button
                type="button"
                variant="outline"
                onClick={onBackToSubmit}
                className="h-10 gap-1.5 rounded-xl border-slate-200 px-4 font-sans text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddLater}
                className="h-10 rounded-xl border-slate-200 px-4 font-sans text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Add later
              </Button>

              <Button
                type="button"
                onClick={handleVerifyBadge}
                disabled={isVerifying || isVerified}
                className={cn(
                  "h-10 gap-2 rounded-xl px-5 font-sans text-xs font-bold text-white shadow-xs transition-colors",
                  isVerified
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-[#0084FF] hover:bg-[#0070E0]"
                )}
              >
                {isVerifying ? (
                  <>
                    <Spinner className="size-4 text-white" />
                    <span>Verifying...</span>
                  </>
                ) : isVerified ? (
                  <>
                    <Check className="size-4" />
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4" />
                    <span>Verify Badge</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
