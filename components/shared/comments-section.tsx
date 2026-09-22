"use client"

import { useState, useCallback } from "react"
import { MessageSquare, ChevronDown, AlertCircle, Send } from "lucide-react"
import { DetailSectionHeader } from "@/components/shared/detail-section-header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"
import { GoogleIcon } from "@/components/shared/google-icon"
import { useSession } from "@/lib/auth/client"
import { useAuthModal } from "@/components/auth/auth-modal-provider"
import {
  useItemComments,
  useCreateItemComment,
} from "@/hooks/comments/use-item-comments"
import { formatCommentTime } from "@/utils/date"
import { containsLink } from "@/lib/validation/comment"
import {
  INITIAL_COMMENTS_LIMIT,
  COMMENTS_LOAD_MORE_STEP,
  MAX_COMMENT_LENGTH,
} from "@/constants/comments"
import {
  commentSectionContainer,
  commentInputSection,
  commentAuthOverlay,
  commentAuthCard,
  commentAuthTitle,
  commentAuthSubtitle,
  commentAuthButton,
  commentListContainer,
  commentItemRow,
  commentItemBody,
  commentItemTime,
  commentLoadMoreContainer,
} from "@/utils/styles"
import { cn } from "@/lib/utils"

interface CommentsSectionProps {
  entityType: "tool" | "product"
  slug: string
  entityName: string
}

export const CommentsSection = ({
  entityType,
  slug,
  entityName,
}: CommentsSectionProps) => {
  const { data: session } = useSession()
  const { openAuthModal } = useAuthModal()
  const [commentText, setCommentText] = useState("")
  const [visibleCount, setVisibleCount] = useState(INITIAL_COMMENTS_LIMIT)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data: comments = [], isLoading } = useItemComments(entityType, slug)
  const { mutate: createComment, isPending } = useCreateItemComment(
    entityType,
    slug
  )

  const hasLinkInText = containsLink(commentText)
  const isOverLength = commentText.length > MAX_COMMENT_LENGTH
  const isSubmitDisabled =
    !session?.user ||
    commentText.trim().length === 0 ||
    hasLinkInText ||
    isOverLength ||
    isPending

  const handleSignIn = useCallback(() => {
    openAuthModal({
      title: "Sign in with Google to comment",
      description: `Join the community discussion and share your thoughts on ${entityName}.`,
    })
  }, [openAuthModal, entityName])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      // Security check: even if user modifies DOM/inspect element, prevent submission
      if (!session?.user) {
        handleSignIn()
        return
      }

      if (isSubmitDisabled) return

      setSubmitError(null)
      createComment(
        { body: commentText.trim() },
        {
          onSuccess: () => {
            setCommentText("")
          },
          onError: (err) => {
            setSubmitError(
              err instanceof Error ? err.message : "Failed to post comment"
            )
          },
        }
      )
    },
    [session?.user, handleSignIn, isSubmitDisabled, commentText, createComment]
  )

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + COMMENTS_LOAD_MORE_STEP)
  }, [])

  const displayedComments = comments.slice(0, visibleCount)
  const hasMore = comments.length > visibleCount
  const remainingCount = comments.length - visibleCount

  return (
    <section className={commentSectionContainer}>
      <DetailSectionHeader
        title="Discussion & Comments"
        subtitle={`Questions, feedback, and insights from developers about ${entityName}`}
        icon={MessageSquare}
        theme="blue"
      />

      {/* Top Comment Box with Dialog-like Card for Unauthenticated Users */}
      <div className={cn(commentInputSection, "relative")}>
        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex flex-col gap-3 transition-all",
            !session?.user &&
              "pointer-events-none select-none opacity-40 blur-[1.5px]"
          )}
        >
          <div className="flex items-center gap-2.5">
            <Avatar className="size-7 border border-border">
              {session?.user?.image ? (
                <AvatarImage
                  src={session.user.image}
                  alt={session.user.name || "User"}
                />
              ) : (
                <AvatarFallback className="bg-slate-100 text-[10px] font-semibold text-slate-500">
                  ?
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-xs font-semibold text-slate-800">
              {session?.user
                ? `Commenting as ${session.user.name || "Developer"}`
                : "Leave a comment..."}
            </span>
          </div>

          <Textarea
            value={commentText}
            onChange={(e) => {
              if (!session?.user) return
              setCommentText(e.target.value)
              if (submitError) setSubmitError(null)
            }}
            disabled={!session?.user}
            readOnly={!session?.user}
            tabIndex={session?.user ? 0 : -1}
            placeholder="Ask a question, share feedback, or leave a thought (links are not allowed)..."
            rows={3}
            className="resize-none rounded-md bg-white p-3 text-xs leading-relaxed"
          />

          {hasLinkInText && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>Links are not allowed in comments.</span>
            </div>
          )}

          {submitError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span
              className={cn(
                "font-mono text-[11px]",
                isOverLength ? "font-bold text-rose-600" : "text-slate-400"
              )}
            >
              {commentText.length}/{MAX_COMMENT_LENGTH}
            </span>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitDisabled}
              className="h-8 gap-1.5 rounded-none px-4 text-xs font-semibold"
            >
              {isPending ? (
                <>
                  <Spinner className="size-3.5" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="size-3" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Floating Dialog Card matching the screenshot */}
        {!session?.user && (
          <div className={commentAuthOverlay}>
            <div className={commentAuthCard}>
              <h4 className={commentAuthTitle}>Sign in to comment</h4>
              <p className={commentAuthSubtitle}>
                Connect with your Google account to join the discussion.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSignIn}
                className={commentAuthButton}
              >
                <GoogleIcon size={16} />
                <span>Sign in with Google</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className={commentListContainer}>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spinner className="size-5 text-slate-400" />
          </div>
        ) : displayedComments.length > 0 ? (
          displayedComments.map((comment) => {
            const avatarSrc = comment.user?.image || comment.user?.avatarUrl
            const userName = comment.user?.name || "Anonymous Developer"

            return (
              <div key={comment.id} className={commentItemRow}>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-7 border border-border">
                    {avatarSrc && (
                      <AvatarImage src={avatarSrc} alt={userName} />
                    )}
                    <AvatarFallback className="bg-slate-900 text-[10px] text-white">
                      {userName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {userName}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className={commentItemTime}>
                      {formatCommentTime(comment.createdAt)}
                    </span>
                  </div>
                </div>

                <p className={commentItemBody}>{comment.body}</p>
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <MessageSquare className="mb-2 size-6 text-slate-300" />
            <p className="text-xs font-semibold text-slate-700">
              No comments yet
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Be the first to share your thoughts or ask a question!
            </p>
          </div>
        )}
      </div>

      {/* Load More Button (only rendered when there are more comments) */}
      {hasMore && (
        <div className={commentLoadMoreContainer}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLoadMore}
            className="gap-1.5 rounded-none text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ChevronDown className="size-3.5" />
            Load More Comments ({remainingCount} remaining)
          </Button>
        </div>
      )}
    </section>
  )
}
