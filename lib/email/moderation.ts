import { RESEND_API_URL, MODERATION_EMAIL_TEMPLATE, type ModerationEmailKind } from "@/constants/email"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { getListingPath } from "@/utils/urls"
import type { LaunchItemType } from "@/constants/launches"

interface ModerationEmail {
  to: string
  kind: ModerationEmailKind
  // Unique per moderation decision; becomes the Resend idempotency key so retries never double-send.
  eventId: string
  listing: { itemType: LaunchItemType; name: string; slug: string }
  reviewNote?: string | null
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

// Resend inserts {{{VAR}}} unescaped, so user-written text is passed raw for the subject and
// plain-text body and escaped (the *_HTML variables) for the HTML body.
const buildTemplateVariables = ({ kind, listing, reviewNote }: ModerationEmail) => {
  const template = MODERATION_EMAIL_TEMPLATE[kind]
  const path = template.linksToListing
    ? getListingPath({ itemKind: listing.itemType, slug: listing.slug })
    : ROUTES.DASHBOARD
  const variables: Record<string, string> = {
    LISTING_NAME: listing.name,
    LISTING_NAME_HTML: escapeHtml(listing.name),
    ACTION_URL: new URL(path, SITE_CONFIG.url).toString(),
  }
  if (template.showsReason) {
    const note = reviewNote?.trim() || "No details were given."
    variables.REVIEW_NOTE = note
    variables.REVIEW_NOTE_HTML = escapeHtml(note)
  }
  return variables
}

// Called from after(): a failed email is logged and never fails the moderation action.
export const sendModerationEmail = async (email: ModerationEmail) => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!apiKey || !from) {
    console.warn("[Email] RESEND_API_KEY or EMAIL_FROM is not set; skipping moderation email.")
    return
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `moderation/${email.kind}/${email.eventId}`,
      },
      body: JSON.stringify({
        from,
        to: [email.to],
        reply_to: SITE_CONFIG.supportEmail,
        template: {
          id: MODERATION_EMAIL_TEMPLATE[email.kind].alias,
          variables: buildTemplateVariables(email),
        },
      }),
    })
    if (!res.ok) {
      console.error(`[Email] Resend responded ${res.status}: ${await res.text()}`)
    }
  } catch (err) {
    console.error("[Email] Failed to send moderation email:", err)
  }
}
