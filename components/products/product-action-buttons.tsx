"use client"

import { useState } from "react"
import { ArrowBigUp, Bookmark, ExternalLink, Code2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { useUpvote } from "@/hooks/products/use-upvote"
import { useBookmark } from "@/hooks/products/use-bookmark"
import { useUserInteractions } from "@/hooks/products/use-user-interactions"
import { useSession } from "@/lib/auth/client"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"
import { getOutboundUrl, getLinkRel } from "@/utils/products/urls"
import { cn } from "@/lib/utils"

interface ProductActionButtonsProps {
  slug: string
  productId?: string
  tier?: string | null
  initialUpvotes: number
  websiteUrl: string
  githubUrl?: string | null
}

export const ProductActionButtons = ({
  slug,
  productId,
  tier,
  initialUpvotes,
  websiteUrl,
  githubUrl,
}: ProductActionButtonsProps) => {
  const { data: session } = useSession()
  const { requireAuth } = useAuthModal()
  const upvoteMutation = useUpvote()
  const bookmarkMutation = useBookmark()
  const { isUpvoted: checkUpvoted, isBookmarked: checkBookmarked } =
    useUserInteractions()

  const [upvotes, setUpvotes] = useState(initialUpvotes)

  const isUpvoted = checkUpvoted(productId, slug)
  const isBookmarked = checkBookmarked(productId, slug)

  const isUpvoting =
    upvoteMutation.isPending && upvoteMutation.variables?.slug === slug
  const isBookmarking =
    bookmarkMutation.isPending && bookmarkMutation.variables?.slug === slug

  const handleUpvote = () => {
    requireAuth(
      () => {
        if (!session?.user?.id) return
        upvoteMutation.mutate(
          { slug, userId: session.user.id },
          {
            onSuccess: (data) => {
              setUpvotes(data.upvotesCount)
            },
          }
        )
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

  const outboundUrl = getOutboundUrl(websiteUrl, "devstack")
  const linkRel = getLinkRel(tier)

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Upvote Button with active fill color */}
      <Button
        onClick={handleUpvote}
        disabled={isUpvoting}
        className={cn(
          "gap-2 rounded-lg px-3 transition-colors",
          isUpvoted
            ? "bg-amber-600 text-white hover:bg-amber-700 shadow-xs"
            : "bg-slate-900 text-white hover:bg-slate-800"
        )}
      >
        <ArrowBigUp
          className={cn("size-4", isUpvoted ? "fill-white text-white" : "text-slate-300")}
          fill={isUpvoted ? "currentColor" : "none"}
        />
        {isUpvoted ? "Upvoted" : "Upvote"} ({upvotes.toLocaleString()})
      </Button>

      {/* Bookmark Button with active fill color */}
      <Button
        variant="outline"
        onClick={handleBookmark}
        disabled={isBookmarking}
        className={cn(
          "gap-2 rounded-lg transition-colors",
          isBookmarked
            ? "border-indigo-300 bg-indigo-50 text-indigo-600 hover:bg-indigo-100/80"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        )}
      >
        <Bookmark
          className="size-4"
          fill={isBookmarked ? "currentColor" : "none"}
        />
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </Button>

      {/* Website Link with source=devstack and configured dofollow/nofollow */}
      {websiteUrl && (
        <a
          href={outboundUrl}
          target="_blank"
          rel={linkRel}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-8 gap-2 rounded-lg border-slate-200 bg-white px-3 text-slate-700 hover:bg-slate-50"
          )}
        >
          Visit Website
          <ExternalLink className="size-3.5 text-slate-400" />
        </a>
      )}

      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-8 gap-2 rounded-lg border-slate-200 bg-white px-3 text-slate-700 hover:bg-slate-50"
          )}
        >
          <Code2 className="size-4" />
          GitHub
        </a>
      )}
    </div>
  )
}
