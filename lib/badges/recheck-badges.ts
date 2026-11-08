import { BADGE_CHECK } from "@/constants/badges"
import {
  getListingsDueForBadgeCheck,
  saveBadgeCheck,
  type BadgeListing,
} from "@/db/queries/badges/badge-listings"
import { getNextBadgeState } from "@/lib/badges/badge-state"
import { checkBadgeLink } from "@/lib/badges/check-link"
import { revalidateCatalog } from "@/lib/cache/revalidate"
import { getListingPath } from "@/utils/urls"

export const revalidateBadgeListing = ({
  itemKind,
  slug,
}: Pick<BadgeListing, "itemKind" | "slug">) =>
  revalidateCatalog(
    itemKind === "tool" ? { toolSlug: slug } : { productSlug: slug }
  )

const recheckBadge = async (listing: BadgeListing, checkedAt: Date) => {
  const outcome = await checkBadgeLink({
    pageUrl: listing.badgeUrl ?? listing.websiteUrl,
    websiteUrl: listing.websiteUrl,
    listingPath: getListingPath(listing),
  })
  const update = getNextBadgeState(
    listing.badgeCheckFailures,
    outcome,
    checkedAt
  )

  await saveBadgeCheck(listing, update)

  const wasRemoved = update.badgeVerified === false
  if (wasRemoved) revalidateBadgeListing(listing)

  return { slug: listing.slug, outcome, wasRemoved }
}

export const recheckDueBadges = async (now = new Date()) => {
  const due = await getListingsDueForBadgeCheck(now)
  const results: Awaited<ReturnType<typeof recheckBadge>>[] = []

  for (let i = 0; i < due.length; i += BADGE_CHECK.CONCURRENCY) {
    const batch = due.slice(i, i + BADGE_CHECK.CONCURRENCY)
    results.push(
      ...(await Promise.all(batch.map((item) => recheckBadge(item, now))))
    )
  }

  return results
}
