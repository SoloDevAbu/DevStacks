"use client"

import { useState } from "react"
import { Heart, Bookmark, ExternalLink, Code2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { useLikeProduct } from "@/hooks/products/use-like-product"
import { useBookmarkProduct } from "@/hooks/products/use-bookmark-product"
import { useUserInteractions } from "@/hooks/users/use-user-interactions"
import { useSession } from "@/lib/auth/client"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"
import { getOutboundUrl, getLinkRel } from "@/utils/urls"
import { cn } from "@/lib/utils"

interface ProductActionButtonsProps {
  slug: string
  productId?: string
  tier?: string | null
  initialLikes: number
  websiteUrl: string
  githubUrl?: string | null
}

export const ProductActionButtons = ({
  slug,
  productId,
  tier,
  initialLikes,
  websiteUrl,
  githubUrl,
}: ProductActionButtonsProps) => {
  const { data: session } = useSession()
  const { requireAuth } = useAuthModal()
  const likeMutation = useLikeProduct()
  const bookmarkMutation = useBookmarkProduct()
  const { isProductLiked, isProductBookmarked } = useUserInteractions()

  const [likes, setLikes] = useState(initialLikes)

  const isLiked = isProductLiked(productId, slug)
  const isBookmarked = isProductBookmarked(productId, slug)

  const isLiking =
    likeMutation.isPending && likeMutation.variables?.slug === slug
  const isBookmarking =
    bookmarkMutation.isPending && bookmarkMutation.variables?.slug === slug

  const handleLike = () => {
    requireAuth(
      () => {
        if (!session?.user?.id) return
        likeMutation.mutate(
          { slug, userId: session.user.id },
          {
            onSuccess: (data) => {
              setLikes(data.likesCount)
            },
          }
        )
      },
      {
        title: "Sign in to like",
        description:
          "Sign in with your Google account to like and support developer products.",
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
          "Sign in with your Google account to save products to your library.",
      }
    )
  }

  const outboundUrl = getOutboundUrl(websiteUrl, "devstack")
  const linkRel = getLinkRel(tier)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={handleLike}
        disabled={isLiking}
        className={cn(
          "gap-2 rounded-lg px-3 transition-colors",
          isLiked
            ? "bg-pink-600 text-white shadow-xs hover:bg-pink-700"
            : "bg-slate-900 text-white hover:bg-slate-800"
        )}
      >
        <Heart
          className={cn(
            "size-4",
            isLiked ? "fill-white text-white" : "text-slate-300"
          )}
          fill={isLiked ? "currentColor" : "none"}
        />
        {isLiked ? "Liked" : "Like"} ({likes.toLocaleString()})
      </Button>

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
