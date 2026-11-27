"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { ReviewActions } from "@/components/admin/review-actions"
import { useRegenerateBlog, useReviewSubmission } from "@/hooks/admin/use-admin"
import { SUBMISSION_STATUS, type SubmissionStatus } from "@/constants/moderation"
import type { LaunchItemType } from "@/constants/launches"
import { toErrorMessage } from "@/utils/admin/format"

export const SubmissionReviewActions = ({
  itemType,
  id,
  status,
  canRegenerateBlog,
}: {
  itemType: LaunchItemType
  id: string
  status: SubmissionStatus
  canRegenerateBlog: boolean
}) => {
  const review = useReviewSubmission()
  const regenerate = useRegenerateBlog()

  const resetToPending = async () => {
    try {
      await review.mutateAsync({ type: itemType, id, status: SUBMISSION_STATUS.PENDING })
      toast.success("Moved back to pending")
    } catch (err) {
      toast.error(toErrorMessage(err))
    }
  }

  const regenerateBlog = async () => {
    try {
      await regenerate.mutateAsync({ itemType, itemId: id })
      toast.success("Launch blog regenerated")
    } catch (err) {
      toast.error(toErrorMessage(err))
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ReviewActions
        subject="Submission"
        showApprove={status !== SUBMISSION_STATUS.APPROVED}
        showReject={status !== SUBMISSION_STATUS.REJECTED}
        onApprove={async () => {
          const result = await review.mutateAsync({
            type: itemType,
            id,
            status: SUBMISSION_STATUS.APPROVED,
          })
          if (result.blogError) toast.error(`Blog generation failed: ${result.blogError}`)
        }}
        onReject={(reviewNote) =>
          review.mutateAsync({
            type: itemType,
            id,
            status: SUBMISSION_STATUS.REJECTED,
            reviewNote,
          })
        }
      />
      {status !== SUBMISSION_STATUS.PENDING && (
        <Button variant="outline" disabled={review.isPending} onClick={resetToPending}>
          Move to pending
        </Button>
      )}
      {canRegenerateBlog && (
        <Button variant="outline" disabled={regenerate.isPending} onClick={regenerateBlog}>
          {regenerate.isPending ? "Generating…" : "Regenerate blog"}
        </Button>
      )}
    </div>
  )
}
