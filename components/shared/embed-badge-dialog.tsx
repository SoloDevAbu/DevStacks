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
  const [style, setStyle] = useState<"card" | "shield">("card")
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const entityPath = type === "tool" ? `tools/${slug}` : `products/${slug}`
  const canonicalUrl = `${SITE_CONFIG.url}/${entityPath}`
  const badgeImageUrl = `${SITE_CONFIG.url}/api/badge/${slug}?style=${style}&type=${type}`

  const embedCodeSnippet =
    style === "card"
      ? `<a href="${canonicalUrl}?ref=badge" target="_blank">\n  <img src="${badgeImageUrl}" alt="Featured on LaunchNests" />\n</a>`
      : `[![Featured on LaunchNests](${badgeImageUrl})](${canonicalUrl}?ref=badge)`

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
          "Badge Not Detected Yet",
          data.message ||
            "Please ensure the badge is deployed to your homepage, or click 'Add later' to verify anytime."
        )
      }
    } catch {
      toast.error(
        "Verification Failed",
        "Could not reach website to check badge. Ensure your domain is accessible."
      )
    } finally {
      setIsVerifying(false)
    }
  }

  const handleAddLater = () => {
    onClose()
    router.push(ROUTES.DASHBOARD)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={embedModalContainer}>
        {/* FIXED HEADER: Icon on left, Title + Subtitle on right */}
        <DialogHeader className="shrink-0 border-b border-slate-100 bg-white p-6 pb-4 text-left">
          <div className="flex items-start gap-3.5 pr-8">
            <div className={badgeShieldIconBox}>
              <ShieldCheck className="size-6 text-blue-600" />
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
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-sans text-xs font-bold tracking-wider text-blue-600 uppercase">
                <span className="size-1.5 rounded-full bg-blue-600" />
                Badge Preview
              </span>
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100/90 p-0.5">
                <button
                  type="button"
                  onClick={() => setStyle("card")}
                  className={cn(
                    "cursor-pointer rounded-md px-2.5 py-1 font-sans text-xs font-semibold transition-all",
                    style === "card"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Showcase Card
                </button>
                <button
                  type="button"
                  onClick={() => setStyle("shield")}
                  className={cn(
                    "cursor-pointer rounded-md px-2.5 py-1 font-sans text-xs font-semibold transition-all",
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
              {style === "card" ? (
                // Authentic LaunchNests Showcase Card (White Card with LaunchNests isometric mark & orbit)
                <div className="flex items-center justify-center rounded-2xl border border-slate-200/90 bg-white py-3 pr-7 pl-3.5 shadow-xs transition-transform hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                    {/* LaunchNests Official Vector Logo Mark */}
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0"
                    >
                      <defs>
                        <linearGradient
                          id="pv-ln-arc"
                          x1="6"
                          y1="18"
                          x2="34"
                          y2="18"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="#0091FF" />
                          <stop offset="50%" stopColor="#00D084" />
                          <stop offset="100%" stopColor="#FF9500" />
                        </linearGradient>
                        <linearGradient
                          id="pv-ln-top"
                          x1="12"
                          y1="12"
                          x2="28"
                          y2="22"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="#00E599" />
                          <stop offset="100%" stopColor="#00B4D8" />
                        </linearGradient>
                        <linearGradient
                          id="pv-ln-mid"
                          x1="10"
                          y1="18"
                          x2="30"
                          y2="26"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="#0070F3" />
                          <stop offset="100%" stopColor="#0051C7" />
                        </linearGradient>
                        <linearGradient
                          id="pv-ln-bot"
                          x1="10"
                          y1="23"
                          x2="30"
                          y2="33"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0%" stopColor="#FF7700" />
                          <stop offset="100%" stopColor="#FF4500" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 8.5 17.5 A 13 13 0 0 1 31.5 17.5"
                        stroke="url(#pv-ln-arc)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <circle cx="8.5" cy="17.5" r="3.2" fill="#0091FF" />
                      <circle cx="20" cy="6.5" r="3.5" fill="#00D084" />
                      <circle cx="31.5" cy="17.5" r="3.2" fill="#FF9500" />
                      <path
                        d="M 19.3 12.8 C 19.7 12.4 20.3 12.4 20.7 12.8 L 27.2 16.5 C 27.6 16.7 27.6 17.3 27.2 17.5 L 20.7 21.2 C 20.3 21.6 19.7 21.6 19.3 21.2 L 12.8 17.5 C 12.4 17.3 12.4 16.7 12.8 16.5 Z"
                        fill="url(#pv-ln-top)"
                      />
                      <path
                        d="M 12.8 21.2 L 19.3 24.9 C 19.7 25.1 20.3 25.1 20.7 24.9 L 27.2 21.2 C 27.8 20.8 28.5 21.3 28.5 22.0 L 27.4 23.3 C 27.2 23.6 26.8 23.8 26.5 24.0 L 20.7 27.3 C 20.3 27.5 19.7 27.5 19.3 27.3 L 13.5 24.0 C 13.2 23.8 12.8 23.6 12.6 23.3 L 11.5 22.0 C 11.5 21.3 12.2 20.8 12.8 21.2 Z"
                        fill="url(#pv-ln-mid)"
                      />
                      <path
                        d="M 12.8 26.5 L 19.3 30.2 C 19.7 30.4 20.3 30.4 20.7 30.2 L 27.2 26.5 C 27.8 26.1 28.5 26.6 28.5 27.3 L 27.4 28.6 C 27.2 28.9 26.8 29.1 26.5 29.3 L 20.7 32.6 C 20.3 32.8 19.7 32.8 19.3 32.6 L 13.5 29.3 C 13.2 29.1 12.8 28.9 12.6 28.6 L 11.5 27.3 C 11.5 26.6 12.2 26.1 12.8 26.5 Z"
                        fill="url(#pv-ln-bot)"
                      />
                    </svg>

                    <div className="flex flex-col text-left">
                      <span className="font-sans text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                        FEATURED ON
                      </span>
                      <span className="font-sans text-base font-extrabold tracking-tight text-slate-900">
                        LaunchNests
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // LaunchNests Shield Style
                <div className="inline-flex items-center overflow-hidden rounded text-[11px] font-semibold shadow-2xs">
                  <span className="bg-slate-900 px-3 py-1 font-sans text-white">
                    LaunchNests
                  </span>
                  <span className="bg-blue-600 px-3 py-1 font-sans text-white">
                    featured
                  </span>
                </div>
              )}
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

          {/* <p className="text-center font-sans text-xs text-slate-400">
            Want to skip?{" "}
            <span className="font-semibold text-amber-600">
              Free Lifetime Premium
            </span>{" "}
            includes permanent dofollow SEO backlinks.
          </p> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
