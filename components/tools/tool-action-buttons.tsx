"use client"

import { ArrowBigUp, Bookmark, ExternalLink } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { useUpvoteTool } from "@/hooks/tools/use-upvote-tool"
import { useBookmarkTool } from "@/hooks/tools/use-bookmark-tool"
import { useUserInteractions } from "@/hooks/users/use-user-interactions"
import { useSession } from "@/lib/auth/client"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"
import { getOutboundUrl, getLinkRel } from "@/utils/urls"
import { trackExternalVisit } from "@/lib/api/analytics"
import { trackOutboundClick } from "@/lib/analytics/events"
import { cn } from "@/lib/utils"
import { bookmarkButtonActive, bookmarkButtonInactive } from "@/utils/styles"

interface ToolActionButtonsProps {
  slug: string
  toolId?: string
  tier?: string | null
  badgeVerified?: boolean
  initialUpvotes: number
  websiteUrl?: string | null
  githubUrl?: string | null
  appStoreUrl?: string | null
  playStoreUrl?: string | null
  chromeExtensionUrl?: string | null
}

export const ToolActionButtons = ({
  slug,
  toolId,
  tier,
  badgeVerified,
  initialUpvotes,
  websiteUrl,
}: ToolActionButtonsProps) => {
  const { data: session } = useSession()
  const { requireAuth } = useAuthModal()
  const { toggle: toggleUpvote } = useUpvoteTool(slug)
  const bookmarkMutation = useBookmarkTool()
  const { isToolUpvoted, isToolBookmarked, getToolUpvotes } =
    useUserInteractions()

  const upvotes = getToolUpvotes(slug, initialUpvotes)
  const isUpvoted = isToolUpvoted(slug)
  const isBookmarked = isToolBookmarked(toolId, slug)

  const isBookmarking =
    bookmarkMutation.isPending && bookmarkMutation.variables?.slug === slug

  const handleUpvote = () => {
    requireAuth(
      () => {
        if (!session?.user?.id) return
        toggleUpvote(session.user.id, upvotes)
      },
      {
        title: "Sign in to upvote",
        description:
          "Sign in with your Google account to upvote and support developer tools.",
      }
    )
  }

  const handleBookmark = () => {
    requireAuth(
      () => {
        if (!session?.user?.id) return
        bookmarkMutation.mutate({ slug, userId: session.user.id })
      },
      {
        title: "Sign in to bookmark",
        description:
          "Sign in with your Google account to bookmark tools to your library.",
      }
    )
  }

  const outboundUrl = getOutboundUrl(websiteUrl, "launchnests")
  const linkRel = getLinkRel(tier, badgeVerified)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={handleUpvote}
        className={cn(
          "gap-2 rounded-lg px-3 transition-colors",
          isUpvoted
            ? "bg-amber-600 text-white shadow-xs hover:bg-amber-700"
            : "bg-slate-900 text-white hover:bg-slate-800"
        )}
      >
        <ArrowBigUp
          className={cn(
            "size-4",
            isUpvoted ? "fill-white text-white" : "text-slate-300"
          )}
          fill={isUpvoted ? "currentColor" : "none"}
        />
        {isUpvoted ? "Upvoted" : "Upvote"} ({upvotes.toLocaleString()})
      </Button>

      {websiteUrl && (
        <a
          href={outboundUrl}
          target="_blank"
          rel={linkRel}
          onClick={() => {
            trackOutboundClick({
              linkUrl: websiteUrl,
              itemId: toolId,
              itemType: "tool",
              slug,
            })
            if (toolId) {
              trackExternalVisit({
                itemType: "tool",
                id: toolId,
                targetUrl: websiteUrl,
              })
            }
          }}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-8 gap-2 rounded-lg border-slate-200 bg-white px-3 text-slate-700 hover:bg-slate-50"
          )}
        >
          <span>Visit Website</span>
          <ExternalLink className="size-3.5 text-slate-400" />
        </a>
      )}

      <Button
        variant="outline"
        onClick={handleBookmark}
        disabled={isBookmarking}
        className={isBookmarked ? bookmarkButtonActive : bookmarkButtonInactive}
      >
        <Bookmark
          className="size-4"
          fill={isBookmarked ? "currentColor" : "none"}
        />
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </Button>
    </div>
  )
}
