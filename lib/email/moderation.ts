import { RESEND_API_URL, MODERATION_EMAIL_COPY, type ModerationEmailKind } from "@/constants/email"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { getListingPath } from "@/utils/urls"
import type { LaunchItemType } from "@/constants/launches"

interface ModerationEmail {
  to: string
  kind: ModerationEmailKind
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

const renderEmail = ({ kind, listing, reviewNote }: ModerationEmail) => {
  const copy = MODERATION_EMAIL_COPY[kind]
  const path = copy.linksToListing
    ? getListingPath({ itemKind: listing.itemType, slug: listing.slug })
    : ROUTES.DASHBOARD
  const url = new URL(path, SITE_CONFIG.url).toString()
  const reason = copy.showsReason && reviewNote ? reviewNote : null

  const text = [
    copy.intro(listing.name),
    reason ? `\nReason from the reviewer:\n${reason}` : "",
    `\n${copy.cta}: ${url}`,
    `\n— ${SITE_CONFIG.name}`,
  ].join("\n")

  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1c1917">
<p>${escapeHtml(copy.intro(listing.name))}</p>
${reason ? `<p style="border-left:2px dashed #a8a29e;padding-left:12px;white-space:pre-wrap">${escapeHtml(reason)}</p>` : ""}
<p><a href="${escapeHtml(url)}">${escapeHtml(copy.cta)} →</a></p>
<p style="color:#78716c">— ${escapeHtml(SITE_CONFIG.name)}</p>
</div>`

  return { subject: copy.subject(listing.name), text, html }
}

// Called from after(): a failed email is logged and never fails the moderation action.
export const sendModerationEmail = async (email: ModerationEmail) => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!apiKey || !from) {
    console.warn("[Email] RESEND_API_KEY or EMAIL_FROM is not set; skipping moderation email.")
    return
  }

  const { subject, text, html } = renderEmail(email)
  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email.to],
        reply_to: SITE_CONFIG.supportEmail,
        subject,
        text,
        html,
      }),
    })
    if (!res.ok) {
      console.error(`[Email] Resend responded ${res.status}: ${await res.text()}`)
    }
  } catch (err) {
    console.error("[Email] Failed to send moderation email:", err)
  }
}
