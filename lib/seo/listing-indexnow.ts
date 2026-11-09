import { hasLaunched } from "@/lib/catalog/visibility"
import { submitToIndexNow } from "@/lib/seo/indexnow"
import { getListingPath } from "@/utils/urls"

interface ChangedListing {
  slug: string
  status?: string | null
  launchYear?: number | null
  launchWeek?: number | null
}

// Edits and deletions of a listing that was live are worth announcing: a deleted page now returns
// 404, and IndexNow is how Bing learns to drop it. Pending, rejected and future-week listings were
// never public, so pinging them would only waste crawl budget.
export const pingListingChange = async (
  itemKind: "tool" | "product",
  listing: ChangedListing | null | undefined
) => {
  if (!listing || listing.status !== "approved" || !hasLaunched(listing)) {
    return
  }
  await submitToIndexNow([getListingPath({ itemKind, slug: listing.slug })])
}
