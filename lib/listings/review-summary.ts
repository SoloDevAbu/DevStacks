import { getListingReviewState } from "@/db/queries/revisions"
import type { ListingReviewSummary } from "@/components/dashboard/listing-review-notice"
import type { LaunchItemType } from "@/constants/launches"

// Loads the review state for a maker's edit page. A pending edit's values are laid over the live
// listing so the form shows what the maker last submitted, and saving doesn't undo it.
export const loadListingForEdit = async <T extends { id: string }>(
  itemType: LaunchItemType,
  listing: T
): Promise<{ listing: T; review: ListingReviewSummary }> => {
  const state = await getListingReviewState({ itemType, itemId: listing.id })
  return {
    listing: state.pendingRevision
      ? ({ ...listing, ...state.pendingRevision.payload } as T)
      : listing,
    review: {
      status: state.status,
      reviewNote: state.reviewNote,
      hasPendingEdit: Boolean(state.pendingRevision),
      rejectedEditNote: state.rejectedEditNote,
    },
  }
}
