"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth/client"
import { useAuthModal } from "@/components/auth/auth-modal-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { homeLaunchSectionContainer, primaryActionButton } from "@/utils/styles"

const isValidHttpsUrl = (rawUrl: string): boolean => {
  const trimmed = rawUrl.trim()
  if (!trimmed.startsWith("https://")) return false
  try {
    const url = new URL(trimmed)
    if (url.protocol !== "https:") return false
    const hostname = url.hostname
    if (!hostname || !hostname.includes(".")) return false
    const parts = hostname.split(".").filter(Boolean)
    if (parts.length < 2) return false
    const tld = parts[parts.length - 1]
    return tld.length >= 2 && !hostname.includes(" ")
  } catch {
    return false
  }
}

export const HomeLaunchSection = () => {
  const [url, setUrl] = useState("")
  const router = useRouter()
  const { data: session } = useSession()
  const { openAuthModal } = useAuthModal()

  const trimmedUrl = url.trim()
  const isUrlValid = isValidHttpsUrl(trimmedUrl)

  const handleLaunch = () => {
    if (!isUrlValid) return
    const target = `/submit?type=product&url=${encodeURIComponent(trimmedUrl)}`

    if (!session?.user) {
      openAuthModal({
        redirectTo: target,
        title: "Sign in with Google to launch for free",
        description:
          "Sign in to launch your product and autofill its details with AI.",
      })
      return
    }

    router.push(target)
  }

  return (
    <section className={homeLaunchSectionContainer}>
      <div className="flex items-center">
        <h2 className="text-xs font-bold text-slate-900">
          Submit your product with AI Autofill for free
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Globe className="absolute top-2.5 left-3 size-4 text-slate-400" />
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourproduct.com"
              aria-label="Product website URL for AI Autofill"
              className="bg-white pl-9"
              onKeyDown={(e) => {
                if (e.key === "Enter" && isUrlValid) {
                  e.preventDefault()
                  handleLaunch()
                }
              }}
            />
          </div>
          <Button
            type="button"
            onClick={handleLaunch}
            disabled={!isUrlValid}
            aria-label="Launch for Free with AI Autofill"
            className={primaryActionButton}
          >
            Launch for Free
          </Button>
        </div>

        {trimmedUrl.startsWith("http://") ? (
          <p className="text-[11px] font-medium text-amber-600">
            Only secure HTTPS URLs (starting with https://) are supported.
          </p>
        ) : trimmedUrl.length > 0 && !trimmedUrl.startsWith("https://") ? (
          <p className="text-[11px] text-slate-500">
            Must start with{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-blue-600">
              https://
            </code>{" "}
            (e.g. https://yourproduct.com)
          </p>
        ) : trimmedUrl.length >= 8 && !isUrlValid ? (
          <p className="text-[11px] text-slate-500">
            Please enter a complete domain (e.g. https://yourproduct.com)
          </p>
        ) : null}
      </div>
    </section>
  )
}

