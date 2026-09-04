"use client"

import { useState } from "react"
import { ArrowUp, Bookmark, ExternalLink, Code2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { useUpvote } from "@/hooks/products/use-upvote"
import { useBookmark } from "@/hooks/products/use-bookmark"
import { cn } from "@/lib/utils"

interface ProductActionButtonsProps {
  slug: string
  initialUpvotes: number
  websiteUrl: string
  githubUrl?: string | null
}

const DEMO_USER_ID = "demo-user"

export const ProductActionButtons = ({
  slug,
  initialUpvotes,
  websiteUrl,
  githubUrl,
}: ProductActionButtonsProps) => {
  const upvoteMutation = useUpvote()
  const bookmarkMutation = useBookmark()
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleUpvote = () => {
    upvoteMutation.mutate(
      { slug, userId: DEMO_USER_ID },
      {
        onSuccess: (data) => {
          setUpvotes(data.upvotesCount)
        },
      }
    )
  }

  const handleBookmark = () => {
    bookmarkMutation.mutate(
      { slug, userId: DEMO_USER_ID },
      {
        onSuccess: (data) => {
          setIsBookmarked(data.action === "added")
        },
      }
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={handleUpvote}
        disabled={upvoteMutation.isPending}
        className="gap-2 rounded-lg bg-slate-900 px-3 text-white hover:bg-slate-800"
      >
        <ArrowUp className="size-4" />
        Upvote ({upvotes.toLocaleString()})
      </Button>

      <Button
        variant="outline"
        onClick={handleBookmark}
        disabled={bookmarkMutation.isPending}
        className={cn(
          "gap-2 rounded-lg border-slate-200 bg-white hover:bg-slate-50",
          isBookmarked ? "border-indigo-200 bg-indigo-50/50 text-indigo-600" : "text-slate-600"
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
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
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
