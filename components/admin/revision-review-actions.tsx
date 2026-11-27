"use client"

import { ReviewActions } from "@/components/admin/review-actions"
import { useReviewRevision } from "@/hooks/admin/use-admin"
import { REVISION_ACTION } from "@/constants/moderation"

export const RevisionReviewActions = ({ id }: { id: string }) => {
  const review = useReviewRevision()
  return (
    <ReviewActions
      subject="Edit"
      approveLabel="Approve & publish"
      onApprove={() => review.mutateAsync({ id, action: REVISION_ACTION.APPROVE })}
      onReject={(reviewNote) =>
        review.mutateAsync({ id, action: REVISION_ACTION.REJECT, reviewNote })
      }
    />
  )
}
