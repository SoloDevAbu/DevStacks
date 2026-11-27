import { EMAIL_FALLBACK, EMAIL_TEMPLATE } from "@/constants/email"
import { DASHBOARD_LISTING_PARAMS } from "@/constants/routes"
import { PLANS, TIER, isPaidTier, type Tier } from "@/constants/plans"
import { escapeHtml, sendTemplateEmail, withHtmlVariant } from "@/lib/email/send"
import {
  formatEmailLaunchWeek,
  getDashboardListingsUrl,
  type EmailListing,
} from "@/lib/email/listing-links"

interface SubmissionReceivedEmail {
  to: string
  listing: EmailListing & { id: string; tier: string }
}

const premiumPlan = PLANS[TIER.PREMIUM]

// Resend templates have no loops, so the feature list is rendered here from the plan config.
const premiumFeatureVariables = () => ({
  PREMIUM_PRICE: `${premiumPlan.price} ${premiumPlan.period}`,
  PREMIUM_FEATURES: premiumPlan.features.map((feature) => `- ${feature}`).join("\n"),
  PREMIUM_FEATURES_HTML: `<table role="presentation" cellpadding="0" cellspacing="0" border="0">${premiumPlan.features
    .map(
      (feature) =>
        `<tr><td style="padding-top:2px;padding-bottom:2px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#44403c;">&#8212;&nbsp;${escapeHtml(feature)}</td></tr>`
    )
    .join("")}</table>`,
})

const planName = (tier: string) => {
  const plan = PLANS[(tier in PLANS ? tier : TIER.FREE) as Tier]
  return isPaidTier(tier) ? plan.name : `${plan.name}${EMAIL_FALLBACK.FREE_PLAN_SUFFIX}`
}

export const sendSubmissionReceivedEmail = async ({ to, listing }: SubmissionReceivedEmail) => {
  const isPaid = isPaidTier(listing.tier)
  const variables = {
    ...withHtmlVariant("LISTING_NAME", listing.name),
    PLAN_NAME: planName(listing.tier),
    LAUNCH_WEEK: formatEmailLaunchWeek(listing),
    ACTION_URL: getDashboardListingsUrl(listing),
  }

  await sendTemplateEmail({
    to,
    template: isPaid ? EMAIL_TEMPLATE.SUBMISSION_RECEIVED : EMAIL_TEMPLATE.SUBMISSION_RECEIVED_FREE,
    variables: isPaid
      ? variables
      : {
          ...variables,
          ...premiumFeatureVariables(),
          UPGRADE_URL: getDashboardListingsUrl(listing, DASHBOARD_LISTING_PARAMS.UPGRADE),
          BADGE_URL: getDashboardListingsUrl(listing, DASHBOARD_LISTING_PARAMS.BADGE),
        },
    idempotencyKey: `submission-received/${listing.id}`,
  })
}
