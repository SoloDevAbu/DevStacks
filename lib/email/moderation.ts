import {
  EMAIL_FALLBACK,
  EMAIL_TEMPLATE,
  MODERATION_EMAIL_KIND,
  type EmailTemplate,
  type ModerationEmailKind,
} from "@/constants/email"
import { hasLaunched } from "@/lib/catalog/visibility"
import { formatLaunchStart } from "@/utils/iso-weeks"
import { sendTemplateEmail, withHtmlVariant, type TemplateVariables } from "@/lib/email/send"
import {
  formatEmailLaunchWeek,
  getDashboardListingsUrl,
  getListingEditUrl,
  getPublicListingUrl,
  type EmailListing,
} from "@/lib/email/listing-links"

interface ModerationEmail {
  to: string
  kind: ModerationEmailKind
  // Unique per moderation decision; part of the idempotency key so retries never double-send.
  eventId: string
  listing: EmailListing
  reviewNote?: string | null
}

const reviewNoteVariables = (reviewNote?: string | null) =>
  withHtmlVariant("REVIEW_NOTE", reviewNote?.trim() || EMAIL_FALLBACK.REVIEW_NOTE)

// A listing booked into a future week is private until that week starts, so its public URL would
// 404; those emails send the maker to the dashboard and show when the page opens instead.
const buildEmail = ({ kind, listing, reviewNote }: ModerationEmail): {
  template: EmailTemplate
  variables: TemplateVariables
} => {
  const base = withHtmlVariant("LISTING_NAME", listing.name)
  const isLive = hasLaunched(listing)
  const viewUrl = isLive ? getPublicListingUrl(listing) : getDashboardListingsUrl(listing)

  switch (kind) {
    case MODERATION_EMAIL_KIND.SUBMISSION_APPROVED:
      if (isLive || !listing.launchYear || !listing.launchWeek) {
        return {
          template: EMAIL_TEMPLATE.SUBMISSION_APPROVED_LIVE,
          variables: { ...base, ACTION_URL: getPublicListingUrl(listing) },
        }
      }
      return {
        template: EMAIL_TEMPLATE.SUBMISSION_APPROVED_SCHEDULED,
        variables: {
          ...base,
          GO_LIVE_AT: formatLaunchStart(listing.launchYear, listing.launchWeek),
          LAUNCH_WEEK: formatEmailLaunchWeek(listing),
          LISTING_URL: getPublicListingUrl(listing),
          ACTION_URL: viewUrl,
        },
      }
    case MODERATION_EMAIL_KIND.SUBMISSION_REJECTED:
      return {
        template: EMAIL_TEMPLATE.SUBMISSION_REJECTED,
        variables: { ...base, ...reviewNoteVariables(reviewNote), ACTION_URL: getListingEditUrl(listing) },
      }
    case MODERATION_EMAIL_KIND.EDIT_APPROVED:
      return { template: EMAIL_TEMPLATE.EDIT_APPROVED, variables: { ...base, ACTION_URL: viewUrl } }
    case MODERATION_EMAIL_KIND.EDIT_REJECTED:
      return {
        template: EMAIL_TEMPLATE.EDIT_REJECTED,
        variables: { ...base, ...reviewNoteVariables(reviewNote), ACTION_URL: getListingEditUrl(listing) },
      }
  }
}

export const sendModerationEmail = async (email: ModerationEmail) => {
  const { template, variables } = buildEmail(email)
  await sendTemplateEmail({
    to: email.to,
    template,
    variables,
    idempotencyKey: `moderation/${email.kind}/${email.eventId}`,
  })
}
