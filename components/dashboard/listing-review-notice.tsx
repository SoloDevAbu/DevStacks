import { LISTING_EDIT_MESSAGE, SUBMISSION_STATUS, type SubmissionStatus } from "@/constants/moderation"
import { listingReviewNotice, listingReviewNoticeReason } from "@/utils/dashboard/styles"

export interface ListingReviewSummary {
  status: SubmissionStatus
  reviewNote: string | null
  hasPendingEdit: boolean
  rejectedEditNote: string | null
}

const describe = (review: ListingReviewSummary) => {
  if (review.status === SUBMISSION_STATUS.REJECTED) {
    return { message: LISTING_EDIT_MESSAGE.REJECTED_LISTING, reason: review.reviewNote }
  }
  if (review.status === SUBMISSION_STATUS.PENDING) {
    return { message: LISTING_EDIT_MESSAGE.PENDING_LISTING, reason: null }
  }
  if (review.hasPendingEdit) {
    return { message: LISTING_EDIT_MESSAGE.PENDING_EDIT, reason: null }
  }
  if (review.rejectedEditNote) {
    return { message: LISTING_EDIT_MESSAGE.REJECTED_EDIT, reason: review.rejectedEditNote }
  }
  return null
}

export const ListingReviewNotice = ({ review }: { review: ListingReviewSummary }) => {
  const notice = describe(review)
  if (!notice) return null

  return (
    <div role="status" className={listingReviewNotice}>
      <p>{notice.message}</p>
      {notice.reason && <p className={listingReviewNoticeReason}>Reviewer: {notice.reason}</p>}
    </div>
  )
}
