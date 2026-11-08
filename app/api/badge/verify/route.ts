import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { BADGE_CHECK_MESSAGES, BADGE_CHECK_OUTCOME } from "@/constants/badges"
import {
  getOwnedBadgeListing,
  saveBadgeCheck,
  type ListingKind,
} from "@/db/queries/badges/badge-listings"
import { getNextBadgeState } from "@/lib/badges/badge-state"
import { checkBadgeLink } from "@/lib/badges/check-link"
import { revalidateBadgeListing } from "@/lib/badges/recheck-badges"
import { getWeeklyPlacement } from "@/lib/badges/weekly-placement"
import { getListingPath } from "@/utils/urls"

const isListingKind = (value: unknown): value is ListingKind =>
  value === "tool" || value === "product"

const errorResponse = (error: string, status: number) => ({
  error: NextResponse.json({ error }, { status }),
  listing: null,
})

const findOwnedListing = async (
  req: NextRequest,
  slug: unknown,
  type: unknown
) => {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return errorResponse("Unauthorized", 401)

  if (typeof slug !== "string" || !slug || !isListingKind(type)) {
    return errorResponse("A listing slug and type are required.", 400)
  }

  const listing = await getOwnedBadgeListing(type, slug, session.user.id)
  return listing
    ? { listing, error: null }
    : errorResponse("Listing not found.", 404)
}

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = req.nextUrl
    const { listing, error } = await findOwnedListing(
      req,
      searchParams.get("slug"),
      searchParams.get("type")
    )
    if (!listing) return error

    return NextResponse.json({
      badgeVerified: listing.badgeVerified,
      badgeUrl: listing.badgeUrl,
      badgeCheckedAt: listing.badgeCheckedAt,
      badgeCheckFailures: listing.badgeCheckFailures,
      placement: await getWeeklyPlacement(listing),
    })
  } catch (error) {
    console.error("Failed to read badge status:", error)
    return NextResponse.json(
      { error: "Failed to read badge status" },
      { status: 500 }
    )
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json().catch(() => ({}))
    const { listing, error } = await findOwnedListing(req, body.slug, body.type)
    if (!listing) return error

    const pageUrl =
      typeof body.url === "string" && body.url.trim()
        ? body.url.trim()
        : listing.websiteUrl

    const outcome = await checkBadgeLink({
      pageUrl,
      websiteUrl: listing.websiteUrl,
      listingPath: getListingPath(listing),
    })
    const verified = outcome === BADGE_CHECK_OUTCOME.ACTIVE

    // A failed manual check changes nothing: only the weekly job may take a live badge away.
    if (verified) {
      await saveBadgeCheck(listing, {
        ...getNextBadgeState(listing.badgeCheckFailures, outcome, new Date()),
        badgeUrl: pageUrl,
      })
      if (!listing.badgeVerified) revalidateBadgeListing(listing)
    }

    return NextResponse.json({
      verified,
      outcome,
      message: BADGE_CHECK_MESSAGES[outcome],
    })
  } catch (error) {
    console.error("Failed to verify badge:", error)
    return NextResponse.json(
      { error: "Failed to verify badge" },
      { status: 500 }
    )
  }
}
