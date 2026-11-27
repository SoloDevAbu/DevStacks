export interface ListingUpdateResult<T = unknown> {
  item: T
  // True when the listing is live and the edit was queued for admin review instead of applied.
  revisionPending: boolean
}

export const toListingUpdateResult = <T>(body: {
  data: T
  revisionPending?: boolean
}): ListingUpdateResult<T> => ({
  item: body.data,
  revisionPending: Boolean(body.revisionPending),
})
